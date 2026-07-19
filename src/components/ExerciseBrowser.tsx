"use client";

import { useState } from "react";
import { EXERCISES, type Exercise } from "@/lib/exercises";
import { BODY_PARTS, BODY_PART_EMOJI } from "@/lib/constants";
import Modal from "./Modal";
import { Search, Dumbbell, X } from "lucide-react";

interface ExerciseBrowserProps {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}

export default function ExerciseBrowser({ onSelect, onClose }: ExerciseBrowserProps) {
  const [search, setSearch] = useState("");
  const [bodyPart, setBodyPart] = useState<string>("");
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  const filtered = EXERCISES.filter(e => {
    if (bodyPart && e.bodyPart !== bodyPart) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.name.toLowerCase().includes(q) ||
        e.target.toLowerCase().includes(q) ||
        e.equipment.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <>
      <Modal title="Exercise Library" onClose={onClose} wide>
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--t3)" }} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="field pl-10"
          />
        </div>

        {/* Body part filter pills */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setBodyPart("")}
            className="px-3 py-1.5 text-xs font-medium transition tap"
            style={{
              background: !bodyPart ? "var(--sport)" : "var(--surface-2)",
              color: !bodyPart ? "#fff" : "var(--t2)",
              borderRadius: "var(--r-pill)",
              border: "1px solid " + (!bodyPart ? "var(--sport)" : "var(--border-2)"),
            }}>
            All
          </button>
          {BODY_PARTS.map(bp => (
            <button key={bp} onClick={() => setBodyPart(bp === bodyPart ? "" : bp)}
              className="px-3 py-1.5 text-xs font-medium transition tap capitalize"
              style={{
                background: bodyPart === bp ? "var(--sport)" : "var(--surface-2)",
                color: bodyPart === bp ? "#fff" : "var(--t2)",
                borderRadius: "var(--r-pill)",
                border: "1px solid " + (bodyPart === bp ? "var(--sport)" : "var(--border-2)"),
              }}>
              {BODY_PART_EMOJI[bp] || "💪"} {bp}
            </button>
          ))}
        </div>

        {/* Exercise list */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-sm" style={{ color: "var(--t3)" }}>
              No exercises found
            </div>
          ) : (
            filtered.map(ex => (
              <div key={ex.id}
                className="flex items-center gap-3 p-3 transition hover:scale-[1.01] cursor-pointer tap"
                style={{
                  background: "var(--surface-2)", borderRadius: "var(--r-field)",
                  border: "1px solid var(--border)",
                }}
                onClick={() => setPreviewExercise(ex)}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                  style={{ background: "var(--sport-tint)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ex.gifUrl} alt={ex.name} className="w-14 h-14 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--t1)" }}>{ex.name}</p>
                  <p className="text-xs capitalize" style={{ color: "var(--t3)" }}>
                    {ex.bodyPart} · {ex.target} · {ex.equipment}
                  </p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onSelect(ex); }}
                  className="px-3 py-1.5 text-xs font-medium shrink-0 tap"
                  style={{
                    background: "var(--sport)", color: "#fff",
                    borderRadius: "var(--r-pill)",
                  }}>
                  + Add
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Exercise Detail Preview */}
      {previewExercise && (
        <ExerciseDetailModal
          exercise={previewExercise}
          onClose={() => setPreviewExercise(null)}
          onAdd={() => { onSelect(previewExercise); setPreviewExercise(null); }}
        />
      )}
    </>
  );
}

function ExerciseDetailModal({ exercise, onClose, onAdd }: {
  exercise: Exercise; onClose: () => void; onAdd: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        className="w-full max-w-md animate-slideUp overflow-hidden"
        style={{
          background: "var(--surface)", borderRadius: "var(--r-card)",
          boxShadow: "var(--shadow-card)", border: "1px solid var(--border)",
        }}>
        {/* GIF Header */}
        <div className="relative" style={{ background: "var(--sport-tint)" }}>
          <div className="flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={exercise.gifUrl} alt={exercise.name}
              className="w-full max-w-[280px] h-auto rounded-xl"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
              }}
            />
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.9)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-lg font-bold" style={{ color: "var(--t1)" }}>{exercise.name}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2.5 py-1 text-xs font-medium capitalize"
                style={{ background: "var(--sport-tint)", color: "var(--sport)", borderRadius: "var(--r-pill)" }}>
                {exercise.bodyPart}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium capitalize"
                style={{ background: "var(--accent-tint)", color: "var(--accent-dim)", borderRadius: "var(--r-pill)" }}>
                {exercise.target}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium capitalize"
                style={{ background: "var(--surface-2)", color: "var(--t2)", borderRadius: "var(--r-pill)" }}>
                {exercise.equipment}
              </span>
            </div>
          </div>

          {exercise.secondaryMuscles.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--t3)" }}>Secondary Muscles</p>
              <p className="text-sm capitalize" style={{ color: "var(--t2)" }}>
                {exercise.secondaryMuscles.join(", ")}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--t3)" }}>Instructions</p>
            <ol className="space-y-1.5">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--t2)" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: "var(--sport-tint)", color: "var(--sport)" }}>
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <button onClick={onAdd}
            className="w-full py-3 font-semibold text-sm tap flex items-center justify-center gap-2"
            style={{
              background: "var(--sport)", color: "#fff",
              borderRadius: "var(--r-field)",
              boxShadow: "0 4px 14px rgba(108,99,255,0.4)",
            }}>
            <Dumbbell className="w-4 h-4" /> Add to Programme
          </button>
        </div>
      </div>
    </div>
  );
}
