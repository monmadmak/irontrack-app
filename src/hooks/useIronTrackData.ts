import { useState, useEffect } from "react";
import { Exercise, WorkoutTemplate, SetRecord, WorkoutSession } from "../types";

const DEFAULT_EXERCISES: Exercise[] = [
  // Free Weights
  { id: "e1", name: "Barbell Squat", category: "Legs", defaultRestTime: 120 },
  { id: "e2", name: "Bench Press", category: "Chest", defaultRestTime: 120 },
  { id: "e3", name: "Deadlift", category: "Back", defaultRestTime: 150 },
  { id: "e4", name: "Overhead Press", category: "Shoulders", defaultRestTime: 90 },
  { id: "e5", name: "Dumbbell Curl", category: "Arms", defaultRestTime: 60 },
  { id: "e6", name: "Dumbbell Lateral Raise", category: "Shoulders", defaultRestTime: 60 },
  { id: "e7", name: "Goblet Squat", category: "Legs", defaultRestTime: 90 },
  // Bodyweight
  { id: "e8", name: "Pull-ups", category: "Back", defaultRestTime: 90 },
  { id: "e9", name: "Push-ups", category: "Chest", defaultRestTime: 60 },
  // Machines
  { id: "e10", name: "Machine Chest Press", category: "Chest", defaultRestTime: 90 },
  { id: "e11", name: "Lat Pulldown", category: "Back", defaultRestTime: 90 },
  { id: "e12", name: "Leg Press", category: "Legs", defaultRestTime: 120 },
  { id: "e13", name: "Leg Extension", category: "Legs", defaultRestTime: 60 },
  { id: "e14", name: "Tricep Pushdown", category: "Arms", defaultRestTime: 60 },
];

const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "tpl_beginner_full",
    name: "Beginner Full Body",
    exerciseIds: ["e7", "e10", "e11", "e5", "e14"], // Goblet Squat, Chest Press, Lat Pulldown, Curls, Tricep
    level: "beginner",
    goal: "gain muscle",
    equipment: "gym",
  },
  {
    id: "tpl_upper_basic",
    name: "Upper Body Basics",
    exerciseIds: ["e2", "e11", "e4", "e5", "e14"], // Bench, Lat, OHP, Curls, Tricep
    level: "beginner",
    goal: "gain muscle",
    equipment: "gym",
  },
];

export function useIronTrackData() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [allSets, setAllSets] = useState<SetRecord[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  
  const [sessionId, setSessionId] = useState<string>("");
  const [activeExerciseIds, setActiveExerciseIds] = useState<string[]>([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [lastLoggedExerciseId, setLastLoggedExerciseId] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const load = (key: string, setter: any) => {
      const val = localStorage.getItem(`irontrack_${key}`);
      if (val) setter(JSON.parse(val));
    };
    
    load("sets", setAllSets);
    load("sessions", setSessions);
    
    // Handle templates with defaults for beginners
    const savedTemplates = localStorage.getItem("irontrack_templates");
    if (savedTemplates) {
      const parsed = JSON.parse(savedTemplates);
      if (parsed.length === 0 && !localStorage.getItem("irontrack_v3_routines")) {
        setTemplates(DEFAULT_TEMPLATES);
        localStorage.setItem("irontrack_v3_routines", "true");
      } else {
        setTemplates(parsed);
      }
    } else {
      setTemplates(DEFAULT_TEMPLATES);
      localStorage.setItem("irontrack_v3_routines", "true");
    }
    
    const savedExercises = localStorage.getItem("irontrack_exercises");
    if (savedExercises) {
      const parsed: Exercise[] = JSON.parse(savedExercises);
      // Merge: Keep all custom exercises (id starts with "ex_") and add new defaults
      const customExercises = parsed.filter(e => e.id.startsWith("ex_"));
      setExercises([...DEFAULT_EXERCISES, ...customExercises]);
    }
    
    const savedSessionId = localStorage.getItem("irontrack_current_session");
    if (savedSessionId) {
      setSessionId(savedSessionId);
      load("active_exercises", setActiveExerciseIds);
      setIsWorkoutActive(true);
    }

    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("irontrack_sets", JSON.stringify(allSets));
      localStorage.setItem("irontrack_sessions", JSON.stringify(sessions));
      localStorage.setItem("irontrack_templates", JSON.stringify(templates));
      localStorage.setItem("irontrack_exercises", JSON.stringify(exercises));
      
      if (isWorkoutActive) {
        localStorage.setItem("irontrack_current_session", sessionId);
        localStorage.setItem("irontrack_active_exercises", JSON.stringify(activeExerciseIds));
      } else {
        localStorage.removeItem("irontrack_current_session");
        localStorage.removeItem("irontrack_active_exercises");
      }
    }
  }, [allSets, sessions, templates, exercises, sessionId, activeExerciseIds, isWorkoutActive, isLoaded]);

  return {
    isLoaded,
    exercises, setExercises,
    templates, setTemplates,
    allSets, setAllSets,
    sessions, setSessions,
    sessionId, setSessionId,
    activeExerciseIds, setActiveExerciseIds,
    isWorkoutActive, setIsWorkoutActive,
    lastLoggedExerciseId, setLastLoggedExerciseId
  };
}
