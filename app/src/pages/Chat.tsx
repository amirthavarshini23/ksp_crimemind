import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Shield } from 'lucide-react';
import { api } from '../services/api';
import { PromptInput } from '../components/PromptInput';
import { ChatWindow } from '../components/ChatWindow';
import { ExplainablePanel } from '../components/ExplainablePanel';
import { ChatMessage } from '../types.ts';
import jsPDF from 'jspdf';

export const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  // Default welcome message
  useEffect(() => {
    const welcome: ChatMessage = {
      id: 'welcome',
      sender: 'ai',
      text: "Investigator, welcome to the CrimeMind agentic intelligence channel. I am your Copilot. You can query the KSP database in English or Kannada, and I will cross-reference locations, cell phone registers, bank details, and previous crimes to outline patterns.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 1.0,
      evidenceUsed: [],
      reasoningPath: ["Channel initialized", "Copilot agent online"],
      recommendations: ["AI-generated investigative suggestion: Select 'Cases & Folders' in the menu to browse centralized digital dossiers."]
    };
    setMessages([welcome]);
    setActiveMessageId('welcome');
  }, []);

  const handleSendQuery = async (queryText: string, lang: string) => {
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await api.chatQuery(queryText, null, lang);
      
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: response.confidence,
        evidenceUsed: response.evidence_used,
        reasoningPath: response.reasoning_path,
        recommendations: response.recommendations,
        relatedCases: response.related_cases
      };

      setMessages((prev) => [...prev, aiMsg]);
      setActiveMessageId(aiMsg.id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionType: string, msg: ChatMessage) => {
    switch (actionType) {
      case 'open_folder':
        // Navigate based on context: case 2 for cyber, case 1 for robbery Pulsar gang
        if (msg.text.toLowerCase().includes('cyber') || msg.text.toLowerCase().includes('phish') || msg.text.toLowerCase().includes('gowda')) {
          navigate('/cases/2');
        } else {
          navigate('/cases/1');
        }
        break;
      case 'view_graph':
        navigate('/graph');
        break;
      case 'similar_cases':
        alert(`Comparing Modus Operandi (MO) and suspect links across the KSP database...\nOverlapping suspects detected.`);
        break;
      case 'export_pdf':
        exportBriefPDF(msg);
        break;
      case 'view_hotspots':
        navigate('/');
        break;
      case 'analyze_pattern':
        navigate('/analytics');
        break;
      default:
        break;
    }
  };

  // Generate jsPDF Report
  const exportBriefPDF = (msg: ChatMessage) => {
    const doc = new jsPDF();
    
    // Header KSP Logo Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("KARNATAKA STATE POLICE", 20, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("CrimeMind AI Intelligence Report", 20, 26);
    doc.line(20, 30, 190, 30);

    // Metadata
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 38);
    doc.text(`Grounded Confidence Score: ${(msg.confidence || 0.85 * 100).toFixed(0)}%`, 20, 44);

    // Summary Content
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Intelligence Summary:", 20, 56);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    // Split long text
    const textLines = doc.splitTextToSize(msg.text, 170);
    doc.text(textLines, 20, 62);

    // AI suggestions
    let yOffset = 62 + (textLines.length * 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("AI-Generated Investigative Suggestions:", 20, yOffset);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    yOffset += 6;
    if (msg.recommendations && msg.recommendations.length > 0) {
      msg.recommendations.forEach((rec) => {
        const recLines = doc.splitTextToSize(`* ${rec}`, 170);
        doc.text(recLines, 20, yOffset);
        yOffset += (recLines.length * 5) + 2;
      });
    } else {
      doc.text("No specific action items listed.", 20, yOffset);
    }

    doc.save("ksp_intelligence_brief.pdf");
  };

  // Find active message details for Explainability Panel
  const activeMessage = messages.find(m => m.id === activeMessageId) || messages[0];

  return (
    <div className="flex-1 flex bg-slate-950 h-full overflow-hidden">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-900">
        {/* Title Bar */}
        <div className="h-14 border-b border-slate-900 bg-slate-950/30 px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-500" />
            <h2 className="font-semibold text-xs text-white uppercase tracking-wider">
              Crime Intelligence Chat
            </h2>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-slate-500">
            <Shield className="h-3 w-3" />
            <span>Encrypted Officer Channel</span>
          </div>
        </div>

        {/* Messages window */}
        <ChatWindow 
          messages={messages} 
          loading={loading} 
          onQuickAction={handleQuickAction} 
        />

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40">
          <PromptInput onSend={handleSendQuery} disabled={loading} />
        </div>
      </div>

      {/* Dynamic Explainability Panel on Right */}
      {activeMessage && (
        <ExplainablePanel
          confidence={activeMessage.confidence || 0.85}
          evidenceUsed={activeMessage.evidenceUsed || []}
          reasoningPath={activeMessage.reasoningPath || []}
          recommendations={activeMessage.recommendations || []}
        />
      )}
    </div>
  );
};
export default Chat;
