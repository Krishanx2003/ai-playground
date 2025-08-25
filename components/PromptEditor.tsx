'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Save, 
  Trash2, 
  Copy, 
  Download,
  Sparkles,
  ChevronDown,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import templatesData from '@/data/templates.json'; // Import the templates.json file

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

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onTemplateLoad?: (template: Template) => void;
  className?: string;
  placeholder?: string;
}

export function PromptEditor({
  value,
  onChange,
  onTemplateLoad,
  className,
  placeholder = "Enter your prompt here..."
}: PromptEditorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    // Load templates from imported JSON
    const loadedTemplates = (templatesData as { templates: Template[] }).templates;
    setTemplates(loadedTemplates);
  }, []);

  useEffect(() => {
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    const chars = value.length;
    setWordCount(words);
    setCharCount(chars);
  }, [value]);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  const handleTemplateSelect = (template: Template) => {
    onChange(template.prompt);
    onTemplateLoad?.(template);
    setIsTemplateMenuOpen(false);
    setSearchQuery('');
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const handleDownloadPrompt = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearPrompt = () => {
    onChange('');
    textareaRef.current?.focus();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Prompt Editor</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <motion.button
              onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-expanded={isTemplateMenuOpen}
              aria-haspopup="true"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">Templates</span>
              <ChevronDown className={cn(
                "h-3 w-3 transition-transform",
                isTemplateMenuOpen && "rotate-180"
              )} />
            </motion.button>

            <AnimatePresence>
              {isTemplateMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-80 z-50"
                >
                  <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl">
                    <div className="p-4 border-b border-border/50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search templates..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                        <div key={category}>
                          <div className="px-4 py-2 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {category}
                          </div>
                          {categoryTemplates.map((template) => (
                            <motion.button
                              key={template.id}
                              onClick={() => handleTemplateSelect(template)}
                              className="w-full p-4 text-left hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
                              whileHover={{ x: 4 }}
                            >
                              <p className="font-medium text-sm">{template.name}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {template.prompt.slice(0, 100)}...
                              </p>
                            </motion.button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={handleCopyPrompt}
            className="p-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!value.trim()}
            aria-label="Copy prompt"
          >
            <Copy className="h-4 w-4" />
          </motion.button>

          <motion.button
            onClick={handleDownloadPrompt}
            className="p-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!value.trim()}
            aria-label="Download prompt"
          >
            <Download className="h-4 w-4" />
          </motion.button>

          <motion.button
            onClick={handleClearPrompt}
            className="p-2 bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!value.trim()}
            aria-label="Clear prompt"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </motion.button>
        </div>
      </div>

      {/* Main editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[300px] p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
          aria-label="Prompt input"
        />
        
        {/* Character/word count */}
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          {charCount} characters • {wordCount} words
        </div>
      </div>

      {/* Close dropdown overlay */}
      {isTemplateMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsTemplateMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}