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
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import HealthDashboard from "../components/HealthDashboard";
import ProfileDashboard from "../components/ProfileDashboard";
import CreateExerciseModal from "../components/CreateExerciseModal";
import RoutineModal from "../components/RoutineModal";
import FinishSessionModal from "../components/FinishSessionModal";
import { BarChart2, Activity, User } from "lucide-react";

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
  const [view, setView] = useState<"home" | "analytics" | "health" | "profile" | "workout" | "summary">("home");
  
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
  
  const [timerTargetTime, setTimerTargetTime] = useState<number | null>(null);

  const handleStartEmptySession = () => {
    setSessionId(Math.random().toString(36).substring(7));
    setActiveExerciseIds([]);
    setIsWorkoutActive(true);
    setView("workout");
    setTimerTargetTime(null);
  };

  const handleStartTemplateSession = (template: WorkoutTemplate) => {
    setSessionId(Math.random().toString(36).substring(7));
    setActiveExerciseIds(template.exerciseIds);
    setIsWorkoutActive(true);
    setView("workout");
    setTimerTargetTime(null);
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
      setTimerTargetTime(Date.now() + exercise.defaultRestTime * 1000);
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
    setTimerTargetTime(null);
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
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-28 font-sans">
      <nav className="bg-white sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-md mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => view === "summary" && setView("home")}>
            <div className="bg-blue-500 p-2 rounded-xl text-white shadow-sm">
              <Dumbbell size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">IronTrack</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4 mt-2 space-y-6">
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
        
        {view === "analytics" && (
          <AnalyticsDashboard sets={allSets} exercises={exercises} />
        )}

        {view === "health" && (
          <HealthDashboard />
        )}

        {view === "profile" && (
          <ProfileDashboard />
        )}

        {view === "workout" && (
          <>
            <div className="space-y-8">
              {activeExerciseIds.length === 0 && (
                <div className="text-center py-16 text-gray-400 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Dumbbell size={32} className="text-blue-500" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-2">Build Your Routine</h3>
                  <p className="text-sm max-w-[250px] mx-auto text-gray-500">Tap <strong className="text-blue-500">ADD EXERCISE</strong> to get started.</p>
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
                    
                    showTimer={!!timerTargetTime && lastLoggedExerciseId === exId}
                    timerTargetTime={timerTargetTime}
                    onAddTime={(a) => setTimerTargetTime(p => p ? p + a * 1000 : null)}
                    onSkipTimer={() => setTimerTargetTime(null)}
                  />
                );
              })}
            </div>

            <button 
              onClick={() => setIsExerciseModalOpen(true)}
              className="w-full bg-white border border-gray-200 text-gray-700 font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              <Plus size={24} className="text-blue-500" /> ADD EXERCISE
            </button>

            {/* Finish Workout Inline Button */}
            <div className="pt-6">
              <button 
                onClick={() => setIsFinishModalOpen(true)}
                className="w-full bg-blue-500 text-white font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all shadow-md shadow-blue-500/20"
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

      {/* Bottom Navigation Bar */}
      {view !== "workout" && view !== "summary" && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 pb-safe">
          <div className="max-w-md mx-auto flex items-center justify-around h-16">
            <button 
              onClick={() => setView("home")}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${view === "home" ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Home size={24} strokeWidth={view === "home" ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button 
              onClick={() => setView("analytics")}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${view === "analytics" ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
            >
              <BarChart2 size={24} strokeWidth={view === "analytics" ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Analytics</span>
            </button>
            <button 
              onClick={() => setView("health")}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${view === "health" ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Activity size={24} strokeWidth={view === "health" ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Health</span>
            </button>
            <button 
              onClick={() => setView("profile")}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${view === "profile" ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
            >
              <User size={24} strokeWidth={view === "profile" ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Profile</span>
            </button>
          </div>
        </nav>
      )}

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