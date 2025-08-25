'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Copy, 
  Download, 
  Trash2,
  User,
  Bot,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

interface ChatOutputProps {
  messages: Message[];
  onClear: () => void;
  isGenerating?: boolean;
  className?: string;
}

interface MessageBubbleProps {
  message: Message;
  onCopy: (content: string) => void;
}

function MessageBubble({ message, onCopy }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    onCopy(message.content);
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />;
      case 'sent':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "group flex gap-3 max-w-4xl",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message content */}
      <div className={cn(
        "flex-1 space-y-2",
        isUser ? "text-right" : "text-left"
      )}>
        <div className={cn(
          "inline-block p-4 rounded-2xl max-w-[80%] relative",
          isUser 
            ? "bg-primary text-primary-foreground ml-auto" 
            : "bg-card border border-border/50"
        )}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
          
          {/* Actions overlay */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "absolute top-2 flex items-center space-x-1",
                  isUser ? "left-2" : "right-2"
                )}
              >
                <motion.button
                  onClick={handleCopy}
                  className="p-1 bg-background/80 backdrop-blur-sm border border-border/50 rounded hover:bg-background transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Copy message"
                >
                  <Copy className="h-3 w-3" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message metadata */}
        <div className={cn(
          "flex items-center space-x-2 text-xs text-muted-foreground",
          isUser ? "justify-end" : "justify-start"
        )}>
          <Clock className="h-3 w-3" />
          <span>
            {message.timestamp.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {getStatusIcon()}
        </div>
      </div>
    </motion.div>
  );
}

export function ChatOutput({ messages, onClear, isGenerating, className }: ChatOutputProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId('temp');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleCopyAll = async () => {
    const allContent = messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    try {
      await navigator.clipboard.writeText(allContent);
      setCopiedId('all');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy all messages:', err);
    }
  };

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Chat Output</h3>
          {messages.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({messages.length} message{messages.length !== 1 ? 's' : ''})
            </span>
          )}
        </div>
        
        {messages.length > 0 && (
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleCopyAll}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={copiedId === 'all'}
            >
              <Copy className="h-3 w-3" />
              <span>{copiedId === 'all' ? 'Copied!' : 'Copy All'}</span>
            </motion.button>
            
            <motion.button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-3 w-3" />
              <span>Export</span>
            </motion.button>
            
            <motion.button
              onClick={onClear}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
              <span className="text-destructive">Clear</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="p-6 bg-muted/50 rounded-full mb-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium mb-2">No messages yet</h4>
              <p className="text-muted-foreground max-w-md">
                Start a conversation by entering a prompt and generating a response. 
                Your chat history will appear here.
              </p>
            </motion.div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={handleCopyMessage}
              />
            ))
          )}
        </AnimatePresence>
        
        {/* Typing indicator */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-card border border-border/50 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}