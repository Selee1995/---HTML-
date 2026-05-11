import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowLeft, Clipboard, FileText, Info, Mail, RefreshCcw, ShieldCheck, Sparkles, X } from "lucide-react";
import { questions } from "../data/questions";
import { results } from "../data/results";
import type { AnswerMap, QuizResult, ResultId } from "../data/types";
import { calculateResult, getScoreMap } from "../utils/scoring";

type Stage = "landing" | "quiz" | "loading" | "result";
type DialogState = "feedback" | "about" | null;

const disclaimer =
  "本测试为非官方影视娱乐人格测试，仅用于娱乐和自我观察；不涉及现实人物、现实机构或政治评价，也不构成心理诊断。";

const loadingLines = [
  "正在调取组织档案...",
  "正在比对你的风险边界...",
  "正在生成汉东人格画像...",
];

const resultTheme: Record<ResultId, string> = {
  hou_liangping: "from-sky-900 to-red-900",
  li_dakang: "from-red-900 to-zinc-900",
  sha_ruijin: "from-zinc-900 to-stone-800",
  gao_yuliang: "from-stone-900 to-slate-900",
  qi_tongwei: "from-red-950 to-amber-950",
  chen_hai: "from-slate-900 to-sky-950",
  lu_yike: "from-rose-950 to-zinc-900",
  zhao_donglai: "from-blue-950 to-stone-900",
  yi_xuexi: "from-emerald-950 to-stone-900",
  sun_liancheng: "from-indigo-950 to-zinc-900",
  zhao_dehan: "from-amber-950 to-stone-950",
  ding_yizhen: "from-orange-950 to-red-950",
};

const portraitMeta: Record<ResultId, { keyword: string; seal: string; accent: string; variant: number }> = {
  hou_liangping: { keyword: "原则 / 证据", seal: "查", accent: "#38bdf8", variant: 1 },
  li_dakang: { keyword: "推进 / KPI", seal: "进", accent: "#f97316", variant: 2 },
  sha_ruijin: { keyword: "全局 / 定调", seal: "局", accent: "#e5e7eb", variant: 3 },
  gao_yuliang: { keyword: "体面 / 留白", seal: "衡", accent: "#c4b5fd", variant: 4 },
  qi_tongwei: { keyword: "执念 / 上桌", seal: "争", accent: "#facc15", variant: 5 },
  chen_hai: { keyword: "直线 / 硬刚", seal: "正", accent: "#93c5fd", variant: 6 },
  lu_yike: { keyword: "执行 / 边界", seal: "界", accent: "#fb7185", variant: 7 },
  zhao_donglai: { keyword: "现场 / 护航", seal: "扛", accent: "#60a5fa", variant: 8 },
  yi_xuexi: { keyword: "苦干 / 底线", seal: "实", accent: "#6ee7b7", variant: 9 },
  sun_liancheng: { keyword: "避险 / 宇宙", seal: "远", accent: "#a5b4fc", variant: 10 },
  zhao_dehan: { keyword: "低调 / 欲望", seal: "藏", accent: "#fbbf24", variant: 11 },
  ding_yizhen: { keyword: "风向 / 出口", seal: "跑", accent: "#fdba74", variant: 12 },
};

const resultById = Object.fromEntries(results.map((result) => [result.id, result])) as Record<ResultId, QuizResult>;

