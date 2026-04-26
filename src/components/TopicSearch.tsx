"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ALL_TOPICS } from "@/lib/data";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, X } from "lucide-react";

interface Props {
  selectedTopic: string | null;
  onSelect: (topic: string) => void;
  onClear: () => void;
}

export default function TopicSearch({ selectedTopic, onSelect, onClear }: Props) {
  const [search, setSearch] = useState(selectedTopic ?? "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_TOPICS.filter((t) => t.toLowerCase().includes(q));
  }, [search]);

  useEffect(() => {
    if (selectedTopic && search !== selectedTopic) setSearch(selectedTopic);
  }, [selectedTopic]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback(
    (topic: string) => {
      onSelect(topic);
      setSearch(topic);
      setOpen(false);
    },
    [onSelect],
  );

  const handleClear = useCallback(() => {
    onClear();
    setSearch("");
    setOpen(false);
  }, [onClear]);

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search a theme…"
          value={search}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          className="pl-9 pr-8 bg-muted/30 border-border"
        />
        {selectedTopic && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
          <Command className="bg-transparent">
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandGroup>
                {filtered.map((topic) => (
                  <CommandItem
                    key={topic}
                    value={topic}
                    onSelect={() => handleSelect(topic)}
                    className="cursor-pointer text-sm"
                  >
                    {topic}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
