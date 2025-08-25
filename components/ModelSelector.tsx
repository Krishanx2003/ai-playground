'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Cpu, Zap, Globe, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import modelsData from '@/data/models.json'; // Updated import

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  category: string;
}

interface ModelSelectorProps {
  selectedModel: Model | null;
  onModelSelect: (model: Model) => void;
  className?: string;
}

const categoryIcons = {
  chat: Zap,
  multimodal: Globe,
  enterprise: Building2,
  'open-source': Globe,
} as const;

export function ModelSelector({ selectedModel, onModelSelect, className }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load models from imported JSON
    const loadedModels = (modelsData as { models: Model[] }).models;
    setModels(loadedModels);

    if (!selectedModel && loadedModels.length > 0) {
      onModelSelect(loadedModels[0]);
    }
  }, [selectedModel, onModelSelect]);

  return (
    <div className={cn("relative", className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Cpu className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm">
              {selectedModel?.name || 'Select a model'}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedModel?.provider || 'No model selected'}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl max-h-96 overflow-y-auto">
              {models.map((model, index) => {
                const IconComponent = categoryIcons[model.category as keyof typeof categoryIcons] || Cpu;
                const isSelected = selectedModel?.id === model.id;

                return (
                  <motion.button
                    key={model.id}
                    onClick={() => {
                      onModelSelect(model);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center space-x-3 p-4 text-left hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
                      isSelected && "bg-primary/10 border-l-2 border-l-primary",
                      index === 0 && "rounded-t-xl",
                      index === models.length - 1 && "rounded-b-xl"
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-primary/20" : "bg-muted/50"
                    )}>
                      <IconComponent className={cn(
                        "h-4 w-4",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium text-sm truncate",
                        isSelected && "text-primary"
                      )}>
                        {model.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {model.provider} • {model.maxTokens.toLocaleString()} tokens
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {model.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}