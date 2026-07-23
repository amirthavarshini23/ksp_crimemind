import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Languages } from 'lucide-react';

interface PromptInputProps {
  onSend: (text: string, language: string) => void;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('en'); // 'en' or 'kn'
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech recognition availability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';
    }
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice transcription is not supported by your current browser. Please try Google Chrome or Microsoft Edge.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text, lang);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-lg">
      {/* Language Toggle */}
      <button
        type="button"
        onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
          lang === 'kn'
            ? 'bg-blue-600/10 border-blue-500/50 text-blue-400'
            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
        }`}
        title="Toggle language (English / Kannada)"
      >
        <Languages className="h-3.5 w-3.5" />
        <span>{lang === 'kn' ? 'ಕನ್ನಡ' : 'English'}</span>
      </button>

      {/* Input Text Box */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          lang === 'kn' 
            ? 'ಇಲ್ಲಿ ನಿಮ್ಮ ತನಿಖಾ ಪ್ರಶ್ನೆಯನ್ನು ಬರೆಯಿರಿ...' 
            : "Ask KSP Copilot (e.g. 'Show robbery cases in Mysuru' or 'Search details on Karthik Gowda')..."
        }
        className="flex-1 bg-transparent border-0 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 text-sm py-1.5"
        disabled={disabled}
      />

      {/* Voice microphone control */}
      <button
        type="button"
        onClick={toggleListening}
        className={`p-2.5 rounded-lg border transition ${
          isListening
            ? 'bg-red-500/20 border-red-500/50 text-red-500 animate-pulse'
            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
        }`}
        disabled={disabled}
        title={isListening ? "Stop listening" : "Start speaking"}
      >
        {isListening ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className={`p-2.5 rounded-lg border transition-all duration-200 ${
          text.trim() && !disabled
            ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20'
            : 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
        }`}
      >
        <Send className="h-4.5 w-4.5" />
      </button>
    </form>
  );
};
export default PromptInput;
