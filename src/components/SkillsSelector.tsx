import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

const PREDEFINED_SKILLS = [
  'Python',
  'PyTorch', 
  'TensorFlow',
  'SQL',
  'FastAPI',
  'Docker',
  'LLM',
  'Prompting',
  'CV',
  'NLP',
  'LangChain',
  'GCP',
  'AWS',
  'Azure'
];

interface SkillsSelectorProps {
  value: string[];
  onChange: (skills: string[]) => void;
  error?: string;
}

export function SkillsSelector({ value, onChange, error }: SkillsSelectorProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const addSkill = (skill: string) => {
    if (!value.includes(skill) && value.length < 10) {
      onChange([...value, skill]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter(skill => skill !== skillToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addSkill(inputValue.trim());
      setInputValue('');
    }
  };

  const availableSkills = PREDEFINED_SKILLS.filter(skill => 
    !value.includes(skill) && 
    skill.toLowerCase().includes(inputValue.toLowerCase())
  );

  const canAddCustom = inputValue.trim() && 
    !PREDEFINED_SKILLS.some(skill => skill.toLowerCase() === inputValue.toLowerCase()) &&
    !value.includes(inputValue.trim());

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error && "border-destructive"
            )}
          >
            Оберіть або додайте навички ({value.length}/10)
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="Пошук або додавання навички..." 
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleInputKeyDown}
            />
            <CommandList>
              <CommandEmpty>
                {canAddCustom && value.length < 10 ? (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      addSkill(inputValue.trim());
                      setInputValue('');
                      setOpen(false);
                    }}
                  >
                    Додати "{inputValue}" як навичку
                  </Button>
                ) : (
                  <div className="py-6 text-center text-sm">
                    {value.length >= 10 ? 'Досягнуто максимум навичок (10)' : 'Навичок не знайдено'}
                  </div>
                )}
              </CommandEmpty>
              {availableSkills.length > 0 && (
                <CommandGroup>
                  {availableSkills.map((skill) => (
                    <CommandItem
                      key={skill}
                      value={skill}
                      onSelect={() => {
                        addSkill(skill);
                        setInputValue('');
                      }}
                      disabled={value.length >= 10}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(skill) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {skill}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected skills */}
      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-1 hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <p className="text-sm text-muted-foreground">
        Оберіть від 3 до 10 навичок. Можете додавати власні навички.
      </p>
    </div>
  );
}