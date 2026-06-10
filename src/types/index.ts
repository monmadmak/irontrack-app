export type SetType = "warmup" | "working" | "drop";

export type SetRecord = {
  id: string;
  sessionId: string;
  exerciseId: string;
  weight: number;
  reps: number;
  type: SetType;
  isPR?: boolean;
  time: string; // ISO string for local storage compatibility
};

export type Exercise = {
  id: string;
  name: string;
  category: string;
  defaultRestTime: number; // in seconds
};

export type WorkoutSession = {
  id: string;
  date: string;
  bodyweight?: number;
  notes?: string;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  exerciseIds: string[];
  level?: "beginner" | "medium" | "advanced";
  goal?: "gain muscle" | "strength" | "lose weight";
  equipment?: "gym" | "dumbbells" | "none";
};
