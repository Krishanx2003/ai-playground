'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Play, 
  Square, 
  Zap,
  Sparkles,
  Github
} from 'lucide-react';
import { ModelSelector } from '@/components/ModelSelector';
import { PromptEditor } from '@/components/PromptEditor';
import { ParametersPanel } from '@/components/ParametersPanel';
import { ChatOutput } from '@/components/ChatOutput';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  category: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  prompt: string;
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
  };
}

interface Parameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

function ThemeToggle() {
  const { theme, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2.5 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <motion.div
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </motion.div>
    </motion.button>
  );
}

function PlaygroundContent() {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [prompt, setPrompt] = useState('');
  const [parameters, setParameters] = useState<Parameters>({
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
    topK: 40,
    frequencyPenalty: 0,
    presencePenalty: 0
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateLoad = useCallback((template: Template) => {
    setParameters(prev => ({
      ...prev,
      temperature: template.parameters.temperature,
      maxTokens: template.parameters.maxTokens,
      topP: template.parameters.topP
    }));
  }, []);

  const simulateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response with streaming effect
    const responses = [
      "I understand you'd like me to help with that. Let me provide you with a comprehensive response based on your prompt.",
      `Thank you for your question about "${userMessage.slice(0, 50)}...". Here's my detailed analysis and recommendations.`,
      "Based on the parameters you've set and the model you've selected, I can provide you with a tailored response that matches your specific requirements.",
      "This is a simulated response from the AI playground. In a real implementation, this would connect to the actual AI model API.",
      `Your prompt: "${userMessage.slice(0, 100)}..." is interesting and I'll address each aspect systematically.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           ` This response was generated with temperature ${parameters.temperature}, max tokens ${parameters.maxTokens}, and top-p ${parameters.topP}.`;
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedModel) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      const responseContent = await simulateResponse(prompt);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error generating the response. Please try again.',
        timestamp: new Date(),
        status: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  const canGenerate = prompt.trim() && selectedModel && !isGenerating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <motion.div
                className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  AI Playground
                </h1>
             
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.a
                href="https://github.com/Krishanx2003/ai-playground"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View on GitHub"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
          {/* Left sidebar - Model and Parameters */}
          <div className="lg:col-span-3 space-y-6 overflow-y-auto">
            <ModelSelector
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
            
            <ParametersPanel
              parameters={parameters}
              onChange={setParameters}
              maxTokensLimit={selectedModel?.maxTokens || 4096}
            />
          </div>

          {/* Center - Prompt Editor */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="flex-1">
              <PromptEditor
                value={prompt}
                onChange={setPrompt}
                onTemplateLoad={handleTemplateLoad}
                placeholder="Enter your prompt here... You can also load templates to get started quickly."
              />
            </div>
            
            {/* Generate button */}
            <motion.button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                "flex items-center justify-center space-x-3 w-full py-4 px-6 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                canGenerate
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              whileHover={canGenerate ? { scale: 1.02 } : undefined}
              whileTap={canGenerate ? { scale: 0.98 } : undefined}
            >
              {isGenerating ? (
                <>
                  <Square className="h-5 w-5" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  <span>Generate Response</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Right - Chat Output */}
          <div className="lg:col-span-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            <ChatOutput
              messages={messages}
              onClear={handleClearMessages}
              isGenerating={isGenerating}
              className="h-full"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <PlaygroundContent />
    </ThemeProvider>
  );
}