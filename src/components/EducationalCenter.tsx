import React, { useState } from "react";
import { EDUCATIONAL_CURRICULUM, DAILY_TIPS } from "../utils";
import { 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  ArrowRightCircle, 
  CheckCircle,
  HelpCircleIcon
} from "lucide-react";

interface Question {
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    text: "Which of the following household waste gases has the highest immediate greenhouse potential?",
    options: ["Carbon Dioxide (CO2)", "Methane (CH4)", "Nitrogen Gas (N2)", "Oxygen (O2)"],
    correct: 1, // Methane
    explanation: "Methane (CH4), typically released from household food scraps composting in landfill environments, has over 25-28 times the heat-trapped potency of CO2 over a 100-year timescale."
  },
  {
    text: "What single transition yields the highest relative individual carbon reduction?",
    options: ["Switching to plastic shopping bags", "Replacing standard incandescent house bulbs with LEDs", "Lowering faucet hot water flow slightly", "Sorting paper items from plastic bins"],
    correct: 1, // LED bulbs
    explanation: "Replacing standard high-watt incandescent bulbs with qualified LED versions uses up to 75% less energy and saves massive recurring carbon outputs quickly."
  },
  {
    text: "Why are electric vehicles (EVs) fundamentally lower-emission, even when powered on coal utility grids?",
    options: ["EVs do not use energy or weight structures", "Electric drivetrains are nearly 3-4 times more efficient than chemical combustion engines", "Electricity does not have carbon dimensions", "Coal energy does not emit greenhouse gases"],
    correct: 1,
    explanation: "Electric motors convert over 85-90% of electrical power into actual kinetic motion, whereas chemical internal combustion engines (ICE) waste 70-80% of fuel energy strictly as thermal heat."
  }
];

