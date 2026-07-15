"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateAgentInstructions, updateKnowledgeBase } from "@/lib/actions/profile";

const MAX_LENGTH = 8000;

interface KnowledgeClientProps {
  initialKnowledgeBase: string;
  initialAgentInstructions: string;
}

export function KnowledgeClient({
  initialKnowledgeBase,
  initialAgentInstructions,
}: KnowledgeClientProps) {
  const [knowledgeBase, setKnowledgeBase] = useState(initialKnowledgeBase);
  const [agentInstructions, setAgentInstructions] = useState(initialAgentInstructions);
  const [savedField, setSavedField] = useState<"kb" | "instructions" | null>(null);
  const [isPending, startTransition] = useTransition();

  const saveKnowledgeBase = () => {
    startTransition(async () => {
      await updateKnowledgeBase(knowledgeBase);
      setSavedField("kb");
      setTimeout(() => setSavedField(null), 2000);
    });
  };

  const saveAgentInstructions = () => {
    startTransition(async () => {
      await updateAgentInstructions(agentInstructions);
      setSavedField("instructions");
      setTimeout(() => setSavedField(null), 2000);
    });
  };

  return (
    <>
      <div className="mb-7">
        <h1 className="mb-1 text-[26px] font-bold tracking-[var(--tracking-tight)] text-[var(--color-text)]">
          Bilim bazasi
        </h1>
        <div className="text-sm text-[var(--color-text-muted)]">
          Telegram botingiz savollarga javob berishda shu ma&apos;lumotdan foydalanadi
        </div>
      </div>

      <div className="flex max-w-[720px] flex-col gap-5">
        <Card padding="lg" shadow="sm">
          <div className="mb-4">
            <div className="mb-1 text-[15px] font-semibold text-[var(--color-text)]">
              Bilim bazasi
            </div>
            <div className="text-[13px] text-[var(--color-text-muted)]">
              Bot bilishi kerak bo&apos;lgan shaxsiy ma&apos;lumot, kontekst, faktlar
            </div>
          </div>
          <Textarea
            value={knowledgeBase}
            onChange={setKnowledgeBase}
            placeholder="Masalan: Men dasturchiman, React va Next.js bilan ishlayman. Ish jadvalim dushanba-juma, 9:00-18:00..."
            rows={10}
            maxLength={MAX_LENGTH}
            hint={`${knowledgeBase.length}/${MAX_LENGTH} belgi`}
          />
          <div className="mt-4 flex items-center gap-3">
            <Button variant="primary" size="md" onClick={saveKnowledgeBase} disabled={isPending}>
              Saqlash
            </Button>
            {savedField === "kb" && (
              <span className="text-[13px] text-[var(--color-success)]">✓ Saqlandi</span>
            )}
          </div>
        </Card>

        <Card padding="lg" shadow="sm">
          <div className="mb-4">
            <div className="mb-1 text-[15px] font-semibold text-[var(--color-text)]">
              Agent instruksiyalari
            </div>
            <div className="text-[13px] text-[var(--color-text-muted)]">
              Bot qanday ohangda, qanday qoidalar bilan javob berishi kerakligi
            </div>
          </div>
          <Textarea
            value={agentInstructions}
            onChange={setAgentInstructions}
            placeholder="Masalan: Har doim qisqa va aniq javob ber. Motivatsion jumlalar bilan yakunla. Rasmiy uslubda yozma..."
            rows={8}
            maxLength={MAX_LENGTH}
            hint={`${agentInstructions.length}/${MAX_LENGTH} belgi`}
          />
          <div className="mt-4 flex items-center gap-3">
            <Button variant="primary" size="md" onClick={saveAgentInstructions} disabled={isPending}>
              Saqlash
            </Button>
            {savedField === "instructions" && (
              <span className="text-[13px] text-[var(--color-success)]">✓ Saqlandi</span>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
