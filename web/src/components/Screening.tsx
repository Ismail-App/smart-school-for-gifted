import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export type ScreeningResult = {
  ideas: string[];
  categories: string[];
  novelty: number; // 1-5
  fluency: number;
  flexibility: number;
  total: number;
  recommendations: string[];
};

const ALL_CATEGORIES = [
  "حوسبة",
  "رياضيات",
  "علوم",
  "فن",
  "ريادة",
  "مجتمع",
];

export default function Screening({ onComplete }: { onComplete: (r: ScreeningResult) => void }) {
  const [idea, setIdea] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [novelty, setNovelty] = useState(3);

  const fluency = ideas.length;
  const flexibility = cats.length;

  const recommendations = useMemo(() => {
    const rec: string[] = [];
    if (cats.includes("حوسبة")) rec.push("البرمجة والذكاء الاصطناعي");
    if (cats.includes("رياضيات")) rec.push("الرياضيات والأولمبياد");
    if (cats.includes("علوم")) rec.push("STEM والبحث العلمي");
    if (rec.length === 0) rec.push("الريادة والابتكار");
    return Array.from(new Set(rec)).slice(0, 3);
  }, [cats]);

  const total = useMemo(() => {
    // وزن مبسط: الطلاقة*2 + المرونة*3 + الحداثة*1
    return fluency * 2 + flexibility * 3 + novelty * 1;
  }, [fluency, flexibility, novelty]);

  const addIdea = () => {
    const v = idea.trim();
    if (!v) return;
    setIdeas((prev) => Array.from(new Set([...prev, v])));
    setIdea("");
  };

  const toggleCat = (c: string, checked: boolean) => {
    setCats((prev) => (checked ? Array.from(new Set([...prev, c])) : prev.filter((x) => x !== c)));
  };

  const submit = () => {
    const res: ScreeningResult = {
      ideas,
      categories: cats,
      novelty,
      fluency,
      flexibility,
      total,
      recommendations,
    };
    onComplete(res);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">نشاط توليد الأفكار (5 دقائق)</h3>
        <p className="text-sm text-muted-foreground">اكتب أكبر عدد ممكن من الأفكار حول تحسين تجربة المدرسة الرقمية للموهوبين.</p>
        <div className="mt-3 flex items-center gap-2">
          <Input placeholder="أضف فكرة..." value={idea} onChange={(e) => setIdea(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addIdea()} />
          <Button onClick={addIdea}>إضافة</Button>
        </div>
        {ideas.length > 0 && (
          <ul className="mt-3 list-disc space-y-1 pe-4 text-sm">
            {ideas.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h4 className="mb-2 font-semibold">مجالات الاهتمام</h4>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {ALL_CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <Checkbox checked={cats.includes(c)} onCheckedChange={(v) => toggleCat(c, Boolean(v))} />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-1 block">تقييمك لمدى جدة أفكارك (1–5)</Label>
        <Slider min={1} max={5} step={1} value={[novelty]} onValueChange={(v) => setNovelty(v[0] ?? 3)} className="max-w-sm" />
        <div className="mt-1 text-sm text-muted-foreground">القيمة الحالية: {novelty}</div>
      </div>

      <div className="rounded-lg border p-4 text-sm">
        <div>الطلاقة: {fluency} | المرونة: {flexibility} | الجدة: {novelty} | المجموع: {total}</div>
        <div className="mt-1">توصيات مبدئية: {recommendations.join("، ") || "—"}</div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => onComplete({ ideas: [], categories: [], novelty: 0, fluency: 0, flexibility: 0, total: 0, recommendations: [] })}>إلغاء</Button>
        <Button onClick={submit}>حفظ النتيجة</Button>
      </div>
    </div>
  );
}
