import numpy as np
import logging
from typing import List, Dict, Any, Tuple
import google.generativeai as genai
from repositories.fir_repository import FIRRepository

logger = logging.getLogger("crimemind.search")

class SearchService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        if api_key:
            genai.configure(api_key=api_key)

    def get_embedding(self, text: str) -> List[float]:
        if not self.api_key:
            # Fallback to simple bag-of-words mock vector if no API key is set
            return [0.1] * 768
        
        try:
            result = genai.embed_content(
                model="models/embedding-001",
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Error calling Gemini Embedding API: {e}")
            # Mock vector fallback on error
            return [0.1] * 768

    def cosine_similarity(self, v1: List[float], v2: List[float]) -> float:
        a = np.array(v1)
        b = np.array(v2)
        dot = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(dot / (norm_a * norm_b))

    def search_similar_firs(self, query: str, fir_repository: FIRRepository, limit: int = 3) -> List[Tuple[Dict[str, Any], float]]:
        """
        Grounded semantic search: computes similarities between user query and FIR records.
        """
        firs = fir_repository.get_all_firs()
        if not firs:
            return []

        query_vector = self.get_embedding(query)
        scored_firs = []

        for fir in firs:
            # Combine fields to embed for semantic contextual matching
            corpus = f"FIR: {fir.get('fir_number')}. Type: {fir.get('crime_type')}. District: {fir.get('district')}. Modus Operandi: {fir.get('modus_operandi')}. Description: {fir.get('description')}"
            
            # For demonstration speed or offline fallback, we can use quick word-matching if API is slow
            fir_vector = self.get_embedding(corpus)
            similarity = self.cosine_similarity(query_vector, fir_vector)
            
            # Simple keyword boost for exact district / crime type matches
            lowered_query = query.lower()
            if fir.get('crime_type', '').lower() in lowered_query:
                similarity += 0.15
            if fir.get('district', '').lower() in lowered_query:
                similarity += 0.1
            
            # Normalize to 0-1 scale
            similarity = min(1.0, max(0.0, similarity))
            scored_firs.append((fir, similarity))

        # Sort by similarity score descending
        scored_firs.sort(key=lambda x: x[1], reverse=True)
        return scored_firs[:limit]

    def find_similar_cases(self, target_fir: Dict[str, Any], fir_repository: FIRRepository, limit: int = 3) -> List[Dict[str, Any]]:
        """
        Compare a specific FIR against other FIRs in database to identify matching Modus Operandi and suspect overlaps.
        """
        firs = fir_repository.get_all_firs()
        target_id = int(target_fir.get("rowid") or target_fir.get("ROWID") or 0)
        target_corpus = f"Type: {target_fir.get('crime_type')}. Modus: {target_fir.get('modus_operandi')}. Description: {target_fir.get('description')}"
        target_vector = self.get_embedding(target_corpus)
        
        matches = []
        for fir in firs:
            fid = int(fir.get("rowid") or fir.get("ROWID") or 0)
            if fid == target_id:
                continue
            
            corpus = f"Type: {fir.get('crime_type')}. Modus: {fir.get('modus_operandi')}. Description: {fir.get('description')}"
            vector = self.get_embedding(corpus)
            similarity = self.cosine_similarity(target_vector, vector)
            
            # sus overlap
            target_sus = [s["name"] for s in fir_repository.get_accused_by_fir_id(target_id)]
            current_sus = [s["name"] for s in fir_repository.get_accused_by_fir_id(fid)]
            overlap_sus = list(set(target_sus) & set(current_sus))
            
            if overlap_sus:
                similarity += 0.2
            
            similarity = min(1.0, max(0.0, similarity))
            
            matches.append({
                "fir_id": fid,
                "fir_number": fir.get("fir_number"),
                "title": f"Incident at {fir.get('police_station')} ({fir.get('crime_type')})",
                "similarity": similarity,
                "matching_mo": fir.get("modus_operandi"),
                "overlap_suspects": overlap_sus
            })
            
        matches.sort(key=lambda x: x["similarity"], reverse=True)
        return matches[:limit]
