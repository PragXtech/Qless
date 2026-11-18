import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GeminiAssistantService, 
  AssistantMessage, 
  SupportedLanguage, 
  LANGUAGE_LABELS 
} from '../lib/geminiService';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  FileCheck, 
  HelpCircle, 
  Globe 
} from 'lucide-react';

export const AiAssistantModal: React.FC = () => {
  const { currentOrg } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I am your AI Service Assistant for ${currentOrg?.name || 'Qless'}. You can ask me what documents you need, check waiting guidelines, or inquire about hospital/bank procedures. How can I help?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your current browser. You can still type your questions!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (language === 'hi') recognitionRef.current.lang = 'hi-IN';
        else if (language === 'kn') recognitionRef.current.lang = 'kn-IN';
        else recognitionRef.current.lang = 'en-US';

        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Speech recognition start error:', e);
      }
    }
  };

  const speakText = (text: string) => {
    if (!isSpeakingEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_]/g, ''));
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech failed:', e);
    }
  };

  const handleSend = async (questionText?: string) => {
    const query = questionText || input;
    if (!query.trim() || isLoading) return;

    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await GeminiAssistantService.askAssistant(
        query,
        currentOrg?.id || 'org-apollo-1',
        language
      );

      const aiMsg: AssistantMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: res.text,
        checklist: res.checklist,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      speakText(res.text);
    } catch (e) {
      console.error('AI assistant error:', e);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I apologize, but I could not reach the verification service. Please consult the service desk.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'What documents do I need for General OPD?',
    'What happens if I miss my turn?',
    'How is estimated waiting time calculated?',
    'Can I book an appointment instead of walk-in?'
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-400 text-white shadow-premium hover:shadow-glow hover:scale-105 transition-all flex items-center gap-2 group"
        aria-label="Open AI Service Assistant"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-xs font-bold pr-1 hidden sm:inline">Ask AI Assistant</span>
      </button>

      {/* Assistant Modal Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[95vw] sm:w-[420px] max-h-[600px] h-[80vh] bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl border border-border-light dark:border-border-dark shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 transition-colors">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-700 to-brand-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5 leading-tight">
                  Qless AI Assistant
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-white/20">Gemini</span>
                </h3>
                <p className="text-[10px] text-brand-100">
                  {currentOrg?.name} Directory
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Spoken voice toggle */}
              <button
                onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
                className={`p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors ${
                  isSpeakingEnabled ? 'bg-white/30 text-amber-300' : 'opacity-80'
                }`}
                title={isSpeakingEnabled ? 'Voice output enabled' : 'Voice output muted'}
              >
                {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Multilingual Selector Bar */}
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/60 border-b border-border-light dark:border-border-dark flex items-center justify-between text-xs">
            <span className="text-text-secLight flex items-center gap-1 text-[11px]">
              <Globe className="w-3 h-3 text-brand-500" /> Language:
            </span>
            <div className="flex items-center gap-1">
              {(['en', 'kn', 'hi'] as SupportedLanguage[]).map(langKey => (
                <button
                  key={langKey}
                  onClick={() => setLanguage(langKey)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    language === langKey
                      ? 'bg-brand-500 text-white'
                      : 'text-text-secLight hover:text-text-mainLight'
                  }`}
                >
                  {LANGUAGE_LABELS[langKey].native}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-brand-500 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-text-mainLight dark:text-text-mainDark rounded-tl-none border border-border-light dark:border-border-dark'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Document Checklist Display */}
                  {m.checklist && m.checklist.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-border-light dark:border-border-dark space-y-1.5">
                      <span className="font-bold text-[11px] text-brand-600 dark:text-brand-300 flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" /> Required Checklist:
                      </span>
                      {m.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] bg-white dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                          <input type="checkbox" className="mt-0.5 accent-brand-500" />
                          <div>
                            <span className="font-medium text-text-mainLight dark:text-text-mainDark">
                              {item.item}
                            </span>
                            {item.hint && (
                              <p className="text-[10px] text-text-secLight">{item.hint}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-text-secLight mt-0.5 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-text-secLight text-xs italic">
                <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-spin" />
                <span>Checking official directory & Gemini AI...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/40 border-t border-border-light dark:border-border-dark flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-text-secLight hover:text-brand-600 hover:border-brand-400 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-surface-cardLight dark:bg-surface-cardDark border-t border-border-light dark:border-border-dark flex items-center gap-2">
            <button
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'text-text-secLight hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isListening ? 'Listening...' : 'Voice Input (STT)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? 'Listening to your voice...' : 'Ask about services or documents...'}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-brand-400 rounded-xl px-3 py-2 text-xs text-text-mainLight dark:text-text-mainDark focus:outline-none"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
