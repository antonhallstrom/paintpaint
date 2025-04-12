/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";
const STORAGE_KEYS = ["projects", "surfaces", "workLog"] as const;
type StorageKey = (typeof STORAGE_KEYS)[number];

export default function Page() {
  const [selectedKey, setSelectedKey] = useState<StorageKey | "">("");
  const [importValue, setImportValue] = useState("");
  const [storedValue, setStoredValue] = useState("");

  useEffect(() => {
    if (selectedKey) {
      const val = localStorage.getItem(selectedKey);
      setStoredValue(val || "");
    }
  }, [selectedKey]);

  const handleExport = () => {
    if (!selectedKey) return;
    const val = localStorage.getItem(selectedKey);
    if (!val) return alert("Inget innehåll att exportera");
    navigator.clipboard.writeText(val);
    alert(`✅ ${selectedKey} kopierad till urklipp`);
  };

  const handleImport = () => {
    if (!selectedKey) return alert("Välj en key först");
    try {
      const parsed = JSON.parse(importValue);
      localStorage.setItem(selectedKey, JSON.stringify(parsed));
      alert(`✅ ${selectedKey} har uppdaterats`);
      setStoredValue(JSON.stringify(parsed, null, 2));
    } catch (e) {
      alert("⚠️ Ogiltig JSON");
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">LocalStorage Export / Import</h1>
      <Link href="/" className="w-full">
        <Button variant="outline">
          <Home className="w-6 h-6" />
          Hem
        </Button>
      </Link>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block font-medium mb-1">Välj nyckel</label>
          <Select onValueChange={setSelectedKey as unknown as any}>
            <SelectTrigger>
              <SelectValue placeholder="Välj nyckel" />
            </SelectTrigger>
            <SelectContent>
              {STORAGE_KEYS.map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExport} disabled={!selectedKey}>
          📋 Exportera
        </Button>
      </div>

      {selectedKey && (
        <div>
          <label className="block font-medium mb-1">
            Klistra in JSON (ersätter hela <code>{selectedKey}</code>):
          </label>
          <Textarea
            placeholder="Klistra in JSON här..."
            value={importValue}
            onChange={(e) => setImportValue(e.target.value)}
            rows={8}
          />
          <Button className="mt-2" onClick={handleImport}>
            🔄 Importera
          </Button>

          <div className="mt-6">
            <p className="font-semibold mb-1">
              📦 Nuvarande innehåll i <code>{selectedKey}</code>:
            </p>
            <Textarea value={storedValue} readOnly rows={10} />
          </div>
        </div>
      )}
    </main>
  );
}