export default function EducationalCenter() {
  // Accordion active topic state
  const [activeTopic, setActiveTopic] = useState<string | null>("climate-basics");
  
  // Random daily tip state
  const [tipIndex, setTipIndex] = useState(0);

  // Quiz interactive state
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [answeredState, setAnsweredState] = useState<"unanswered" | "answered">("unanswered");

  const toggleTopic = (id: string) => {
    setActiveTopic(activeTopic === id ? null : id);
  };

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
  };

  const handleQuizAnswer = (optIndex: number) => {
    if (answeredState === "answered") return;
    
    setSelectedOption(optIndex);
    setAnsweredState("answered");

    if (optIndex === QUIZ_QUESTIONS[activeQuestion].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setAnsweredState("unanswered");
    if (activeQuestion + 1 < QUIZ_QUESTIONS.length) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setActiveQuestion(0);
    setSelectedOption(null);
    setQuizFinished(false);
    setQuizScore(0);
    setAnsweredState("unanswered");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-800">
      
      {/* LEFT 2 COLUMNS: TOPIC CURRICULUM */}
      <div className="lg:col-span-2 space-y-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-4">
            <BookOpen className="text-emerald-800" size={18} />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight font-sans">Environmental Education Center</h3>
          </div>

          <div className="space-y-3">
            {EDUCATIONAL_CURRICULUM.map((topic) => {
              const isOpen = activeTopic === topic.id;
              return (
                <div key={topic.id} className="border border-slate-100 hover:border-slate-200 rounded-xl overflow-hidden transition-all duration-200">
                  <button
                    id={`topic-toggle-${topic.id}`}
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className="w-full text-left p-4 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 text-sm md:text-base tracking-tight block">{topic.title}</span>
                      <span className="text-slate-400 text-xxs block leading-normal">{topic.summary}</span>
                    </div>
                    {isOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                  </button>

                  {isOpen && (
                    <div className="p-4 md:p-6 bg-white border-t border-slate-100 space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed max-w-none">
                      {topic.content.split("\n\n").map((para, pIdx) => {
                        if (para.startsWith("###")) {
                          return (
                            <h4 key={pIdx} className="font-bold text-slate-900 text-sm md:text-base border-b border-slate-50 pb-1 mt-3 first:mt-0">
                              {para.replace("###", "").trim()}
                            </h4>
                          );
                        }
                        if (para.startsWith("-")) {
                          return (
                            <ul key={pIdx} className="list-disc pl-5 space-y-2 mt-1">
                              {para.split("\n").map((line, lIdx) => (
                                <li key={lIdx}>{line.replace("-", "").trim()}</li>
                              ))}
                            </ul>
                          );
                        }
                        if (para.match(/^\d+\./)) {
                          return (
                            <ol key={pIdx} className="list-decimal pl-5 space-y-2 mt-1">
                              {para.split("\n").map((line, lIdx) => (
                                <li key={lIdx}>{line.replace(/^\d+\./, "").trim()}</li>
                              ))}
                            </ol>
                          );
                        }
                        return <p key={pIdx}>{para}</p>;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT SIDEBAR COLUMN: TIP OF THE DAY & INTERACTIVE QUIZ */}
      <div className="space-y-6">
        
        {/* Daily tip card */}
        <div id="educational-daily-tip" className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-emerald-300" size={18} />
            <span className="text-emerald-200 text-xxs font-bold uppercase tracking-wider block">Daily Sustainability Tip</span>
          </div>

          <p className="text-sm md:text-base font-medium leading-relaxed italic text-emerald-50">
            "{DAILY_TIPS[tipIndex]}"
          </p>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextTip}
              className="px-3 py-1.5 bg-emerald-100/10 hover:bg-emerald-100/20 text-emerald-300 text-xxs font-bold rounded-lg transition shrink-0 select-none cursor-pointer outline-none"
            >
              Next Environmental tip &rarr;
            </button>
          </div>
        </div>

        {/* Interactive Knowledge Quiz */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
            <HelpCircle className="text-slate-800 animate-pulse-slow" size={18} />
            <h4 className="text-sm font-bold text-slate-900 tracking-tight font-sans uppercase">Sustainability Quiz</h4>
          </div>

          {/* QUIZ ACTIVE STATUS */}
          {!quizFinished ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-slate-400 text-xxs font-mono font-bold select-none">
                <span>Quiz progress</span>
                <span>Question {activeQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-700 rounded-full transition-all duration-300" 
                  style={{ width: `${((activeQuestion) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question body */}
              <div className="space-y-3 mt-1 text-slate-800">
                <p className="text-xs md:text-sm font-bold leading-snug">{QUIZ_QUESTIONS[activeQuestion].text}</p>
                
                <div className="space-y-2">
                  {QUIZ_QUESTIONS[activeQuestion].options.map((opt, oIdx) => {
                    const isAnswered = answeredState === "answered";
                    const isCorrectOption = oIdx === QUIZ_QUESTIONS[activeQuestion].correct;
                    const isSelected = oIdx === selectedOption;

                    let btnStyle = "border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600";
                    if (isAnswered) {
                      if (isCorrectOption) btnStyle = "bg-emerald-100 border-emerald-300 text-emerald-800 font-semibold";
                      else if (isSelected) btnStyle = "bg-rose-100 border-rose-300 text-rose-800";
                      else btnStyle = "border-slate-100 text-slate-400 opacity-60";
                    }

                    return (
                      <button
                        key={oIdx}
                        id={`quiz-opt-${activeQuestion}-${oIdx}`}
                        type="button"
                        onClick={() => handleQuizAnswer(oIdx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-3 border text-xs md:text-sm rounded-xl transition flex items-center gap-2 select-none outline-none ${btnStyle} ${!isAnswered ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <span className="font-mono font-bold text-xxs uppercase bg-slate-100/80 px-1.5 py-0.5 rounded mr-1">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Answer Explanation & Next Trigger */}
              {answeredState === "answered" && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Award size={14} className="text-emerald-700 animate-bounce-slow" /> Rationale Review
                  </div>
                  <p className="text-slate-500 text-xxs leading-relaxed">
                    {QUIZ_QUESTIONS[activeQuestion].explanation}
                  </p>
                  <div className="flex justify-end pt-1">
                    <button
                      id="quiz-next-question-btn"
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xxs font-bold rounded-lg shadow transition flex items-center gap-1 cursor-pointer outline-none"
                    >
                      Next Question <ArrowRightCircle size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // FINISHED STATE
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-800 mb-2">
                <CheckCircle size={28} />
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-slate-800">Quiz Completed!</h5>
                <p className="text-xxs text-slate-400 font-semibold uppercase tracking-wider">
                  You scored <strong className="text-emerald-700 font-mono font-bold">{quizScore} / {QUIZ_QUESTIONS.length}</strong> correct responses.
                </p>
              </div>
              <p className="text-slate-500 text-xxs leading-normal max-w-xs mx-auto">
                Decarbonization is driven by small, daily adjustments. Keep consulting educational sheets to sharpen your environmental awareness.
              </p>
              <button
                id="quiz-retry-btn"
                type="button"
                onClick={handleResetQuiz}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-bold rounded-xl transition cursor-pointer outline-none"
              >
                Retry Sustainability Quiz
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