function App() {
  const [stage, setStage] = useState<Stage>("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [copied, setCopied] = useState(false);
  const [activeArchiveId, setActiveArchiveId] = useState<ResultId | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [feedbackContext, setFeedbackContext] = useState("开始界面");

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = stage === "quiz" ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const finalResult = useMemo(() => calculateResult(questions, results, answers), [answers]);
  const activeArchive = activeArchiveId ? resultById[activeArchiveId] : null;
  const scoreMap = useMemo(() => getScoreMap(questions, results, answers), [answers]);
  const topScores = useMemo(
    () =>
      [...results]
        .sort((a, b) => scoreMap[b.id] - scoreMap[a.id])
        .slice(0, 3)
        .map((result) => ({ result, score: scoreMap[result.id] })),
    [scoreMap],
  );
  const backdropUrl =
    stage === "landing"
      ? "/backdrops/landing-office-bg.svg"
      : stage === "quiz"
        ? "/backdrops/quiz-dossier-bg.svg"
        : "/backdrops/institutional-bg.svg";
  const backdropOverlay =
    stage === "landing"
      ? "bg-[linear-gradient(90deg,rgba(246,241,232,0.8)_0%,rgba(246,241,232,0.58)_45%,rgba(246,241,232,0.16)_100%),radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.52),transparent_34%)]"
      : stage === "quiz"
        ? "bg-[linear-gradient(90deg,rgba(246,241,232,0.84)_0%,rgba(246,241,232,0.7)_54%,rgba(246,241,232,0.4)_100%),radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.26),transparent_34%)]"
        : "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_34%),linear-gradient(90deg,rgba(246,241,232,0.96)_0%,rgba(246,241,232,0.72)_48%,rgba(246,241,232,0.5)_100%)]";
  const backdropPosition = stage === "landing" ? "62% center" : stage === "quiz" ? "48% center" : "center";

  function startQuiz() {
    setAnswers({});
    setCurrentIndex(0);
    setCopied(false);
    setActiveArchiveId(null);
    setStage("quiz");
  }

  function chooseOption(optionIndex: number) {
    const nextAnswers = { ...answers, [currentQuestion.id]: optionIndex };
    setAnswers(nextAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    setStage("loading");
    window.setTimeout(() => setStage("result"), 900);
  }

  function goBack() {
    if (currentIndex === 0) {
      setStage("landing");
      return;
    }

    setCurrentIndex((index) => index - 1);
  }

  async function copyShareText() {
    await navigator.clipboard.writeText(`${finalResult.shareText} 来测测你最像《人民的名义》中的谁。`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function openArchive(resultId: ResultId) {
    setActiveArchiveId(resultId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeArchive() {
    setActiveArchiveId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openFeedback(context: string) {
    setFeedbackContext(context);
    setDialogState("feedback");
  }

  function openAbout() {
    setDialogState("about");
  }

  function closeDialog() {
    setDialogState(null);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f6f1e8] text-zinc-950">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#eadcc4]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100 transition-[background-image] duration-500"
          style={{ backgroundImage: `url(${backdropUrl})`, backgroundPosition: backdropPosition }}
        />
        <div className={`absolute inset-0 ${backdropOverlay}`} />
      </div>

      <div className="relative z-10">
        {stage === "landing" && <LandingPage onStart={startQuiz} onOpenFeedback={openFeedback} onOpenAbout={openAbout} />}
        {stage === "quiz" && (
          <QuizPage
            currentIndex={currentIndex}
            progress={progress}
            selectedIndex={answers[currentQuestion.id]}
            onBack={goBack}
            onChoose={chooseOption}
          />
        )}
        {stage === "loading" && <LoadingPage />}
        {stage === "result" && activeArchive && (
          <ArchivePage result={activeArchive} onBack={closeArchive} onOpenArchive={openArchive} />
        )}
        {stage === "result" && !activeArchive && (
          <ResultPage
            result={finalResult}
            topScores={topScores}
            copied={copied}
            onCopy={copyShareText}
            onOpenArchive={openArchive}
            onRestart={startQuiz}
            onOpenFeedback={() => openFeedback(`结果页 · ${finalResult.name}`)}
            onOpenAbout={openAbout}
          />
        )}

        {dialogState === "feedback" && <FeedbackModal contextLabel={feedbackContext} onClose={closeDialog} />}
        {dialogState === "about" && <AboutModal onClose={closeDialog} />}

        <footer className="mx-auto max-w-5xl px-5 pb-6 text-center text-xs leading-5 text-zinc-500">
          {answeredCount > 0 && stage !== "landing" ? `已记录 ${answeredCount}/${questions.length} 道选择。` : disclaimer}
        </footer>
      </div>
    </main>
  );
}

function LandingPage({
  onStart,
  onOpenFeedback,
  onOpenAbout,
}: {
  onStart: () => void;
  onOpenFeedback: (context: string) => void;
  onOpenAbout: () => void;
}) {
  return (
    <section className="relative isolate mx-auto flex min-h-[calc(100vh-48px)] max-w-5xl flex-col justify-between overflow-hidden px-5 py-6 sm:px-8 lg:py-10">
      <img
        alt="原创群像剪影"
        className="pointer-events-none absolute -right-[430px] bottom-24 z-0 h-[520px] max-w-none opacity-60 mix-blend-multiply sm:-right-52 sm:h-[620px] lg:hidden"
        src="/backdrops/cast-silhouette-4x3.png"
        style={{
          WebkitMaskImage: "linear-gradient(to left, black 42%, rgba(0,0,0,0.72) 62%, transparent 92%)",
          maskImage: "linear-gradient(to left, black 42%, rgba(0,0,0,0.72) 62%, transparent 92%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 z-0 h-56 bg-gradient-to-t from-[#f6f1e8] via-[#f6f1e8]/80 to-transparent lg:hidden" />

      <nav className="relative z-10 flex items-center justify-between text-sm text-zinc-700">
        <span className="inline-flex items-center gap-2 font-medium">
          <FileText className="size-4" />
          汉东人格档案
        </span>
        <span>16 题</span>
      </nav>

      <div className="relative z-10 grid items-end gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 border border-red-900/20 bg-white/55 px-3 py-1 text-sm text-red-950 shadow-sm">
            <ShieldCheck className="size-4" />
            非官方娱乐测试
          </p>
          <h1 className="font-serif text-[clamp(2.7rem,9vw,6.8rem)] font-black leading-[0.96] tracking-normal text-zinc-950">
            测测你最像
            <span className="block text-red-900">《人民的名义》中的谁</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
            一份不太正经的复杂组织生存测试。你是调查者、改革派、权谋型观察者，还是低电量避险者？
          </p>
          <button
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 bg-red-900 px-6 text-base font-semibold text-white shadow-seal transition hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-900/20"
            onClick={onStart}
            type="button"
          >
            <Sparkles className="size-5" />
            开始接受组织考察
          </button>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="inline-flex h-11 items-center gap-2 border border-red-900/20 bg-white/70 px-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-red-900/40 hover:bg-white focus:outline-none focus:ring-4 focus:ring-red-900/15"
              onClick={() => onOpenFeedback("开始界面")}
              type="button"
            >
              <Mail className="size-4" />
              想向作者提意见？
            </button>
            <button
              className="inline-flex h-11 items-center gap-2 border border-zinc-300 bg-white/70 px-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-red-900/40 hover:bg-white focus:outline-none focus:ring-4 focus:ring-red-900/15"
              onClick={onOpenAbout}
              type="button"
            >
              <Info className="size-4" />
              关于作者
            </button>
          </div>
        </div>

        <div className="relative hidden min-h-[520px] overflow-hidden border border-red-950/15 bg-[#17110f] p-6 shadow-seal lg:block">
          <img
            alt="原创群像剪影"
            className="absolute inset-0 h-full w-full object-cover opacity-95"
            src="/backdrops/cast-silhouette-4x3.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-red-100">内部流转 / 群像档案</p>
              <div className="mt-8 space-y-3 text-3xl font-black text-white">
                <p>权力关系</p>
                <p>风险边界</p>
                <p>组织生存</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-white/68">{disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuizPage({
  currentIndex,
  progress,
  selectedIndex,
  onBack,
  onChoose,
}: {
  currentIndex: number;
  progress: number;
  selectedIndex?: number;
  onBack: () => void;
  onChoose: (optionIndex: number) => void;
}) {
  const question = questions[currentIndex];

  return (
    <section className="mx-auto min-h-[calc(100vh-48px)] max-w-3xl px-5 py-6 sm:px-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-sm text-zinc-600">
          <button className="inline-flex items-center gap-1 font-medium text-zinc-800" onClick={onBack} type="button">
            <ArrowLeft className="size-4" />
            上一页
          </button>
          <span>
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
        <div className="h-2 bg-zinc-200">
          <div className="h-full bg-red-900 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <article className="border border-red-950/10 bg-white/78 p-5 shadow-seal backdrop-blur sm:p-8">
        <p className="mb-3 text-sm font-semibold text-red-900">第 {currentIndex + 1} 题</p>
        <h2 className="text-2xl font-black leading-9 text-zinc-950 sm:text-3xl sm:leading-10">{question.text}</h2>
        <div className="mt-7 grid gap-3">
          {question.options.map((option, optionIndex) => (
            <button
              className={`min-h-16 border px-4 py-4 text-left text-base leading-6 transition focus:outline-none focus:ring-4 focus:ring-red-900/15 ${
                selectedIndex === optionIndex
                  ? "border-red-900 bg-red-900 text-white"
                  : "border-zinc-200 bg-[#fbf8f2] text-zinc-800 hover:border-red-900/40 hover:bg-white"
              }`}
              key={option.text}
              onClick={() => onChoose(optionIndex)}
              type="button"
            >
              <span className="mr-3 font-semibold">{String.fromCharCode(65 + optionIndex)}.</span>
              {option.text}
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}

function LoadingPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-48px)] max-w-xl place-items-center px-5">
      <div className="w-full border border-red-950/10 bg-white/80 p-7 text-center shadow-seal">
        <div className="mx-auto mb-6 size-16 animate-pulse rounded-full border-8 border-red-900/80" />
        <h2 className="text-2xl font-black">正在生成人格档案</h2>
        <div className="mt-5 space-y-2 text-sm text-zinc-600">
          {loadingLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultPage({
  result,
  topScores,
  copied,
  onCopy,
  onOpenArchive,
  onRestart,
  onOpenFeedback,
  onOpenAbout,
}: {
  result: QuizResult;
  topScores: Array<{ result: QuizResult; score: number }>;
  copied: boolean;
  onCopy: () => void;
  onOpenArchive: (resultId: ResultId) => void;
  onRestart: () => void;
  onOpenFeedback: () => void;
  onOpenAbout: () => void;
}) {
  return (
    <section className="mx-auto max-w-4xl px-5 py-6 sm:px-8 lg:py-10">
      <article className="overflow-hidden border border-red-950/10 bg-white shadow-seal">
        <div className={`bg-gradient-to-br ${resultTheme[result.id]} px-5 py-7 text-white sm:px-8`}>
          <div className="grid items-end gap-7 md:grid-cols-[1fr_280px]">
            <div>
              <p className="text-sm font-semibold text-white/70">你的汉东人格档案</p>
              <h2 className="mt-4 font-serif text-5xl font-black tracking-normal sm:text-7xl">{result.name}</h2>
              <p className="mt-3 text-lg font-semibold text-red-100">{result.archetype}</p>
              <p className="mt-6 max-w-2xl text-xl font-semibold leading-8">{result.summary}</p>
            </div>
            <CharacterPortrait result={result} />
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-2">
          <ResultBlock title="你的优势" items={result.strengths} />
          <ResultBlock title="你的风险点" items={result.risks} />

          <section className="lg:col-span-2">
            <h3 className="mb-2 text-sm font-bold text-red-900">组织生存建议</h3>
            <p className="border-l-4 border-red-900 bg-[#fbf8f2] p-4 leading-7 text-zinc-700">{result.advice}</p>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold text-red-900">人格接近度前三</h3>
            <div className="space-y-3">
              {topScores.map(({ result: scoreResult, score }) => (
                <div key={scoreResult.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{scoreResult.name}</span>
                    <span>{score}</span>
                  </div>
                  <div className="h-2 bg-zinc-200">
                    <div className="h-full bg-red-900" style={{ width: `${Math.min(100, Math.max(8, score * 6))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold text-red-900">适配搭档</h3>
            <div className="mb-5 flex flex-wrap gap-2">
              {result.compatible.map((id) => (
                <button
                  className="border border-red-900/20 bg-[#fbf8f2] px-3 py-2 text-sm text-zinc-800 transition hover:border-red-900 hover:bg-white focus:outline-none focus:ring-4 focus:ring-red-900/15"
                  key={id}
                  onClick={() => onOpenArchive(id)}
                  type="button"
                >
                  {resultById[id].name}
                </button>
              ))}
            </div>
            <h3 className="mb-3 text-sm font-bold text-red-900">危险搭档</h3>
            <div className="flex flex-wrap gap-2">
              {result.dangerous.map((id) => (
                <button
                  className="border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:border-red-900/60 hover:bg-[#fbf8f2] focus:outline-none focus:ring-4 focus:ring-red-900/15"
                  key={id}
                  onClick={() => onOpenArchive(id)}
                  type="button"
                >
                  {resultById[id].name}
                </button>
              ))}
            </div>
          </section>

          <section className="lg:col-span-2">
            <h3 className="mb-3 text-sm font-bold text-red-900">分享文案</h3>
            <p className="min-h-20 bg-[#fbf8f2] p-4 leading-7 text-zinc-800">{result.shareText}</p>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2">
            <button
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-red-900 px-5 font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-900/20"
              onClick={onCopy}
              type="button"
            >
              <Clipboard className="size-5" />
              {copied ? "已复制" : "复制分享文案"}
            </button>
            <button
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 border border-zinc-300 bg-white px-5 font-semibold text-zinc-900 transition hover:border-red-900/40 focus:outline-none focus:ring-4 focus:ring-red-900/15"
              onClick={onRestart}
              type="button"
            >
              <RefreshCcw className="size-5" />
              重新测试
            </button>
          </div>

          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <button
              className="inline-flex h-11 items-center gap-2 border border-red-900/20 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:border-red-900/40 hover:bg-[#fbf8f2] focus:outline-none focus:ring-4 focus:ring-red-900/15"
              onClick={onOpenFeedback}
              type="button"
            >
              <Mail className="size-4" />
              想向作者提意见？
            </button>
            <button
              className="inline-flex h-11 items-center gap-2 border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:border-red-900/40 hover:bg-[#fbf8f2] focus:outline-none focus:ring-4 focus:ring-red-900/15"
              onClick={onOpenAbout}
              type="button"
            >
              <Info className="size-4" />
              关于作者
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}

function ArchivePage({
  result,
  onBack,
  onOpenArchive,
}: {
  result: QuizResult;
  onBack: () => void;
  onOpenArchive: (resultId: ResultId) => void;
}) {
  return (
    <section className="mx-auto max-w-4xl px-5 py-6 sm:px-8 lg:py-10">
      <button className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-800" onClick={onBack} type="button">
        <ArrowLeft className="size-4" />
        返回我的测试结果
      </button>

      <article className="overflow-hidden border border-red-950/10 bg-white shadow-seal">
        <div className={`bg-gradient-to-br ${resultTheme[result.id]} p-5 text-white sm:p-8`}>
          <div className="grid gap-7 md:grid-cols-[280px_1fr] md:items-end">
            <CharacterPortrait result={result} />
            <div>
              <p className="text-sm font-semibold text-white/65">角色档案库 / Archive</p>
              <h2 className="mt-4 font-serif text-5xl font-black tracking-normal sm:text-7xl">{result.name}</h2>
              <p className="mt-3 text-lg font-semibold text-red-100">{result.archetype}</p>
              <p className="mt-6 text-xl font-semibold leading-8">{result.summary}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-2">
          <ResultBlock title="档案优势" items={result.strengths} />
          <ResultBlock title="风险边界" items={result.risks} />

          <section className="lg:col-span-2">
            <h3 className="mb-2 text-sm font-bold text-red-900">组织生存建议</h3>
            <p className="border-l-4 border-red-900 bg-[#fbf8f2] p-4 leading-7 text-zinc-700">{result.advice}</p>
          </section>

          <ArchiveRelations title="适配搭档" ids={result.compatible} onOpenArchive={onOpenArchive} />
          <ArchiveRelations title="危险搭档" ids={result.dangerous} onOpenArchive={onOpenArchive} />
        </div>
      </article>
    </section>
  );
}

function ArchiveRelations({
  title,
  ids,
  onOpenArchive,
}: {
  title: string;
  ids: ResultId[];
  onOpenArchive: (resultId: ResultId) => void;
}) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold text-red-900">{title}</h3>
      <div className="grid gap-2">
        {ids.map((id) => (
          <button
            className="flex items-center justify-between bg-[#fbf8f2] px-4 py-3 text-left text-zinc-800 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-red-900/15"
            key={id}
            onClick={() => onOpenArchive(id)}
            type="button"
          >
            <span>{resultById[id].name}</span>
            <span className="text-sm text-zinc-500">{resultById[id].archetype}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CharacterPortrait({ result }: { result: QuizResult }) {
  const meta = portraitMeta[result.id];
  const [imageFailed, setImageFailed] = useState(false);
  const tilt = (meta.variant % 5) - 2;
  const shoulder = 74 + (meta.variant % 4) * 4;
  const headX = 96 + ((meta.variant % 3) - 1) * 5;

  useEffect(() => {
    setImageFailed(false);
  }, [result.id]);

  if (!imageFailed) {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden border border-white/20 bg-black/30 shadow-2xl md:mx-0">
        <img
          alt={`${result.name} 原创档案风剪影`}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
          src={`/characters/${result.id}.webp`}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">Archive Portrait</p>
          <p className="mt-2 text-lg font-black text-white">{result.name}</p>
          <p className="text-sm text-white/75">{meta.keyword}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden border border-white/20 bg-black/20 p-4 shadow-2xl md:mx-0">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div
        className="absolute -right-4 top-5 flex size-20 rotate-12 items-center justify-center rounded-full border-[7px] text-3xl font-black"
        style={{ borderColor: meta.accent, color: meta.accent }}
      >
        {meta.seal}
      </div>
      <svg className="relative mt-5 h-56 w-full" viewBox="0 0 220 260" role="img" aria-label={`${result.name} 原创档案风剪影`}>
        <defs>
          <linearGradient id={`portrait-${result.id}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={meta.accent} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#111827" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <path
          d={`M${110 - shoulder} 238 C${82 - shoulder / 3} 190, ${138 + shoulder / 3} 190, ${110 + shoulder} 238 Z`}
          fill={`url(#portrait-${result.id})`}
          opacity="0.96"
        />
        <path
          d={`M${headX - 39} 96 C${headX - 38} 54, ${headX - 14} 29, ${headX + 14} 29 C${headX + 44} 29, ${headX + 63} 58, ${headX + 52} 101 C${headX + 46} 128, ${headX + 27} 147, ${headX + 2} 149 C${headX - 25} 151, ${headX - 43} 127, ${headX - 39} 96 Z`}
          fill="#111827"
          transform={`rotate(${tilt} ${headX} 90)`}
        />
        <path d={`M${headX - 42} 73 C${headX - 15} 47, ${headX + 24} 47, ${headX + 52} 75`} fill="none" stroke={meta.accent} strokeWidth="7" strokeLinecap="square" opacity="0.9" />
        <path d={`M${headX - 22} 164 L${headX + 25} 164`} stroke={meta.accent} strokeWidth="8" strokeLinecap="square" opacity="0.7" />
        <path d="M38 236 H182" stroke="white" strokeOpacity="0.45" strokeWidth="2" />
      </svg>
      <div className="relative mt-1 border-t border-white/20 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">Archive Portrait</p>
        <p className="mt-2 text-lg font-black text-white">{result.name}</p>
        <p className="text-sm text-white/70">{meta.keyword}</p>
      </div>
    </div>
  );
}

function ResultBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold text-red-900">{title}</h3>
      <ul className="grid gap-2">
        {items.map((item) => (
          <li className="bg-[#fbf8f2] px-4 py-3 text-zinc-800" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ModalShell({
  title,
  eyebrow,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  eyebrow: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        aria-label="关闭弹窗"
        className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"
        onClick={onClose}
        type="button"
      />
      <div className="relative w-full max-w-xl overflow-hidden border border-red-950/10 bg-[#fffdf8] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-red-950/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-900/70">{eyebrow}</p>
            <h2 className="mt-1 text-2xl font-black text-zinc-950">{title}</h2>
            {subtitle ? <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">{subtitle}</p> : null}
          </div>
          <button
            aria-label="关闭"
            className="inline-flex size-10 items-center justify-center border border-zinc-200 bg-white text-zinc-700 transition hover:border-red-900/40 hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-red-900/15"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
      </div>
    </div>
  );
}

function AboutModal({ onClose }: { onClose: () => void }) {
  const githubRepoUrl = "https://github.com/Selee1995/---HTML-";

  return (
    <ModalShell
      eyebrow="关于作者"
      subtitle="这份测试是一个娱乐向的汉东人物气质项目，重点放在人物关系、组织氛围和测完后的继续浏览体验。"
      title="作者与项目"
      onClose={onClose}
    >
      <div className="space-y-4 text-sm leading-7 text-zinc-700">
        <p>
          <strong className="text-zinc-950">作者：</strong>李斯特
        </p>
        <p>
          <strong className="text-zinc-950">项目：</strong>汉东人格档案
        </p>
        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-[#fbf8f2] p-4 text-zinc-700">
          <p className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold text-zinc-950">微信号</span>
            <span className="font-medium text-zinc-800">REVFIX</span>
          </p>
          <p className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold text-zinc-950">QQ号</span>
            <span className="font-medium text-zinc-800">1278329021</span>
          </p>
          <p className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold text-zinc-950">QQ邮箱</span>
            <a className="font-medium text-red-900 underline decoration-red-900/40 underline-offset-4" href="mailto:1278329021@qq.com">
              1278329021@qq.com
            </a>
          </p>
          <p className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold text-zinc-950">GitHub仓库</span>
            <a
              className="font-medium text-red-900 underline decoration-red-900/40 underline-offset-4"
              href={githubRepoUrl}
              rel="noreferrer"
              target="_blank"
            >
              github.com/Selee1995/---HTML-
            </a>
          </p>
        </div>
        <p>
          这是一个由 Codex 协助制作的非官方娱乐测试网站。它借用了《人民的名义》的角色气质和组织张力，
          做成了一个能测、能看档案、能继续点角色的网页。
        </p>
        <div className="rounded-2xl border border-zinc-200 bg-[#fbf8f2] p-4 text-zinc-700">
          如果你喜欢这个方向，我们后面还可以继续把角色档案、结果页文案和分享体验打磨得更完整。
        </div>
      </div>
    </ModalShell>
  );
}

function FeedbackModal({ contextLabel, onClose }: { contextLabel: string; onClose: () => void }) {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [botField, setBotField] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (botField.trim()) {
      setStatus("success");
      return;
    }

    const trimmedMessage = message.trim();
    const trimmedNickname = nickname.trim();

    if (!trimmedMessage) {
      setStatus("error");
      setErrorMessage("先写一点建议再发送吧。");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: trimmedNickname,
          message: trimmedMessage,
          source: contextLabel,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? payload.message ?? "发送失败，请稍后再试。");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "发送失败，请稍后再试。");
    }
  }

  return (
    <ModalShell
      eyebrow="站内反馈"
      subtitle="你可以直接在网页里写建议，不用跳转。提交后我会收到邮件，邮箱是 1278329021@qq.com。"
      title="想向作者提意见？"
      onClose={onClose}
    >
      {status === "success" ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-950">
            已发送到 <strong>1278329021@qq.com</strong>。你的建议已经进入邮箱里了，感谢你帮我继续打磨这个站点。
          </div>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:border-red-900/40 hover:bg-[#fbf8f2] focus:outline-none focus:ring-4 focus:ring-red-900/15"
            onClick={onClose}
            type="button"
          >
            关闭
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-sm leading-7 text-zinc-600">
            你可以写页面体验、题目逻辑、角色档案、文案风格这些意见。建议会直接发送到
            <strong className="text-zinc-950"> 1278329021@qq.com</strong>。
          </p>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-800">你的称呼（可选）</span>
            <input
              className="w-full border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-900/40 focus:ring-4 focus:ring-red-900/10"
              maxLength={50}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="比如：老用户 / 测试同学 / 某某"
              value={nickname}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-800">建议内容</span>
            <textarea
              className="min-h-36 w-full resize-y border border-zinc-200 bg-white px-4 py-3 text-sm leading-7 text-zinc-900 outline-none transition focus:border-red-900/40 focus:ring-4 focus:ring-red-900/10"
              maxLength={2000}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="你可以直接说哪里看着别扭，哪里希望更像正式产品。"
              required
              value={message}
            />
          </label>
          <input
            aria-hidden="true"
            className="hidden"
            onChange={(event) => setBotField(event.target.value)}
            tabIndex={-1}
            type="text"
            value={botField}
          />
          {status === "error" ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-900">
              {errorMessage}
            </div>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 bg-red-900 px-5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={status === "sending"}
              type="submit"
            >
              <Mail className="size-4" />
              {status === "sending" ? "正在发送..." : "发送建议"}
            </button>
            <button
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-900 transition hover:border-red-900/40 hover:bg-[#fbf8f2] focus:outline-none focus:ring-4 focus:ring-red-900/15"
              onClick={onClose}
              type="button"
            >
              取消
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}

export default App;
