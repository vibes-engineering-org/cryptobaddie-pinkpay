"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useLanguage, type Language } from "~/hooks/use-language";

const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "sw" as Language, name: "Kiswahili", flag: "🇰🇪" },
  { code: "ha" as Language, name: "Hausa", flag: "🇳🇬" },
  { code: "yo" as Language, name: "Yorùbá", flag: "🇳🇬" },
];

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
      <SelectTrigger className="w-40">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span>{languages.find(l => l.code === language)?.flag}</span>
            <span>{languages.find(l => l.code === language)?.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}