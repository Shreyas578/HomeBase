import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion } from "@/lib/llm";
import { LearnExplanation, StudentProfile } from "@/types";
import { sanitizeString } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const subject = sanitizeString(body.subject || "Computer Science", 100);
    const topic = sanitizeString(body.topic || "Thermodynamics & Algorithmic Complexity", 120);
    const profile: StudentProfile = body.profile;

    const tasteAnchors = profile?.taste_entities?.map((e) => `${e.name} (${e.domain})`).join(", ") || "Portal 2, Radiohead, Studio Ghibli";

    const prompt = `You are the educational core of HomeBase, an AI agent helping university students master rigorous academic concepts through their real personal taste graph.

Academic Subject: "${subject}"
Specific Topic: "${topic}"
Student's Qloo Taste Anchors: "${tasteAnchors}"

Generate a rigorous pedagogical explanation in strict JSON format matching this schema:
{
  "subject": "${subject}",
  "topic": "${topic}",
  "coreExplanation": "Rigorous, mathematically sound university-level explanation of the topic without dumbing down.",
  "analogyAnchor": {
    "tasteEntity": "Name of one entity from the student's taste anchors",
    "domain": "Domain of that entity (e.g. video_game, artist, movie)",
    "analogyText": "A deep, intuitive analogy showing how the mechanics of this game, song, or film mirror the mathematical or scientific mechanism of the topic.",
    "whereItBreaksDown": "CRITICAL: Scientific breakdown explaining exactly where this analogy ceases to be mathematically/physically accurate and why the real topic differs."
  },
  "practicalIntuition": "One actionable mnemonic or mental model for exam / coding scenarios.",
  "miniQuiz": [
    {
      "question": "A conceptual multiple-choice question testing the core mechanism",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Why this answer is scientifically correct"
    },
    {
      "question": "A question testing the analogy breakdown boundary",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Why the analogy does not hold here"
    }
  ],
  "studySessionMode": {
    "partnerName": "Kindred Peer",
    "sharedReference": "Shared cultural touchpoint",
    "collaborativeExercise": "A 10-minute collaborative problem-solving exercise the two students can run together."
  }
}

Output ONLY valid JSON. No markdown ticks, no preamble.`;

    const llmResponse = await generateChatCompletion([
      { role: "system", content: "You output strictly valid JSON matching the user schema." },
      { role: "user", content: prompt }
    ], { temperature: 0.2 });

    let parsed: LearnExplanation;
    try {
      const cleanJson = llmResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      // Deterministic fallback
      parsed = {
        subject,
        topic,
        coreExplanation: `Entropy and state distribution in ${subject} govern how information or energy disperses across unconstrained microstates. As systems evolve, the probability of returning to low-entropy configurations approaches zero without external work.`,
        analogyAnchor: {
          tasteEntity: profile?.taste_entities?.[0]?.name || "Portal 2",
          domain: "video_game",
          analogyText: `In ${profile?.taste_entities?.[0]?.name || "Portal 2"}, once kinetic energy scatters momentum through portal loops, disorder increases exponentially across the chamber.`,
          whereItBreaksDown: `Where this analogy breaks down: Game chambers are open systems with external energy loops, whereas isolated thermodynamic systems cannot reset state without external work.`
        },
        practicalIntuition: `Measure the state space: randomized arrangements outnumber ordered states by orders of magnitude.`,
        miniQuiz: [
          {
            question: "Why does spontaneous entropy increase in an isolated system?",
            options: [
              "High-entropy microstate configurations are overwhelmingly more probable",
              "Molecules actively prefer disordered shapes",
              "External gravitational friction slows time",
              "Only biological matter produces disorder"
            ],
            correctAnswerIndex: 0,
            explanation: "The statistical multiplicity of uniform energy distribution is exponentially greater."
          }
        ],
        studySessionMode: {
          partnerName: "Elena Rostova",
          sharedReference: profile?.taste_entities?.[0]?.name || "Portal 2",
          collaborativeExercise: "Trace the state space tree for 10 microstates and identify the maximum entropy boundary together."
        }
      };
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Learn API error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate learning analogy" }, { status: 500 });
  }
}
