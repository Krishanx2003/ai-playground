'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Thermometer, 
  Hash, 
  Target, 
  Repeat, 
  Zap,
  Info,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Parameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

interface ParametersPanelProps {
  parameters: Parameters;
  onChange: (parameters: Parameters) => void;
  maxTokensLimit?: number;
  className?: string;
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  description: string;
  icon: React.ComponentType<any>;
  suffix?: string;
}

function Slider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  description, 
  icon: Icon,
  suffix = ''
}: SliderProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <label className="text-sm font-medium">{label}</label>
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="relative"
          >
            <Info className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"
              >
                <div className="bg-popover text-popover-foreground p-2 rounded-lg shadow-lg max-w-xs text-xs">
                  {description}
                </div>
              </motion.div>
            )}
          </button>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {value.toFixed(step < 1 ? 2 : 0)}{suffix}
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`
          }}
        />
      </div>
    </div>
  );
}

export function ParametersPanel({ 
  parameters, 
  onChange, 
  maxTokensLimit = 4096,
  className 
}: ParametersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleParameterChange = (key: keyof Parameters, value: number) => {
    onChange({
      ...parameters,
      [key]: value
    });
  };

  const resetToDefaults = () => {
    onChange({
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      topK: 40,
      frequencyPenalty: 0,
      presencePenalty: 0
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Parameters</h3>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </motion.button>
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isExpanded ? 0 : 180 }}
          >
            <Settings className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="space-y-6 p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl">
          <Slider
            label="Temperature"
            value={parameters.temperature}
            onChange={(value) => handleParameterChange('temperature', value)}
            min={0}
            max={2}
            step={0.1}
            description="Controls randomness. Lower values make output more focused and deterministic, higher values make it more creative and random."
            icon={Thermometer}
          />

          <Slider
            label="Max Tokens"
            value={parameters.maxTokens}
            onChange={(value) => handleParameterChange('maxTokens', value)}
            min={1}
            max={maxTokensLimit}
            step={1}
            description="Maximum number of tokens to generate. One token is roughly 4 characters for English text."
            icon={Hash}
            suffix=" tokens"
          />

          <Slider
            label="Top P"
            value={parameters.topP}
            onChange={(value) => handleParameterChange('topP', value)}
            min={0}
            max={1}
            step={0.05}
            description="Controls diversity via nucleus sampling. Lower values focus on high-probability words, higher values allow more variety."
            icon={Target}
          />

          <Slider
            label="Top K"
            value={parameters.topK}
            onChange={(value) => handleParameterChange('topK', value)}
            min={1}
            max={100}
            step={1}
            description="Limits the model to consider only the top K most likely next tokens. Lower values make output more focused."
            icon={Zap}
          />

          <Slider
            label="Frequency Penalty"
            value={parameters.frequencyPenalty}
            onChange={(value) => handleParameterChange('frequencyPenalty', value)}
            min={-2}
            max={2}
            step={0.1}
            description="Penalizes repeated tokens based on their frequency. Higher values reduce repetition, lower values allow more repetition."
            icon={Repeat}
          />

          <Slider
            label="Presence Penalty"
            value={parameters.presencePenalty}
            onChange={(value) => handleParameterChange('presencePenalty', value)}
            min={-2}
            max={2}
            step={0.1}
            description="Penalizes repeated tokens based on whether they appear in the text. Encourages talking about new topics."
            icon={Target}
          />
        </div>
      </motion.div>
    </div>
  );
}