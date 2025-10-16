"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Message, AvatarMood, AvatarSettings } from "@/lib/types";
import { getAiResponse } from "@/app/actions";
import useLocalStorage from "@/hooks/use-local-storage";
import AvatarHeader from "./avatar-header";
import AvatarDisplay from "./avatar-display";
import ChatPanel from "./chat-panel";
import SettingsPanel from "./settings-panel";

const ConversationalAvatar = () => {
  const [settings, setSettings] = useLocalStorage<AvatarSettings>("avatar-settings", {
    avatarUrl: "6549c5e1b68e59e8f3f5e4d1",
    volume: 1.0,
    speechRate: 1.0,
    voiceName: null,
  });

  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [avatarMood, setAvatarMood] = useState<AvatarMood>("neutral");
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isProcessing]);
  
  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = settings.speechRate;
    utterance.pitch = 1.0;
    utterance.volume = settings.volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAvatarMood("talking");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setAvatarMood("neutral");
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      setAvatarMood("neutral");
    };

    synthRef.current.speak(utterance);
  }, [selectedVoice, settings.speechRate, settings.volume]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      if(!synthRef.current) return;
      const availableVoices = synthRef.current.getVoices();
      setVoices(availableVoices);
      
      if (availableVoices.length > 0) {
        let voiceToSelect: SpeechSynthesisVoice | undefined;
        if (settings.voiceName) {
          voiceToSelect = availableVoices.find(v => v.name === settings.voiceName);
        }
        if (!voiceToSelect) {
          voiceToSelect = availableVoices.find(v => v.lang.startsWith('en-US')) || 
                          availableVoices.find(v => v.lang.startsWith('en')) || 
                          availableVoices[0];
        }
        setSelectedVoice(voiceToSelect || null);
      }
    };

    loadVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasSpeechRecognition = !!SpeechRecognition;
    setSpeechRecognitionAvailable(hasSpeechRecognition);

    if (hasSpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError('');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error, event.message);
        let errorMsg = `An error occurred: ${event.error}.`;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errorMsg = "Microphone access denied. Please allow microphone permissions in your browser settings. For Chrome, click the lock icon in the address bar. For other browsers, check site settings.";
        } else if (event.error === 'no-speech') {
          errorMsg = "No speech detected. Please make sure your microphone is working and try again.";
        } else if (event.error === 'network') {
          errorMsg = "Network error. The Web Speech API requires an internet connection. Please check yours and try again.";
        } else if (event.error === 'audio-capture') {
          errorMsg = "Audio capture error. Your microphone might be in use by another application.";
        } else if (event.error === 'aborted') {
          errorMsg = "Voice input was aborted. If you didn't stop it, this might be a browser issue.";
        }
        setVoiceError(errorMsg);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
        setVoiceError("Voice recognition is not supported on this browser. For best results, please use Google Chrome on a desktop computer.");
    }

    return () => {
      recognitionRef.current?.abort();
      synthRef.current?.cancel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (voices.length > 0) {
      const voice = voices.find(v => v.name === settings.voiceName);
      setSelectedVoice(voice || voices[0]);
    }
  }, [settings.voiceName, voices]);


  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim() || isProcessing) return;

    if (isListening) {
      recognitionRef.current?.stop();
    }

    const userMessage: Message = { role: "user", content: textToSend };
    setConversation((prev) => [...prev, userMessage]);
    setMessage("");
    setIsProcessing(true);
    setAvatarMood("thinking");

    try {
      const aiResponse = await getAiResponse([...conversation, userMessage], textToSend);
      
      const assistantMessage: Message = { role: "assistant", content: aiResponse };
      setConversation((prev) => [...prev, assistantMessage]);
      speak(aiResponse);
    } catch(e) {
      console.error(e);
      const assistantMessage: Message = { role: "assistant", content: "Sorry, I had trouble generating a response." };
      setConversation((prev) => [...prev, assistantMessage]);
      speak(assistantMessage.content);
    } finally {
      setIsProcessing(false);
      setAvatarMood("neutral");
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
        setVoiceError("Voice recognition is not initialized or supported.");
        return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        setVoiceError('');
        recognitionRef.current.start();
      } catch (error: any) {
        console.error("Could not start recognition:", error);
        if (error.name === 'InvalidStateError') {
          // This can happen if start() is called while it's already starting.
          // We can try to reset it.
          setIsListening(false);
        } else {
          setVoiceError("Could not start voice recognition. Please check browser permissions and ensure your microphone is not in use.");
        }
      }
    }
  };

  const stopSpeaking = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsSpeaking(false);
    setAvatarMood("neutral");
  };

  const clearConversation = () => {
    setConversation([]);
    stopSpeaking();
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <AvatarHeader isSpeaking={isSpeaking} openSettings={() => setShowSettingsPanel(true)} />
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <AvatarDisplay 
          avatarUrl={settings.avatarUrl} 
          avatarMood={avatarMood}
          isSpeaking={isSpeaking}
          onStopSpeaking={stopSpeaking}
        />
        <ChatPanel 
          conversation={conversation}
          isProcessing={isProcessing}
          messagesEndRef={messagesEndRef}
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          isListening={isListening}
          toggleListening={toggleListening}
          speechRecognitionAvailable={speechRecognitionAvailable}
          clearConversation={clearConversation}
          voiceError={voiceError}
          setVoiceError={setVoiceError}
        />
      </main>

      {showSettingsPanel && (
        <SettingsPanel
          settings={settings}
          setSettings={setSettings}
          voices={voices}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          closePanel={() => setShowSettingsPanel(false)}
        />
      )}
    </div>
  );
};

export default ConversationalAvatar;
