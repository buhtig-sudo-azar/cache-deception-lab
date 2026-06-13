'use client';

import { useState, useEffect } from 'react';
import { useModelStore } from '@/store/model-store';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Cpu, ChevronsUpDown, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_MODELS = [
  { id: 'moonshotai/kimi-k2.6:free', name: 'Kimi K2.6', label: 'Kimi K2.6 (Free)' },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', label: 'DeepSeek R1 (Free)' },
  { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', label: 'Gemma 3 27B (Free)' },
  { id: 'meta-llama/llama-4-maverick:free', name: 'Llama 4 Maverick', label: 'Llama 4 Maverick (Free)' },
];

export function ModelSelector() {
  const { currentModel, setCurrentModel, _hydrate } = useModelStore();
  const [open, setOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    _hydrate();
  }, [_hydrate]);

  const currentLabel = DEFAULT_MODELS.find(m => m.id === currentModel)?.label || currentModel.split('/').pop() || currentModel;

  const applyModel = (model: string) => {
    setCurrentModel(model);
    setOpen(false);
    toast({
      title: 'Model applied',
      description: `Active: ${model.split('/').pop()}`,
    });
  };

  const handleCustomSubmit = () => {
    const model = customInput.trim();
    if (!model) return;
    applyModel(model);
    setCustomInput('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'gap-1.5 h-8 px-2.5 text-xs font-medium transition-all',
            'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
          )}
        >
          <Cpu className="h-3 w-3 text-primary" />
          <span className="max-w-[100px] sm:max-w-[160px] truncate">
            {currentLabel}
          </span>
          <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0" align="end">
        <Command>
          <div className="flex items-center border-b border-border px-3">
            <CommandInput placeholder="Search models..." className="flex-1" />
          </div>
          <CommandList>
            <CommandEmpty>No model found</CommandEmpty>
            <CommandGroup heading="Free Models">
              {DEFAULT_MODELS.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.label + ' ' + model.id}
                  onSelect={() => applyModel(model.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Check
                    className={cn(
                      'h-3.5 w-3.5 shrink-0',
                      currentModel === model.id ? 'opacity-100 text-primary' : 'opacity-0'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{model.label}</div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate">
                      {model.id}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <div className="p-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground mb-2">Custom model ID:</p>
          <div className="flex gap-2">
            <input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="vendor/model:free"
              className="flex-1 h-8 px-2 text-xs font-mono rounded-md border border-input bg-background"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCustomSubmit();
                }
              }}
            />
            <Button
              size="sm"
              className="h-8 px-3 text-xs shrink-0"
              onClick={handleCustomSubmit}
              disabled={!customInput.trim()}
            >
              Apply
            </Button>
          </div>
        </div>

        <div className="px-3 py-2 border-t border-border">
          <ApiTokenInput />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ApiTokenInput() {
  const { apiToken, setApiToken, clearApiToken } = useModelStore();
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    const token = inputValue.trim();
    if (!token) return;
    setApiToken(token);
    setInputValue('');
    setIsExpanded(false);
    toast({
      title: 'Token saved',
      description: 'Your API token will be used for all model requests.',
    });
  };

  const handleRemove = () => {
    clearApiToken();
    toast({
      title: 'Token removed',
      description: 'Now using the platform shared token.',
    });
  };

  const hasToken = apiToken.length > 0;
  const maskedToken = hasToken ? apiToken.slice(0, 6) + '...' + apiToken.slice(-4) : '';

  if (!isExpanded && !hasToken) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center gap-1.5 h-7 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>+ Add OpenRouter token</span>
        </button>
        <p className="text-[10px] text-muted-foreground text-center">
          Get free key:{' '}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            openrouter.ai/keys
          </a>
        </p>
      </div>
    );
  }

  if (!isExpanded && hasToken) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 h-7 px-2 rounded-md border border-border bg-muted/30 text-xs">
          <span className="font-mono text-muted-foreground truncate flex-1">
            {maskedToken}
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="text-[10px] text-destructive hover:underline shrink-0"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="sk-or-v1-..."
        type="password"
        className="flex-1 h-7 px-2 text-xs font-mono rounded-md border border-input bg-background"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
          }
          if (e.key === 'Escape') {
            setIsExpanded(false);
            setInputValue('');
          }
        }}
      />
      <Button
        size="sm"
        className="h-7 px-2 text-xs shrink-0"
        onClick={handleSave}
        disabled={!inputValue.trim()}
      >
        Save
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs shrink-0"
        onClick={() => {
          setIsExpanded(false);
          setInputValue('');
        }}
      >
        Cancel
      </Button>
    </div>
  );
}
