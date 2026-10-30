"use client";

import React, { useState } from "react";
import { StudentProfile, LearnExplanation } from "@/types";
import { QlooComparisonCard } from "./QlooComparisonCard";
import {
  GraduationCap,
  Gamepad2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Users2,
  Lightbulb,
  Loader2
} from "lucide-react";

interface LearnModuleProps {
  currentProfile: StudentProfile;
}

export const LearnModule: React.FC<LearnModuleProps> = ({ currentProfile }) => {
  const [selectedSubject, setSelectedSubject] = useState("Computer Science & Physics");
  const [selectedTopic, setSelectedTopic] = useState("Entropy & Thermodynamic Irreversibility");
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [studySessionPartner] = useState("Elena Rostova");
  const [studySessionActive, setStudySessionActive] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const [explanation, setExplanation] = useState<LearnExplanation>({
    subject: "Computer Science & Physics",
    topic: "Entropy & Thermodynamic Irreversibility",
    coreExplanation:
      "Entropy (S = k_B * ln(Omega)) quantifies the total number of microscopic arrangements (microstates, Omega) that manifest as the same macroscopic state. The Second Law of Thermodynamics states that the entropy of an isolated system never decreases over time—not due to mechanical enforcement, but because high-entropy states possess overwhelmingly higher statistical probability.",
    analogyAnchor: {
      tasteEntity: currentProfile.taste_entities[1]?.name || "Portal 2 & Steins;Gate",
      domain: "video_game / anime",
      analogyText:
        "Consider an Aperture Science test chamber in Portal 2. If you launch a Companion Cube into an infinite portal velocity loop, its trajectory eventually scatters and chaotic momentum dissipates into thermal microstates unless constrained. In Steins;Gate, Rintaro Okabe attempts to reverse causality by sending D-mails back in time. Even if local entropy in the microwave seems manipulated, the divergence meter always trends toward universal attractor fields: you cannot reverse the macrostate of the universe without doing external thermodynamic work.",
      whereItBreaksDown:
        "Where the analogy breaks down: In Portal 2, GLaDOS can mechanically reset chambers to low entropy because the laboratory is an OPEN system receiving external electrical power from Aperture's reactors. True thermodynamic entropy irreversibility applies strictly to CLOSED, ISOLATED systems (like our universe as a whole), where no external reset button exists."
    },
    practicalIntuition:
      "When studying algorithmic complexity, think of entropy like randomized quicksort vs deterministic partitioning: disorder grows spontaneously because the combinatorial state space of mixed states outnumbers ordered states by billions of orders of magnitude.",
    miniQuiz: [
      {
        question: "Why does spontaneous heat flow always travel from hot to cold in an isolated thermodynamic system?",
        options: [
          "Statistical microstate multiplicity makes uniform temperature configurations vastly more probable",
          "Molecules possess an internal memory of their initial temperature",
          "Portal gravity fields cancel thermal velocity",
          "Entropy only applies to biological organisms"
        ],
        correctAnswerIndex: 0,
        explanation: "The second law is purely statistical: uniform energy distributions correspond to the maximum number of microscopic configurations."
      },
      {
        question: "In the Steins;Gate world-line attractor analogy, what does an isolated system correspond to?",
        options: [
          "The complete universe containing both sender and recipient of information",
          "The microwave oven alone",
          "The CRT television downstairs",
          "Only the physical laboratory building"
        ],
        correctAnswerIndex: 0,
        explanation: "Information exchange carries thermodynamic energy; an isolated system must encompass the entire divergence continuum."
      }
    ],
    studySessionMode: {
      partnerName: "Elena Rostova",
      sharedReference: "Portal 2 Spatial Momentum & Elden Ring Graph Traversal",
      collaborativeExercise:
        "Pair Coding Exercise: Model a directed acyclic graph (DAG) representing state branches. Calculate the shortest path using Dijkstra's algorithm while computing entropy loss at each decision node."
    }
  });

  const handleGenerateLive = async (subjectToUse: string, topicToUse: string) => {
    setIsGenerating(true);
    setQuizAnswers({});
    setShowQuizResults(false);

    try {
      const res = await fetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjectToUse,
          topic: topicToUse,
          profile: currentProfile
        })
      });

      if (res.ok) {
        const data = await res.json();
        setExplanation(data);
      }
    } catch (err) {
      console.warn("Live Learn fallback:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (qIdx: number, oIdx: number) => {
    setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="editorial-card rounded-3xl p-8 sm:p-10 border border-[#2e3e38] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest font-mono">
            <GraduationCap className="w-4 h-4 text-emerald-400" /> Module 03 : Learn
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#f2efe9] mt-2 tracking-tight">
            Taste-Anchored Pedagogy & Collaborative Study
          </h2>
          <p className="text-sm text-[#a89f91] mt-2 max-w-2xl leading-relaxed font-light">
            Explains complex university topics using real references from your favorite games, anime, and albums
            supplied by Qloo—with scientific rigor and boundary breakdown conditions.
          </p>
        </div>

        {/* Study Session Mode Switch */}
        <button
          onClick={() => setStudySessionActive(!studySessionActive)}
          className={`px-5 py-3 rounded-2xl border font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 flex items-center gap-2.5 self-stretch sm:self-auto justify-center shadow-lg ${
            studySessionActive
              ? "forest-pill text-white scale-[1.02]"
              : "bg-[#141d19] text-[#a89f91] border-[#2e3e38] hover:border-emerald-500 hover:text-[#dedacb]"
          }`}
        >
          <Users2 className="w-4 h-4 text-emerald-400" />
          {studySessionActive ? "Study Mode Active" : "Pair Study Session Mode"}
        </button>
      </div>

      {/* Signature Qloo ON / OFF Toggle */}
      <QlooComparisonCard module="LEARN" />

      {/* Concept Selector & Custom Topic Input Bar */}
      <div className="editorial-card rounded-2xl p-5 border border-[#2e3e38] shadow-lg flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <span className="text-[#a89f91] font-mono uppercase tracking-wider font-bold">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              handleGenerateLive(e.target.value, selectedTopic);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-[#141d19] border border-[#2e3e38] text-[#dedacb] font-mono text-xs focus:outline-none focus:border-crimson-500 cursor-pointer"
          >
            <option value="Computer Science & Physics">CS & Physics (Thermodynamics & Information Theory)</option>
            <option value="Algorithms & Graph Theory">Algorithms (Dynamic Programming & State Machines)</option>
            <option value="Applied Mathematics">Mathematics (Linear Algebra & Dimensional Projections)</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full lg:flex-1">
          <input
            type="text"
            value={customTopicInput}
            onChange={(e) => setCustomTopicInput(e.target.value)}
            placeholder="Type any hard topic (e.g. Backpropagation, Quantum Tunneling)..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && customTopicInput.trim()) {
                handleGenerateLive(selectedSubject, customTopicInput.trim());
              }
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#141d19] border border-[#2e3e38] text-xs font-mono text-[#dedacb] placeholder-[#a89f91]/40 focus:outline-none focus:border-crimson-500"
          />

          <button
            onClick={() => customTopicInput.trim() && handleGenerateLive(selectedSubject, customTopicInput.trim())}
            disabled={isGenerating || !customTopicInput.trim()}
            className="px-5 py-2.5 rounded-xl crimson-pill hover:brightness-110 disabled:opacity-40 text-white font-mono text-xs uppercase tracking-wider font-bold transition flex items-center gap-2 whitespace-nowrap shadow-md"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
            Explain via Taste
          </button>
        </div>
      </div>

      {/* Explanation Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core & Analogy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="editorial-card rounded-3xl p-6 sm:p-8 border border-[#2e3e38] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25332e]">
              <span className="text-xs font-mono font-bold text-crimson-400 uppercase tracking-widest">
                Rigorous Academic Foundation
              </span>
              <span className="text-xs text-[#a89f91] font-mono font-bold">University Level</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-[#dedacb]">{explanation.topic}</h3>
            <p className="text-sm text-[#c9c3b4] leading-relaxed font-light">{explanation.coreExplanation}</p>
            <div className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] text-xs text-[#c9c3b4]">
              <span className="font-bold text-[#dedacb] font-mono">PRACTICAL INTUITION: </span>
              {explanation.practicalIntuition}
            </div>
          </div>

          {/* Qloo Taste Analogy Anchor */}
          <div className="editorial-card rounded-3xl p-6 sm:p-8 border border-emerald-900/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25332e]">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-emerald-400" /> Taste Analogy Anchor
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                {explanation.analogyAnchor.tasteEntity}
              </span>
            </div>

            <p className="text-sm text-[#dedacb] leading-relaxed font-light">
              {explanation.analogyAnchor.analogyText}
            </p>

            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-1.5">
              <div className="font-bold flex items-center gap-2 text-amber-300 font-mono uppercase tracking-wider text-[11px]">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Scientific Breakdown Boundary:
              </div>
              <p className="leading-relaxed font-light">{explanation.analogyAnchor.whereItBreaksDown}</p>
            </div>
          </div>

          {/* Pair Study Session Mode */}
          {studySessionActive && explanation.studySessionMode && (
            <div className="editorial-card rounded-3xl p-6 border border-emerald-500/40 bg-emerald-950/20 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                <Users2 className="w-4 h-4 text-emerald-400" /> Collaborative Study Session with {explanation.studySessionMode.partnerName}
              </div>
              <h4 className="font-bold text-[#dedacb] text-base font-display">
                Shared Anchor: {explanation.studySessionMode.sharedReference}
              </h4>
              <p className="text-xs text-[#a89f91] leading-relaxed">
                {explanation.studySessionMode.collaborativeExercise}
              </p>
            </div>
          )}
        </div>

        {/* Themed Mini Quiz */}
        <div className="lg:col-span-5 space-y-4">
          <div className="editorial-card rounded-3xl p-6 sm:p-7 border border-[#2e3e38] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25332e]">
              <span className="text-xs font-mono font-bold text-[#dedacb] uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-crimson-500" /> Concept Check Mini-Quiz
              </span>
              <span className="text-[10px] font-mono text-[#a89f91] uppercase">{explanation.miniQuiz.length} Questions</span>
            </div>

            <div className="space-y-4">
              {explanation.miniQuiz.map((q, qIdx) => (
                <div key={qIdx} className="p-4 rounded-2xl bg-[#141d19] border border-[#2e3e38] space-y-3 shadow-md">
                  <div className="text-xs font-bold text-[#dedacb]">
                    <span className="text-crimson-400 mr-1.5 font-mono">Q{qIdx + 1}.</span> {q.question}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = quizAnswers[qIdx] === oIdx;
                      const isCorrect = q.correctAnswerIndex === oIdx;

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectAnswer(qIdx, oIdx)}
                          className={`p-3 rounded-xl text-xs cursor-pointer transition border flex items-center justify-between shadow-sm ${
                            isChosen
                              ? showQuizResults
                                ? isCorrect
                                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold"
                                  : "bg-rose-950/80 border-rose-500 text-rose-200 font-bold"
                                : "bg-crimson-950/80 border-crimson-500 text-white font-bold"
                              : "bg-[#18231e] border-[#2e3e38] text-[#a89f91] hover:border-[#dedacb]/40 hover:text-[#dedacb]"
                          }`}
                        >
                          <span>{opt}</span>
                          {showQuizResults && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                          {showQuizResults && isChosen && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div className="text-[11px] text-[#a89f91] pt-2 border-t border-[#25332e]">
                      <span className="text-emerald-400 font-bold font-mono">Explanation:</span> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowQuizResults(!showQuizResults)}
              className="w-full py-3 rounded-xl crimson-pill hover:brightness-110 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-lg transition"
            >
              {showQuizResults ? "Reset Quiz" : "Check Quiz Answers"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
