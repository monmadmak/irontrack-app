"use client";

import React, { useState, useEffect } from "react";
import { Dumbbell, Plus, CheckCircle, Home } from "lucide-react";
import { SetRecord, SetType, WorkoutSession, WorkoutTemplate } from "../types";
import { useIronTrackData } from "../hooks/useIronTrackData";

import RestTimerBadge from "../components/RestTimerBadge";
import ActiveLogger from "../components/ActiveLogger";
import ExerciseSelectorModal from "../components/ExerciseSelectorModal";
import WorkoutSummary from "../components/WorkoutSummary";
import HomeDashboard from "../components/HomeDashboard";
import CreateExerciseModal from "../components/CreateExerciseModal";
import RoutineModal from "../components/RoutineModal";
import FinishSessionModal from "../components/FinishSessionModal";

const getLocalISOString = () => {
  const localDate = new Date();
  const offset = localDate.getTimezoneOffset() * 60000;
  return new Date(localDate.getTime() - offset).toISOString().slice(0, -1);
};

export default function IronTrackApp() {
  const {
    isLoaded,
    exercises, setExercises,
    templates, setTemplates,
    allSets, setAllSets,
    sessions, setSessions,
    sessionId, setSessionId,
    activeExerciseIds, setActiveExerciseIds,
    isWorkoutActive, setIsWorkoutActive,
    lastLoggedExerciseId, setLastLoggedExerciseId
  } = useIronTrackData();

  // App View State
  const [view, setView] = useState<"home" | "workout" | "summary">("home");
  
  useEffect(() => {
    if (isLoaded && isWorkoutActive) {
      setView("workout");
    }
  }, [isLoaded, isWorkoutActive]);

  // UI State
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isCreateExModalOpen, setIsCreateExModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const [routineModalState, setRoutineModalState] = useState<{
    isOpen: boolean;
    mode: "view" | "edit" | "create";
    routineId?: string;
  }>({ isOpen: false, mode: "create" });
  
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((prev) => prev - 1);
      }, 1000);
    } else if (restTime <= 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, restTime]);

  const handleStartEmptySession = () => {
    setSessionId(Math.random().toString(36).substring(7));
    setActiveExerciseIds([]);
    setIsWorkoutActive(true);
    setView("workout");
    setIsResting(false);
    setRestTime(0);
  };

  const handleStartTemplateSession = (template: WorkoutTemplate) => {
    setSessionId(Math.random().toString(36).substring(7));
    setActiveExerciseIds(template.exerciseIds);
    setIsWorkoutActive(true);
    setView("workout");
    setIsResting(false);
    setRestTime(0);
  };

  const calculate1RM = (w: number, r: number) => w * (1 + r / 30);

  const handleSaveSet = (exerciseId: string, weight: number, reps: number, type: SetType) => {
    let isPR = false;
    if (type === "working") {
      const new1RM = calculate1RM(weight, reps);
      const prevMax1RM = allSets
        .filter(s => s.exerciseId === exerciseId && s.type === "working")
        .reduce((max, s) => Math.max(max, calculate1RM(s.weight, s.reps)), 0);
      if (new1RM > prevMax1RM) isPR = true;
    }

    const newSet: SetRecord = {
      id: Math.random().toString(36).substring(7),
      sessionId,
      exerciseId,
      weight, reps, type, isPR,
      time: getLocalISOString(),
    };

    setAllSets([newSet, ...allSets]);
    setLastLoggedExerciseId(exerciseId);
    
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise) {
      setIsResting(true);
      setRestTime(exercise.defaultRestTime);
    }
  };

  const handleUpdateSet = (setId: string, exerciseId: string, newWeight: number, newReps: number, newType: SetType) => {
    setAllSets(prevSets => {
      return prevSets.map(s => {
        if (s.id === setId) {
          let isPR = false;
          if (newType === "working") {
            const new1RM = calculate1RM(newWeight, newReps);
            const prevMax1RM = prevSets
              .filter(ps => ps.id !== setId && ps.exerciseId === exerciseId && ps.type === "working")
              .reduce((max, ps) => Math.max(max, calculate1RM(ps.weight, ps.reps)), 0);
            if (new1RM > prevMax1RM) isPR = true;
          }
          return { ...s, weight: newWeight, reps: newReps, type: newType, isPR };
        }
        return s;
      });
    });
  };

  const handleFinishSession = (bodyweight?: number, notes?: string, templateName?: string) => {
    if (templateName && activeExerciseIds.length > 0) {
      setTemplates([...templates, { id: "tpl_"+Date.now(), name: templateName, exerciseIds: activeExerciseIds }]);
    }

    const newSession: WorkoutSession = {
      id: sessionId,
      date: getLocalISOString(),
      bodyweight,
      notes,
    };
    setSessions([newSession, ...sessions]);
    setIsFinishModalOpen(false);
    setRestTime(0);
    setIsResting(false);
    setIsWorkoutActive(false);
    setView("summary");
  };

  const handleSaveTemplate = (template: WorkoutTemplate) => {
    let newTemplates;
    if (templates.find(t => t.id === template.id)) {
      newTemplates = templates.map(t => t.id === template.id ? template : t);
    } else {
      newTemplates = [...templates, template];
    }
    setTemplates(newTemplates);
    setRoutineModalState({ isOpen: false, mode: "create" });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
    setRoutineModalState({ isOpen: false, mode: "create" });
  };

  if (!isLoaded) return null;

  const sessionSets = allSets.filter(s => s.sessionId === sessionId);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#deff9a] selection:text-black pb-32">
      <nav className="border-b border-neutral-800 bg-[#1a1a1a]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => view === "summary" && setView("home")}>
            <div className="bg-[#deff9a] p-1.5 rounded-lg text-black">
              <Dumbbell size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">IronTrack</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-4 mt-4 space-y-8">
        {view === "home" && (
          <HomeDashboard 
            sets={allSets}
            exercises={exercises}
            templates={templates}
            onStartEmptySession={handleStartEmptySession}
            onOpenCreateExercise={() => setIsCreateExModalOpen(true)}
            onOpenCreateTemplate={() => setRoutineModalState({ isOpen: true, mode: "create" })}
            onViewTemplate={(tpl) => setRoutineModalState({ isOpen: true, mode: "view", routineId: tpl.id })}
          />
        )}

        {view === "workout" && (
          <>
            <div className="space-y-8">
              {activeExerciseIds.length === 0 && (
                <div className="text-center py-16 text-neutral-500 border-2 border-dashed border-neutral-800 rounded-3xl bg-[#1a1a1a]/50">
                  <div className="bg-neutral-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-800 shadow-inner">
                    <Dumbbell size={32} className="text-[#deff9a]" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Step 1: Choose an Exercise</h3>
                  <p className="text-sm max-w-[250px] mx-auto">Click the <strong className="text-[#deff9a]">ADD EXERCISE</strong> button below to start building your workout.</p>
                </div>
              )}

              {activeExerciseIds.map(exId => {
                const ex = exercises.find(e => e.id === exId);
                if (!ex) return null;
                return (
                  <ActiveLogger 
                    key={exId}
                    exercise={ex}
                    sets={sessionSets.filter(s => s.exerciseId === exId)}
                    onSave={(w, r, t) => handleSaveSet(exId, w, r, t)}
                    onUpdateSet={(setId, w, r, t) => handleUpdateSet(setId, exId, w, r, t)}
                    onDelete={(id) => setAllSets(allSets.filter(s => s.id !== id))}
                    onRemoveExercise={() => setActiveExerciseIds(activeExerciseIds.filter(id => id !== exId))}
                    
                    showTimer={isResting && lastLoggedExerciseId === exId}
                    restTime={restTime}
                    onAddTime={(a) => setRestTime(p => Math.max(0, p + a))}
                    onSkipTimer={() => { setRestTime(0); setIsResting(false); }}
                  />
                );
              })}
            </div>

            <button 
              onClick={() => setIsExerciseModalOpen(true)}
              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 border-dashed font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-neutral-800 hover:text-white transition-all"
            >
              <Plus size={24} /> ADD EXERCISE
            </button>

            {/* Finish Workout Inline Button */}
            <div className="pt-4 border-t border-neutral-800 mt-8">
              <button 
                onClick={() => setIsFinishModalOpen(true)}
                className="w-full bg-white text-black font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-[0.98] transition-all shadow-xl"
              >
                <CheckCircle size={24} />
                FINISH WORKOUT
              </button>
            </div>
          </>
        )}

        {view === "summary" && (
          <WorkoutSummary 
            sessionSets={sessionSets} 
            allSets={allSets}
            exercises={exercises} 
            onStartNew={() => setView("home")} 
          />
        )}
      </main>

      {/* Modals */}
      <ExerciseSelectorModal 
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        exercises={exercises.filter(ex => !activeExerciseIds.includes(ex.id))}
        onSelect={(id) => setActiveExerciseIds([...activeExerciseIds, id])}
      />
      <CreateExerciseModal 
        isOpen={isCreateExModalOpen}
        onClose={() => setIsCreateExModalOpen(false)}
        onSave={(name, cat, rest) => setExercises([...exercises, { id: "ex_"+Date.now(), name, category: cat, defaultRestTime: rest }])}
      />
      <RoutineModal 
        isOpen={routineModalState.isOpen}
        onClose={() => setRoutineModalState({ ...routineModalState, isOpen: false })}
        exercises={exercises}
        routine={templates.find(t => t.id === routineModalState.routineId)}
        initialMode={routineModalState.mode}
        onSave={handleSaveTemplate}
        onDelete={handleDeleteTemplate}
        onStartWorkout={(tpl) => {
          handleStartTemplateSession(tpl);
          setRoutineModalState({ ...routineModalState, isOpen: false });
        }}
      />
      <FinishSessionModal 
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onFinish={handleFinishSession}
      />
    </div>
  );
}