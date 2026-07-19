// ── Embedded exercise database with GIF URLs ───────────────────────────────
// Using public ExerciseDB OSS GIF URLs (static.exercisedb.dev)

export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export const EXERCISES: Exercise[] = [
  // ── CHEST ─────────────────────────────────────────────────────────────
  { id: "0025", name: "Barbell Bench Press", bodyPart: "chest", target: "pectorals", equipment: "barbell",
    gifUrl: "https://v2.exercisedb.io/image/NIQyB2l3oAGO2v", secondaryMuscles: ["triceps", "shoulders"],
    instructions: ["Lie flat on a bench", "Grip bar wider than shoulder-width", "Lower bar to mid-chest", "Press up to full extension", "Repeat"] },
  { id: "0030", name: "Push-up", bodyPart: "chest", target: "pectorals", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/3w5HYWJF7Sjdzn", secondaryMuscles: ["triceps", "anterior deltoids"],
    instructions: ["Start in plank position", "Lower body until chest nearly touches floor", "Push back up", "Keep body straight throughout"] },
  { id: "0035", name: "Dumbbell Fly", bodyPart: "chest", target: "pectorals", equipment: "dumbbell",
    gifUrl: "https://v2.exercisedb.io/image/eNsWgJdUOXrOvK", secondaryMuscles: ["anterior deltoids"],
    instructions: ["Lie on flat bench with dumbbells", "Extend arms above chest", "Lower arms in arc motion", "Squeeze chest to return"] },
  { id: "0036", name: "Incline Dumbbell Press", bodyPart: "chest", target: "pectorals", equipment: "dumbbell",
    gifUrl: "https://v2.exercisedb.io/image/t-ORjlLLCcg2Yz", secondaryMuscles: ["triceps", "anterior deltoids"],
    instructions: ["Set bench to 30-45 degree incline", "Press dumbbells up from shoulders", "Lower with control", "Repeat"] },

  // ── BACK ──────────────────────────────────────────────────────────────
  { id: "0050", name: "Pull-up", bodyPart: "back", target: "lats", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/XP2rLgblKTFPH6", secondaryMuscles: ["biceps", "forearms"],
    instructions: ["Hang from bar with palms facing away", "Pull body up until chin above bar", "Lower slowly", "Repeat"] },
  { id: "0055", name: "Barbell Bent-over Row", bodyPart: "back", target: "lats", equipment: "barbell",
    gifUrl: "https://v2.exercisedb.io/image/xF6i4v7q5Y-7UW", secondaryMuscles: ["biceps", "rear deltoids"],
    instructions: ["Bend at hips, keep back flat", "Pull barbell to lower chest", "Squeeze shoulder blades", "Lower with control"] },
  { id: "0060", name: "Lat Pulldown", bodyPart: "back", target: "lats", equipment: "cable",
    gifUrl: "https://v2.exercisedb.io/image/IKjS16kJ5kOCq0", secondaryMuscles: ["biceps"],
    instructions: ["Sit at lat pulldown machine", "Pull bar to upper chest", "Control the return", "Keep chest up"] },
  { id: "0065", name: "Seated Cable Row", bodyPart: "back", target: "upper back", equipment: "cable",
    gifUrl: "https://v2.exercisedb.io/image/GWb02JvZWuTcgj", secondaryMuscles: ["biceps", "lats"],
    instructions: ["Sit with feet on platform", "Pull handles to torso", "Squeeze back muscles", "Return slowly"] },

  // ── SHOULDERS ─────────────────────────────────────────────────────────
  { id: "0100", name: "Overhead Press", bodyPart: "shoulders", target: "deltoids", equipment: "barbell",
    gifUrl: "https://v2.exercisedb.io/image/j2DLUFfpR4r6PS", secondaryMuscles: ["triceps", "upper chest"],
    instructions: ["Stand with barbell at shoulders", "Press overhead to full extension", "Lower to shoulders", "Keep core tight"] },
  { id: "0105", name: "Lateral Raise", bodyPart: "shoulders", target: "deltoids", equipment: "dumbbell",
    gifUrl: "https://v2.exercisedb.io/image/XPd6zXFwbj5BVK", secondaryMuscles: ["traps"],
    instructions: ["Stand with dumbbells at sides", "Raise arms to shoulder height", "Keep slight bend in elbows", "Lower with control"] },
  { id: "0110", name: "Face Pull", bodyPart: "shoulders", target: "rear deltoids", equipment: "cable",
    gifUrl: "https://v2.exercisedb.io/image/wKk0dz8f2NWlvD", secondaryMuscles: ["traps", "rhomboids"],
    instructions: ["Set cable at face height", "Pull rope to face", "Spread rope at end", "Return slowly"] },

  // ── UPPER ARMS ────────────────────────────────────────────────────────
  { id: "0150", name: "Barbell Curl", bodyPart: "upper arms", target: "biceps", equipment: "barbell",
    gifUrl: "https://v2.exercisedb.io/image/7yTj-7RJvTPR1E", secondaryMuscles: ["forearms"],
    instructions: ["Stand with barbell at hip level", "Curl bar to shoulders", "Squeeze at top", "Lower with control"] },
  { id: "0155", name: "Tricep Dip", bodyPart: "upper arms", target: "triceps", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/0F4BVW9bE1FQHZ", secondaryMuscles: ["chest", "shoulders"],
    instructions: ["Grip parallel bars", "Lower body by bending elbows", "Push back up to full extension", "Keep elbows close"] },
  { id: "0160", name: "Hammer Curl", bodyPart: "upper arms", target: "biceps", equipment: "dumbbell",
    gifUrl: "https://v2.exercisedb.io/image/gqz-LGM-6gXPGT", secondaryMuscles: ["forearms"],
    instructions: ["Hold dumbbells with neutral grip", "Curl up keeping palms facing", "Squeeze at top", "Lower slowly"] },

  // ── UPPER LEGS ────────────────────────────────────────────────────────
  { id: "0200", name: "Barbell Squat", bodyPart: "upper legs", target: "quads", equipment: "barbell",
    gifUrl: "https://v2.exercisedb.io/image/KjFXzJP2AW7hSs", secondaryMuscles: ["glutes", "hamstrings"],
    instructions: ["Place barbell on upper back", "Squat down until thighs are parallel", "Drive through heels to stand", "Keep chest up throughout"] },
  { id: "0205", name: "Romanian Deadlift", bodyPart: "upper legs", target: "hamstrings", equipment: "barbell",
    gifUrl: "https://v2.exercisedb.io/image/1iMbW0JtQzYJj0", secondaryMuscles: ["glutes", "lower back"],
    instructions: ["Hold barbell at hip level", "Hinge at hips, lower bar along legs", "Feel hamstring stretch", "Drive hips forward to stand"] },
  { id: "0210", name: "Leg Press", bodyPart: "upper legs", target: "quads", equipment: "machine",
    gifUrl: "https://v2.exercisedb.io/image/eMhKHABOoWahwu", secondaryMuscles: ["glutes", "hamstrings"],
    instructions: ["Sit in leg press machine", "Place feet shoulder-width on platform", "Lower weight with control", "Press back up without locking knees"] },
  { id: "0215", name: "Lunges", bodyPart: "upper legs", target: "quads", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/F7C4cUefOXP3Gw", secondaryMuscles: ["glutes", "hamstrings"],
    instructions: ["Step forward with one leg", "Lower until both knees at 90°", "Push back to start", "Alternate legs"] },

  // ── LOWER LEGS ────────────────────────────────────────────────────────
  { id: "0250", name: "Standing Calf Raise", bodyPart: "lower legs", target: "calves", equipment: "machine",
    gifUrl: "https://v2.exercisedb.io/image/aGFpR96U3wYDUE", secondaryMuscles: ["soleus"],
    instructions: ["Stand on calf raise machine", "Rise up on toes", "Hold at top briefly", "Lower slowly for full stretch"] },

  // ── WAIST / CORE ──────────────────────────────────────────────────────
  { id: "0300", name: "Crunch", bodyPart: "waist", target: "abs", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/RKJLBB-Wk8Kdtf", secondaryMuscles: ["obliques"],
    instructions: ["Lie on back, knees bent", "Curl shoulders off floor", "Squeeze abs at top", "Lower with control"] },
  { id: "0305", name: "Plank", bodyPart: "waist", target: "abs", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/h0hd57pPU2N3gk", secondaryMuscles: ["shoulders", "glutes"],
    instructions: ["Get into forearm plank position", "Keep body in straight line", "Engage core throughout", "Hold for desired duration"] },
  { id: "0310", name: "Russian Twist", bodyPart: "waist", target: "abs", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/gk6bJpJxFnqHNL", secondaryMuscles: ["obliques"],
    instructions: ["Sit with knees bent, lean back slightly", "Twist torso side to side", "Keep feet off ground for challenge", "Control the movement"] },
  { id: "0315", name: "Leg Raise", bodyPart: "waist", target: "abs", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/pD2BbAfSz1L5E6", secondaryMuscles: ["hip flexors"],
    instructions: ["Lie flat on back", "Raise legs to 90 degrees", "Lower slowly without touching floor", "Keep lower back pressed down"] },

  // ── CARDIO ────────────────────────────────────────────────────────────
  { id: "0400", name: "Jumping Jacks", bodyPart: "cardio", target: "cardiovascular system", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/DBpWJB7BQu6VFp", secondaryMuscles: ["calves", "deltoids"],
    instructions: ["Stand with feet together", "Jump while spreading arms and legs", "Return to start position", "Maintain steady rhythm"] },
  { id: "0405", name: "Burpees", bodyPart: "cardio", target: "cardiovascular system", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/Y40oY3fkRqVUv7", secondaryMuscles: ["chest", "quads", "shoulders"],
    instructions: ["Stand tall", "Drop into squat, hands on floor", "Jump feet back to plank", "Do a push-up, jump feet in, jump up"] },
  { id: "0410", name: "Mountain Climbers", bodyPart: "cardio", target: "cardiovascular system", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/pFpCjp8FJqWYop", secondaryMuscles: ["abs", "quads"],
    instructions: ["Start in plank position", "Drive one knee to chest", "Quickly alternate legs", "Keep hips level"] },

  // ── LOWER ARMS ────────────────────────────────────────────────────────
  { id: "0450", name: "Wrist Curl", bodyPart: "lower arms", target: "forearms", equipment: "dumbbell",
    gifUrl: "https://v2.exercisedb.io/image/mSaGIGqz0n9XWR", secondaryMuscles: [],
    instructions: ["Sit with forearms on thighs", "Curl wrists up with dumbbells", "Lower slowly", "Keep forearms stationary"] },

  // ── NECK ──────────────────────────────────────────────────────────────
  { id: "0500", name: "Neck Curl", bodyPart: "neck", target: "sternocleidomastoid", equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/lKIXC7MBJSHJFm", secondaryMuscles: [],
    instructions: ["Lie face up on bench", "Let head hang off edge", "Curl chin to chest", "Lower with control"] },
];

