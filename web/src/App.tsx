import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft, CheckCircle2, Star, Users, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Screening, { ScreeningResult } from "@/components/Screening";
import CertificatePreview from "@/components/CertificatePreview";

export default function Home() {
  const [email, setEmail] = useState("");
  const [authMsg, setAuthMsg] = useState<string>("");
  const [loggedEmail, setLoggedEmail] = useState<string>("");

  const [screeningOpen, setScreeningOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setLoggedEmail(data.user.email);
    });
  }, []);

  const signIn = async () => {
    setAuthMsg("");
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (error) setAuthMsg(error.message);
    else setAuthMsg("تم إرسال رابط الدخول إلى بريدك الإلكتروني.");
  };

  const onScreeningComplete = async (r: ScreeningResult) => {
    setScreeningOpen(false);
    try {
      const u = await supabase.auth.getUser();
      const userId = u.data.user?.id ?? null;
      if (userId) {
        await supabase.from("screenings").insert({
          user_id: userId,
          fluency: r.fluency,
          flexibility: r.flexibility,
          novelty: r.novelty,
          total: r.total,
          recommendations: r.recommendations,
        });
        alert("تم حفظ نتيجة الفحص بنجاح.");
      } else {
        alert("تم إكمال الفحص. لتخزين النتائج، يرجى تسجيل الدخول بالبريد الإلكتروني.");
      }
    } catch (e) {
      console.warn(e);
      alert("تم إكمال الفحص. (تعذّر الحفظ: تأكد من تهيئة جدول Supabase)");
    }
  };

  const certificateId = useMemo(() => crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={18} />
            <span className="font-semibold">المدرسة الذكية للموهوبين</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">المزايا</a>
            <a href="#assess" className="hover:text-foreground">الاختبارات</a>
            <a href="#tracks" className="hover:text-foreground">المسارات</a>
            <a href="#trust" className="hover:text-foreground">المرجعيات</a>
          </nav>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">{loggedEmail ? `حساب: ${loggedEmail}` : "تسجيل بالبريد"}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>تسجيل الدخول عبر البريد الإلكتروني</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button onClick={signIn}>إرسال رابط الدخول</Button>
                  {authMsg && <div className="text-sm text-muted-foreground">{authMsg}</div>}
                </div>
              </DialogContent>
            </Dialog>
            <Button size="sm" onClick={() => setCertOpen(true)}>معاينة شهادة</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <section className="relative flex flex-col items-start gap-6 py-14 md:py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-primary/10" />
          <h1 className="font-serif text-3xl font-bold leading-[1.2] md:text-5xl lg:text-6xl">
            المرجعية العربية للكشف ورعاية الطلبة الموهوبين (12–18)
          </h1>
          <p className="max-w-2xl text-muted-foreground md:text-lg">
            منصة متكاملة لتشخيص نقاط القوة، بناء مسارات إثرائية نوعية، تقديم دعم نفسي وأكاديمي، وإصدار شهادات رقمية موثوقة وفق أفضل الممارسات العالمية.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" className="group">
              <span>ابدأ الآن</span>
              <ArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
            </Button>
            <Button variant="outline" size="lg">أنا معلّم/مرشد</Button>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            مجاني للتجربة • يدعم العربية بالكامل • تصميم ملائم للهواتف
          </div>
        </section>

        <section id="features" className="space-y-8 py-10">
          <h2 className="text-2xl font-bold md:text-3xl">لماذا هذه المنصة؟</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Feature title="الكشف العادل" desc="منظومة ترشيح وفحص متعددة المصادر تُقلّل التحيّز وتزيد دقة التعرف على الموهبة." icon={<CheckCircle2 className="text-primary" />} />
            <Feature title="مسارات نوعية" desc="برامج إثرائية ومشاريع تطبيقية مرتبطة بالاهتمامات والقدرات الفريدة لكل طالب." icon={<Star className="text-primary" />} />
            <Feature title="دعم نفسي واجتماعي" desc="مواد وإرشاد مستند إلى أطر متخصصة لاحتياجات الطلبة الموهوبين." icon={<Users className="text-primary" />} />
            <Feature title="شهادات موثوقة" desc="شهادات رقمية برموز تحقق (QR) ومسار دبلوم في التميّز والإبداع العلمي والأكاديمي." icon={<BarChart3 className="text-primary" />} />
          </div>
        </section>

        <section id="assess" className="space-y-6 py-10">
          <h2 className="text-2xl font-bold md:text-3xl">الاختبارات والتشخيص</h2>
          <p className="max-w-3xl text-muted-foreground">
            نتّبع نهجًا متعدد الأدوات يشمل الترشيح من المعلّم/وليّ الأمر، مقاييس تقدير السلوك والإبداع، مراجعة الأعمال والإنجازات، واختبارات مهارية/معرفية عند الحاجة. لا نعيد إنتاج مواد مقنّنة محمية (مثل WISC-V أو Raven أو TTCT)، بل نتيح تكامل النتائج الرسمية أو إجراء فحوصات فحص أوليّة قصيرة داخل المنصة.
          </p>
          <div className="rounded-xl border p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">فحص إبداعي قصير (5 دقائق)</h3>
                <p className="text-sm text-muted-foreground">نشاط سريع لقياس الطلاقة والمرونة وتوليد الأفكار، بهدف التوجيه الأولي لمسارات الإثراء.</p>
              </div>
              <Button size="sm" onClick={() => setScreeningOpen(true)}>بدء الفحص</Button>
            </div>
          </div>
        </section>

        <section id="tracks" className="space-y-8 py-10">
          <h2 className="text-2xl font-bold md:text-3xl">المسارات والبرامج</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TrackCard title="البرمجة والذكاء الاصطناعي" desc="خوارزميات، برمجة تطبيقات، ذكاء اصطناعي، مشاريع عملية وتأثير مجتمعي." priorityLabel="أولوية" />
            <TrackCard title="الرياضيات والأولمبياد" desc="تدريب منهجي على حل المسائل، تفكير تجريدي، ومسابقات مثل كانجارو وBebras." priorityLabel="أولوية" />
            <TrackCard title="STEM والبحث العلمي" desc="فيزياء، كيمياء، أحياء، علوم الحاسوب، أساليب البحث والتجريب، مشاريع ومسابقات علمية." priorityLabel="أولوية" />
            <TrackCard title="الريادة والابتكار" desc="تصميم المشاريع، التفكير التصميمي، نماذج العمل، وعروض المستثمرين." />
            <TrackCard title="الفنون والتصميم" desc="تصميم بصري وصوتي، سرد رقمي، وحلول إبداعية متعددة الوسائط." />
            <TrackCard title="القيادة والأثر الاجتماعي" desc="مهارات القيادة، التواصل، المشاريع المجتمعية، والمناظرات." />
          </div>
          <p className="text-sm text-muted-foreground">بعد إكمال مسارات محدّدة بنجاح، يمكن للطالب التقدّم لاختبار نهائي والحصول على «دبلوم التميّز والإبداع العلمي والأكاديمي» (عربي/إنجليزي + QR).</p>
        </section>

        <section id="trust" className="space-y-6 py-12">
          <h2 className="text-2xl font-bold md:text-3xl">مرجعيات ومعايير نعتمدها</h2>
          <ul className="list-disc space-y-2 pe-4 text-muted-foreground">
            <li>
              <a className="underline hover:text-foreground" href="https://www.nagc.org/identification" target="_blank" rel="noreferrer">NAGC: معايير وبرامج الكشف وخيارات التسريع</a>
            </li>
            <li>
              <a className="underline hover:text-foreground" href="https://www.oecd.org/en/topics/sub-issues/creative-thinking/pisa-2022-creative-thinking.html" target="_blank" rel="noreferrer">OECD PISA 2022: إطار قياس مهارات التفكير الإبداعي</a>
            </li>
            <li>
              <a className="underline hover:text-foreground" href="https://gifted.uconn.edu/schoolwide-enrichment-model/" target="_blank" rel="noreferrer">Renzulli: نموذج الإثراء المدرسي الشامل (SEM)</a>
            </li>
            <li>
              <a className="underline hover:text-foreground" href="https://australiangiftedsupport.com/ccmword/wp-content/uploads/2014/12/Gagne_DMGT_Model.pdf" target="_blank" rel="noreferrer">Gagné: نموذج تمييز الموهبة عن الموهّبة (DMGT)</a>
            </li>
            <li>
              <a className="underline hover:text-foreground" href="https://www.sengifted.org/" target="_blank" rel="noreferrer">SENG: الاحتياجات الانفعالية والاجتماعية للموهوبين</a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} المدرسة الذكية للموهوبين — منصة عربية لرعاية الموهبة.
      </footer>

      {/* Dialogs */}
      <Dialog open={screeningOpen} onOpenChange={setScreeningOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>فحص إبداعي قصير</DialogTitle>
          </DialogHeader>
          <Screening onComplete={onScreeningComplete} />
        </DialogContent>
      </Dialog>

      <Dialog open={certOpen} onOpenChange={setCertOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>معاينة شهادة</DialogTitle>
          </DialogHeader>
          <CertificatePreview studentName={loggedEmail || "طالب/ة"} programName="البرمجة والذكاء الاصطناعي" certificateId={certificateId} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-5">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function TrackCard({ title, desc, priorityLabel }: { title: string; desc: string; priorityLabel?: string }) {
  return (
    <div className="rounded-xl border p-5">
      <div className="mb-1 flex items-center gap-2">
        <h3 className="font-semibold">{title}</h3>
        {priorityLabel ? <Badge className="bg-accent text-accent-foreground">{priorityLabel}</Badge> : null}
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
