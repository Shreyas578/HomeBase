"use client";

import React, { useState } from "react";
import { StudentProfile, LearnExplanation } from "@/types";
import { QlooComparisonCard } from "./QlooComparisonCard";
import {
  GraduationCap,
  Sparkles,
  Gamepad2,
  Tv,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Users2,
  Lightbulb,
  ArrowRight
} from "lucide-react";

interface LearnModuleProps {
  currentProfile: StudentProfile;
}

export const LearnModule: React.FC<LearnModuleProps> = ({ currentProfile }) => {
  const [selectedSubject, setSelectedSubject] = useState("Computer Science & Physics");
  const [selectedTopic, setSelectedTopic] = useState("Entropy & Thermodynamic Irreversibility");
  const [studySessionPartner, setStudySessionPartner] = useState("Elena Rostova");
  const [studySessionActive, setStudySessionActive] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const sampleExplanation: LearnExplanation = {
    subject: selectedSubject,
    topic: selectedTopic,
    coreExplanation:
      "Entropy (S = k_B * ln(Omega)) quantifies the total number of microscopic arrangements (microstates, Omega) that manifest as the same macroscopic state. The Second Law of Thermodynamics states that the entropy of an isolated system never decreases over time—not due to mechanical enforcement, but because high-entropy states possess overwhelmingly higher statistical probability.",
    analogyAnchor: {
      tasteEntity: "Portal 2 (Valve) & Steins;Gate Divergence",
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
      },
      {
        question: "Why is an infinite Portal velocity loop physically impossible in real thermodynamics?",
        options: [
          "It creates kinetic energy out of nowhere without fuel, violating the 1st Law of Conservation of Energy",
          "Air resistance does not exist in Aperture",
          "Portals can only be placed on concrete surfaces",
          "Valve developers made an error"
        ],
        correctAnswerIndex: 0,
        explanation: "Static gravitational acceleration through cyclic spatial shortcuts without energy loss would be a perpetual motion machine of the first kind."
      }
    ],
    studySessionMode: {
      partnerName: studySessionPartner,
      sharedReference: "Portal 2 Spatial Momentum & Elden Ring Graph Traversal",
      collaborativeExercise:
        "Pair Coding Exercise: Model a directed acyclic graph (DAG) representing Steins;Gate world-line branches. Calculate the shortest path using Dijkstra's algorithm while computing entropy loss at each decision node."
    }
  };

  const handleSelectAnswer = (qIdx: number, oIdx: number) => {
    setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" /> Module 3: Learn
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Taste-Anchored Pedagogy & Collaborative Study Sessions
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Explains hard university topics using real references from your favorite games, anime, and stories
            supplied by Qloo—with scientific rigor and boundary breakdown conditions.
          </p>
        </div>

        {/* Study Session Mode Switch */}
        <button
          onClick={() => setStudySessionActive(!studySessionActive)}
          className={`px-4 py-2.5 rounded-xl border font-semibold text-xs transition flex items-center gap-2 self-stretch sm:self-auto justify-center ${
            studySessionActive
              ? "bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/25"
              : "bg-slate-900 text-slate-300 border-slate-700 hover:border-purple-500"
          }`}
        >
          <Users2 className="w-4 h-4" />
          {studySessionActive ? "Study Session Active" : "Pair Study Session Mode"}
        </button>
      </div>

      {/* Signature Qloo ON / OFF Toggle */}
      <QlooComparisonCard module="LEARN" />

      {/* Concept Selector */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-400 font-semibold uppercase">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="Computer Science & Physics">CS & Physics (Thermodynamics & Information Theory)</option>
            <option value="Algorithms & Graph Theory">Algorithms (Dynamic Programming & State Machines)</option>
            <option value="Applied Mathematics">Mathematics (Linear Algebra & Dimensional Projections)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-400 font-semibold uppercase">Topic:</span>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="Entropy & Thermodynamic Irreversibility">Entropy & Irreversibility</option>
            <option value="Bellman-Ford & Negative Cycles">Graph Theory: Negative Weight Cycles</option>
            <option value="Eigenvectors & Dimensionality">PCA: Eigenvalues in High Dimensions</option>
          </select>
        </div>
      </div>

      {/* Explanation Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core & Analogy */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Rigorous Explanation */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
                Rigorous Academic Foundation
              </span>
              <span className="text-xs text-slate-400 font-mono">Level: University Year 1-2</span>
            </div>
            <h3 className="text-xl font-bold text-white">{sampleExplanation.topic}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{sampleExplanation.coreExplanation}</p>
            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
              <span className="font-semibold text-white">Practical Intuition: </span>
              {sampleExplanation.practicalIntuition}
            </div>
          </div>

          {/* Qloo Taste Analogy Anchor */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-purple-400" /> Taste Analogy Anchor
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                {sampleExplanation.analogyAnchor.tasteEntity}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {sampleExplanation.analogyAnchor.analogyText}
            </p>

            {/* Scientific Breakdown Condition */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Where this analogy breaks down:
              </div>
              <p className="leading-relaxed">{sampleExplanation.analogyAnchor.whereItBreaksDown}</p>
            </div>
          </div>

          {/* Pair Study Session Mode (Optional) */}
          {studySessionActive && sampleExplanation.studySessionMode && (
            <div className="glass-panel rounded-3xl p-6 border border-purple-500/40 bg-purple-950/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
                <Users2 className="w-4 h-4" /> Collaborative Study Session with {sampleExplanation.studySessionMode.partnerName}
              </div>
              <h4 className="font-bold text-white text-base">
                Shared Interest Anchor: {sampleExplanation.studySessionMode.sharedReference}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {sampleExplanation.studySessionMode.collaborativeExercise}
              </p>
            </div>
          )}
        </div>

        {/* Themed Mini Quiz */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-400" /> Themed Mini-Quiz (3 Qs)
              </span>
              <span className="text-xs text-slate-400">Retention Test</span>
            </div>

            <div className="space-y-4">
              {sampleExplanation.miniQuiz.map((q, qIdx) => (
                <div key={qIdx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-white">
                    <span className="text-indigo-400 mr-1.5">Q{qIdx + 1}.</span> {q.question}
                  </div>

                  <div className="space-y-1.5">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = quizAnswers[qIdx] === oIdx;
                      const isCorrect = q.correctAnswerIndex === oIdx;

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectAnswer(qIdx, oIdx)}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition border flex items-center justify-between ${
                            isChosen
                              ? showQuizResults
                                ? isCorrect
                                  ? "bg-emerald-950/60 border-emerald-500 text-white"
                                  : "bg-rose-950/60 border-rose-500 text-white"
                                : "bg-indigo-950/60 border-indigo-500 text-white"
                              : "bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <span>{opt}</span>
                          {showQuizResults && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />}
                          {showQuizResults && isChosen && !isCorrect && (
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <span className="text-emerald-400 font-semibold">Explanation:</span> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowQuizResults(!showQuizResults)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition"
            >
              {showQuizResults ? "Reset Quiz" : "Check Quiz Answers"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