export function getExercisesByBodyPart(bodyPart: string): Exercise[] {
  return EXERCISES.filter(e => e.bodyPart === bodyPart);
}

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find(e => e.id === id);
}

export function searchExercises(query: string): Exercise[] {
  const q = query.toLowerCase();
  return EXERCISES.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.bodyPart.toLowerCase().includes(q) ||
    e.target.toLowerCase().includes(q) ||
    e.equipment.toLowerCase().includes(q)
  );
}

// ── Pre-built programmes ────────────────────────────────────────────────────
export interface ProgrammeTemplate {
  name: string;
  description: string;
  level: string;
  daysPerWeek: number;
  days: { day: number; label: string; exerciseIds: string[] }[];
}

export const PROGRAMME_TEMPLATES: ProgrammeTemplate[] = [
  {
    name: "Full Body Beginner",
    description: "3-day full body workout for beginners. Perfect to build a foundation.",
    level: "beginner",
    daysPerWeek: 3,
    days: [
      { day: 1, label: "Day A", exerciseIds: ["0030", "0200", "0055", "0100", "0300"] },
      { day: 2, label: "Day B", exerciseIds: ["0025", "0205", "0060", "0150", "0305"] },
      { day: 3, label: "Day C", exerciseIds: ["0036", "0215", "0065", "0105", "0310"] },
    ],
  },
  {
    name: "Push Pull Legs",
    description: "Classic 3-day split targeting push, pull, and leg movements.",
    level: "intermediate",
    daysPerWeek: 3,
    days: [
      { day: 1, label: "Push", exerciseIds: ["0025", "0036", "0100", "0105", "0155"] },
      { day: 2, label: "Pull", exerciseIds: ["0050", "0055", "0060", "0150", "0160"] },
      { day: 3, label: "Legs", exerciseIds: ["0200", "0205", "0210", "0215", "0250"] },
    ],
  },
  {
    name: "Upper / Lower Split",
    description: "4-day split alternating upper and lower body workouts.",
    level: "intermediate",
    daysPerWeek: 4,
    days: [
      { day: 1, label: "Upper A", exerciseIds: ["0025", "0055", "0100", "0150", "0155"] },
      { day: 2, label: "Lower A", exerciseIds: ["0200", "0205", "0250", "0300", "0305"] },
      { day: 3, label: "Upper B", exerciseIds: ["0036", "0060", "0105", "0160", "0110"] },
      { day: 4, label: "Lower B", exerciseIds: ["0210", "0215", "0310", "0315", "0400"] },
    ],
  },
  {
    name: "HIIT Cardio Blast",
    description: "High-intensity cardio & bodyweight circuit for fat burning.",
    level: "advanced",
    daysPerWeek: 3,
    days: [
      { day: 1, label: "Circuit A", exerciseIds: ["0400", "0405", "0410", "0030", "0300"] },
      { day: 2, label: "Circuit B", exerciseIds: ["0405", "0215", "0310", "0315", "0400"] },
      { day: 3, label: "Circuit C", exerciseIds: ["0410", "0030", "0050", "0305", "0405"] },
    ],
  },
];
