"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, ChevronLeft, Dumbbell, Target, Calendar, Play,
  Trash2, Flame, Activity,
} from "lucide-react";
import Modal, { Field, SelectField, BtnPrimary } from "@/components/Modal";
import ExerciseBrowser from "@/components/ExerciseBrowser";
import { useAuth } from "@/lib/auth-context";
import {
  getProgrammes, createProgramme, deleteProgramme,
  getProgrammeExercises, addProgrammeExercise,
  type SportProgramme, type ProgrammeExercise,
} from "@/lib/firestore";
import { EXERCISES, PROGRAMME_TEMPLATES, type Exercise } from "@/lib/exercises";
import { BODY_PARTS, BODY_PART_EMOJI } from "@/lib/constants";

export default function SportPage() {
  const { user } = useAuth();
  const [programmes, setProgrammes] = useState<(SportProgramme & { exercises: ProgrammeExercise[] })[]>([]);
  const [selectedProgramme, setSelectedProgramme] = useState<(SportProgramme & { exercises: ProgrammeExercise[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showExerciseBrowser, setShowExerciseBrowser] = useState(false);
  const [showCreateProgramme, setShowCreateProgramme] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Create form
  const [newProgName, setNewProgName] = useState("");
  const [newProgDesc, setNewProgDesc] = useState("");
  const [newProgLevel, setNewProgLevel] = useState("beginner");
  const [newProgDays, setNewProgDays] = useState("3");
  const [newProgExercises, setNewProgExercises] = useState<
    { exercise: Exercise; day: number; sets: number; reps: number }[]
  >([]);
  const [activeDay, setActiveDay] = useState(1);

  const fetchProgrammes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const progs = await getProgrammes(user.uid);
      const withExercises = await Promise.all(
        progs.map(async (p) => {
          const exercises = await getProgrammeExercises(p.id);
          return { ...p, exercises };
        })
      );
      setProgrammes(withExercises);
    } catch (e) {
      console.error("Error fetching programmes:", e);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProgrammes(); }, [fetchProgrammes]);

  const handleCreateProgramme = async () => {
    if (!user || !newProgName) return;
    const prog = await createProgramme({
      userId: user.uid,
      name: newProgName,
      description: newProgDesc,
      daysPerWeek: parseInt(newProgDays),
      level: newProgLevel,
      active: true,
      createdAt: new Date().toISOString(),
    });

    for (let i = 0; i < newProgExercises.length; i++) {
      const pe = newProgExercises[i];
      await addProgrammeExercise({
        programmeId: prog.id,
        exerciseId: pe.exercise.id,
        exerciseName: pe.exercise.name,
        bodyPart: pe.exercise.bodyPart,
        target: pe.exercise.target,
        equipment: pe.exercise.equipment,
        gifUrl: pe.exercise.gifUrl,
        sets: pe.sets,
        reps: pe.reps,
        day: pe.day,
        orderIndex: i,
      });
    }

    setShowCreateProgramme(false);
    setNewProgName(""); setNewProgDesc(""); setNewProgExercises([]);
    fetchProgrammes();
  };

  const handleCreateFromTemplate = async (templateIndex: number) => {
    if (!user) return;
    const t = PROGRAMME_TEMPLATES[templateIndex];

    const prog = await createProgramme({
      userId: user.uid,
      name: t.name,
      description: t.description,
      daysPerWeek: t.daysPerWeek,
      level: t.level,
      active: true,
      createdAt: new Date().toISOString(),
    });

    let orderIdx = 0;
    for (const d of t.days) {
      for (const eid of d.exerciseIds) {
        const ex = EXERCISES.find(e => e.id === eid);
        if (!ex) continue;
        await addProgrammeExercise({
          programmeId: prog.id,
          exerciseId: ex.id,
          exerciseName: ex.name,
          bodyPart: ex.bodyPart,
          target: ex.target,
          equipment: ex.equipment,
          gifUrl: ex.gifUrl,
          sets: 3,
          reps: 10,
          day: d.day,
          orderIndex: orderIdx++,
        });
      }
    }

    setShowTemplates(false);
    fetchProgrammes();
  };

  const handleDeleteProgramme = async (id: string) => {
    await deleteProgramme(id);
    if (selectedProgramme?.id === id) setSelectedProgramme(null);
    fetchProgrammes();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-3 animate-spin"
          style={{ borderColor: "var(--sport)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  // Programme detail view
  if (selectedProgramme) {
    const exercisesByDay: Record<number, ProgrammeExercise[]> = {};
    selectedProgramme.exercises.forEach(e => {
      if (!exercisesByDay[e.day]) exercisesByDay[e.day] = [];
      exercisesByDay[e.day].push(e);
    });

    return (
      <div className="space-y-5">
        <button onClick={() => setSelectedProgramme(null)}
          className="flex items-center gap-1 text-sm font-medium tap"
          style={{ color: "var(--sport)" }}>
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="glass p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--t1)" }}>
                {selectedProgramme.name}
              </h2>
              {selectedProgramme.description && (
                <p className="text-sm mt-1" style={{ color: "var(--t3)" }}>{selectedProgramme.description}</p>
              )}
            </div>
            <span className="px-2.5 py-1 text-[10px] font-semibold capitalize"
              style={{
                background: selectedProgramme.level === "beginner" ? "var(--good-tint)" :
                  selectedProgramme.level === "intermediate" ? "var(--warn-tint)" : "var(--bad-tint)",
                color: selectedProgramme.level === "beginner" ? "var(--good)" :
                  selectedProgramme.level === "intermediate" ? "var(--warn)" : "var(--bad)",
                borderRadius: "var(--r-pill)",
              }}>
              {selectedProgramme.level}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: "var(--t2)" }}>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{selectedProgramme.daysPerWeek} days/week</span>
            <span className="flex items-center gap-1"><Dumbbell className="w-3.5 h-3.5" />{selectedProgramme.exercises.length} exercises</span>
          </div>
        </div>

        {Object.entries(exercisesByDay).sort(([a], [b]) => Number(a) - Number(b)).map(([day, exs]) => (
          <div key={day} className="glass overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2"
              style={{ background: "var(--sport-tint)", borderBottom: "1px solid var(--border)" }}>
              <Play className="w-4 h-4" style={{ color: "var(--sport)" }} />
              <span className="font-semibold text-sm" style={{ color: "var(--sport)" }}>Day {day}</span>
              <span className="ml-auto text-xs" style={{ color: "var(--t3)" }}>{exs.length} exercises</span>
            </div>
            <div className="p-3 space-y-2">
              {exs.map(ex => (
                <div key={ex.id} className="flex items-center gap-3 p-2.5"
                  style={{ background: "var(--surface-2)", borderRadius: "var(--r-field)" }}>
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                    style={{ background: "var(--sport-tint)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ex.gifUrl || ""} alt={ex.exerciseName}
                      className="w-14 h-14 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--t1)" }}>
                      {ex.exerciseName}
                    </p>
                    <p className="text-[11px] capitalize" style={{ color: "var(--t3)" }}>
                      {ex.bodyPart} · {ex.target}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5"
                        style={{ background: "var(--sport-tint)", color: "var(--sport)", borderRadius: "var(--r-pill)" }}>
                        {ex.sets} sets
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5"
                        style={{ background: "var(--accent-tint)", color: "var(--accent-dim)", borderRadius: "var(--r-pill)" }}>
                        {ex.reps} reps
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Main list view
  return (
    <div className="space-y-5">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setShowCreateProgramme(true)} className="glass p-4 text-center tap space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center"
            style={{ background: "var(--sport-tint)" }}>
            <Plus className="w-6 h-6" style={{ color: "var(--sport)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--t1)" }}>Custom Programme</p>
          <p className="text-[10px]" style={{ color: "var(--t3)" }}>Build from scratch</p>
        </button>
        <button onClick={() => setShowTemplates(true)} className="glass p-4 text-center tap space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center"
            style={{ background: "var(--accent-tint)" }}>
            <Target className="w-6 h-6" style={{ color: "var(--accent)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--t1)" }}>Templates</p>
          <p className="text-[10px]" style={{ color: "var(--t3)" }}>Quick start plans</p>
        </button>
      </div>

      {/* Exercise Spotlight */}
      <div className="glass p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4" style={{ color: "var(--sport)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--t1)" }}>Exercise Spotlight</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {EXERCISES.slice(0, 6).map(ex => (
            <div key={ex.id} className="shrink-0 w-28">
              <div className="w-28 h-28 rounded-xl overflow-hidden mb-2"
                style={{ background: "var(--sport-tint)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ex.gifUrl} alt={ex.name} className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
              <p className="text-xs font-medium truncate" style={{ color: "var(--t1)" }}>{ex.name}</p>
              <p className="text-[10px] capitalize" style={{ color: "var(--t3)" }}>{ex.bodyPart}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Body Parts Grid */}
      <div className="glass p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4" style={{ color: "var(--sport)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--t1)" }}>Browse by Body Part</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {BODY_PARTS.map(bp => {
            const count = EXERCISES.filter(e => e.bodyPart === bp).length;
            return (
              <div key={bp} className="text-center p-2 tap"
                style={{ background: "var(--surface-2)", borderRadius: "var(--r-field)" }}>
                <span className="text-lg">{BODY_PART_EMOJI[bp]}</span>
                <p className="text-[9px] font-medium capitalize mt-1 truncate" style={{ color: "var(--t1)" }}>{bp}</p>
                <p className="text-[8px]" style={{ color: "var(--t3)" }}>{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Programmes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm" style={{ color: "var(--t1)" }}>My Programmes</h3>
          <span className="text-xs" style={{ color: "var(--t3)" }}>{programmes.length} programmes</span>
        </div>

        {programmes.length === 0 ? (
          <div className="glass p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "var(--sport-tint)" }}>
              <Dumbbell className="w-8 h-8" style={{ color: "var(--sport)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--t1)" }}>No programmes yet</p>
            <p className="text-xs mt-1" style={{ color: "var(--t3)" }}>Create a programme or use a template</p>
          </div>
        ) : (
          <div className="space-y-3">
            {programmes.map(prog => (
              <div key={prog.id} className="glass p-4 tap" onClick={() => setSelectedProgramme(prog)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: "var(--sport-tint)" }}>
                      <Dumbbell className="w-6 h-6" style={{ color: "var(--sport)" }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm" style={{ color: "var(--t1)" }}>{prog.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 font-medium capitalize"
                          style={{
                            background: prog.level === "beginner" ? "var(--good-tint)" :
                              prog.level === "intermediate" ? "var(--warn-tint)" : "var(--bad-tint)",
                            color: prog.level === "beginner" ? "var(--good)" :
                              prog.level === "intermediate" ? "var(--warn)" : "var(--bad)",
                            borderRadius: "var(--r-pill)",
                          }}>
                          {prog.level}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--t3)" }}>
                          {prog.daysPerWeek}d/w · {prog.exercises.length} exercises
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteProgramme(prog.id); }}
                    className="tap p-1.5" style={{ color: "var(--bad)" }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {prog.exercises.slice(0, 4).map(ex => (
                    <div key={ex.id} className="w-10 h-10 rounded-lg overflow-hidden shrink-0"
                      style={{ background: "var(--sport-tint)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ex.gifUrl || ""} alt={ex.exerciseName}
                        className="w-10 h-10 object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  ))}
                  {prog.exercises.length > 4 && (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-medium"
                      style={{ background: "var(--surface-2)", color: "var(--t3)" }}>
                      +{prog.exercises.length - 4}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateProgramme && (
        <Modal title="Create Programme" onClose={() => setShowCreateProgramme(false)} wide>
          <Field label="Programme Name" value={newProgName} onChange={setNewProgName} placeholder="My Workout" />
          <Field label="Description" value={newProgDesc} onChange={setNewProgDesc} placeholder="Optional description" />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Level" value={newProgLevel} onChange={setNewProgLevel}
              options={[
                { value: "beginner", label: "Beginner" },
                { value: "intermediate", label: "Intermediate" },
                { value: "advanced", label: "Advanced" },
              ]} />
            <SelectField label="Days/Week" value={newProgDays} onChange={setNewProgDays}
              options={[1,2,3,4,5,6,7].map(d => ({ value: String(d), label: `${d} days` }))} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: parseInt(newProgDays) }, (_, i) => i + 1).map(d => (
              <button key={d} onClick={() => setActiveDay(d)}
                className="px-3 py-1.5 text-xs font-medium shrink-0 tap"
                style={{
                  background: activeDay === d ? "var(--sport)" : "var(--surface-2)",
                  color: activeDay === d ? "#fff" : "var(--t2)",
                  borderRadius: "var(--r-pill)",
                }}>
                Day {d}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {newProgExercises.filter(pe => pe.day === activeDay).map((pe, i) => (
              <div key={i} className="flex items-center gap-3 p-3"
                style={{ background: "var(--surface-2)", borderRadius: "var(--r-field)", border: "1px solid var(--border)" }}>
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0"
                  style={{ background: "var(--sport-tint)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pe.exercise.gifUrl} alt={pe.exercise.name} className="w-10 h-10 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--t1)" }}>{pe.exercise.name}</p>
                  <p className="text-[10px]" style={{ color: "var(--t3)" }}>{pe.sets}×{pe.reps}</p>
                </div>
                <button onClick={() => {
                  const dayExercises = newProgExercises.filter(p => p.day === activeDay);
                  const globalIdx = newProgExercises.indexOf(dayExercises[i]);
                  setNewProgExercises(prev => prev.filter((_, idx) => idx !== globalIdx));
                }} className="tap" style={{ color: "var(--bad)" }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button onClick={() => setShowExerciseBrowser(true)}
              className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium tap"
              style={{
                border: "2px dashed var(--sport)", color: "var(--sport)",
                borderRadius: "var(--r-field)", background: "var(--sport-tint)",
              }}>
              <Plus className="w-4 h-4" /> Add Exercise
            </button>
          </div>

          <BtnPrimary onClick={handleCreateProgramme} disabled={!newProgName || newProgExercises.length === 0}
            variant="sport">
            <Dumbbell className="w-4 h-4" /> Create Programme
          </BtnPrimary>
        </Modal>
      )}

      {showExerciseBrowser && (
        <ExerciseBrowser
          onSelect={(ex) => {
            setNewProgExercises(prev => [...prev, { exercise: ex, day: activeDay, sets: 3, reps: 10 }]);
            setShowExerciseBrowser(false);
          }}
          onClose={() => setShowExerciseBrowser(false)}
        />
      )}

      {showTemplates && (
        <Modal title="Programme Templates" onClose={() => setShowTemplates(false)} wide>
          <div className="space-y-3">
            {PROGRAMME_TEMPLATES.map((t, i) => (
              <div key={i} className="p-4 tap"
                style={{ background: "var(--surface-2)", borderRadius: "var(--r-field)", border: "1px solid var(--border)" }}
                onClick={() => handleCreateFromTemplate(i)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm" style={{ color: "var(--t1)" }}>{t.name}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-medium capitalize"
                    style={{
                      background: t.level === "beginner" ? "var(--good-tint)" : t.level === "intermediate" ? "var(--warn-tint)" : "var(--bad-tint)",
                      color: t.level === "beginner" ? "var(--good)" : t.level === "intermediate" ? "var(--warn)" : "var(--bad)",
                      borderRadius: "var(--r-pill)",
                    }}>
                    {t.level}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--t3)" }}>{t.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "var(--t2)" }}>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t.daysPerWeek} days/week</span>
                  <span className="flex items-center gap-1">
                    <Dumbbell className="w-3 h-3" />{t.days.reduce((s, d) => s + d.exerciseIds.length, 0)} exercises
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
