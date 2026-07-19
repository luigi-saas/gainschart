import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

// ── Types ───────────────────────────────────────────────────────────────────
export interface MonthBudget {
  id: string;
  userId: string;
  monthId: string;
  totalBudget: number;
  homePart: number;
  walletPart: number;
  bankPart: number;
  createdAt: string;
}

export interface VariableExpense {
  id: string;
  userId: string;
  monthId: string;
  name: string;
  amount: number;
  type: string;
  date: string;
  createdAt: string;
}

export interface FixedExpense {
  id: string;
  userId: string;
  monthId: string;
  name: string;
  amount: number;
  type: string;
  base: number;
  createdAt: string;
}

export interface SavingGoal {
  id: string;
  userId: string;
  name: string;
  target: number;
  current: number;
  active: boolean;
  createdAt: string;
}

export interface SportProgramme {
  id: string;
  userId: string;
  name: string;
  description: string;
  daysPerWeek: number;
  level: string;
  active: boolean;
  createdAt: string;
}

export interface ProgrammeExercise {
  id: string;
  programmeId: string;
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  sets: number;
  reps: number;
  day: number;
  orderIndex: number;
}

// Helper to check if Firestore is available
function requireFirestore() {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase is not configured");
  }
  return db;
}

// ── Budget Functions ────────────────────────────────────────────────────────
export async function getBudget(userId: string, monthId: string): Promise<MonthBudget | null> {
  const firestore = requireFirestore();
  const q = query(
    collection(firestore, "budgets"),
    where("userId", "==", userId),
    where("monthId", "==", monthId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as MonthBudget;
}

export async function createBudget(data: Omit<MonthBudget, "id">): Promise<MonthBudget> {
  const firestore = requireFirestore();
  const docRef = await addDoc(collection(firestore, "budgets"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
}

// ── Variable Expenses ───────────────────────────────────────────────────────
export async function getVariableExpenses(userId: string, monthId: string): Promise<VariableExpense[]> {
  const firestore = requireFirestore();
  const q = query(
    collection(firestore, "variableExpenses"),
    where("userId", "==", userId),
    where("monthId", "==", monthId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as VariableExpense));
}

export async function addVariableExpense(data: Omit<VariableExpense, "id">): Promise<VariableExpense> {
  const firestore = requireFirestore();
  const docRef = await addDoc(collection(firestore, "variableExpenses"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
}

export async function deleteVariableExpense(id: string): Promise<void> {
  const firestore = requireFirestore();
  await deleteDoc(doc(firestore, "variableExpenses", id));
}

// ── Fixed Expenses ──────────────────────────────────────────────────────────
export async function getFixedExpenses(userId: string, monthId: string): Promise<FixedExpense[]> {
  const firestore = requireFirestore();
  const q = query(
    collection(firestore, "fixedExpenses"),
    where("userId", "==", userId),
    where("monthId", "==", monthId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FixedExpense));
}

export async function addFixedExpense(data: Omit<FixedExpense, "id">): Promise<FixedExpense> {
  const firestore = requireFirestore();
  const docRef = await addDoc(collection(firestore, "fixedExpenses"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
}

export async function deleteFixedExpense(id: string): Promise<void> {
  const firestore = requireFirestore();
  await deleteDoc(doc(firestore, "fixedExpenses", id));
}

// ── Saving Goals ────────────────────────────────────────────────────────────
export async function getSavingGoals(userId: string): Promise<SavingGoal[]> {
  const firestore = requireFirestore();
  const q = query(collection(firestore, "savingGoals"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SavingGoal));
}

export async function addSavingGoal(data: Omit<SavingGoal, "id">): Promise<SavingGoal> {
  const firestore = requireFirestore();
  const docRef = await addDoc(collection(firestore, "savingGoals"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
}

export async function updateSavingGoal(id: string, data: Partial<SavingGoal>): Promise<void> {
  const firestore = requireFirestore();
  await updateDoc(doc(firestore, "savingGoals", id), data);
}

export async function deleteSavingGoal(id: string): Promise<void> {
  const firestore = requireFirestore();
  await deleteDoc(doc(firestore, "savingGoals", id));
}

// ── Sport Programmes ────────────────────────────────────────────────────────
export async function getProgrammes(userId: string): Promise<SportProgramme[]> {
  const firestore = requireFirestore();
  const q = query(collection(firestore, "programmes"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SportProgramme));
}

export async function createProgramme(data: Omit<SportProgramme, "id">): Promise<SportProgramme> {
  const firestore = requireFirestore();
  const docRef = await addDoc(collection(firestore, "programmes"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
}

export async function deleteProgramme(id: string): Promise<void> {
  const firestore = requireFirestore();
  // Delete exercises first
  const exQ = query(collection(firestore, "programmeExercises"), where("programmeId", "==", id));
  const exSnap = await getDocs(exQ);
  for (const exDoc of exSnap.docs) {
    await deleteDoc(exDoc.ref);
  }
  await deleteDoc(doc(firestore, "programmes", id));
}

// ── Programme Exercises ─────────────────────────────────────────────────────
export async function getProgrammeExercises(programmeId: string): Promise<ProgrammeExercise[]> {
  const firestore = requireFirestore();
  const q = query(
    collection(firestore, "programmeExercises"),
    where("programmeId", "==", programmeId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() } as ProgrammeExercise))
    .sort((a, b) => a.day - b.day || a.orderIndex - b.orderIndex);
}

export async function addProgrammeExercise(data: Omit<ProgrammeExercise, "id">): Promise<ProgrammeExercise> {
  const firestore = requireFirestore();
  const docRef = await addDoc(collection(firestore, "programmeExercises"), data);
  return { id: docRef.id, ...data };
}

// ── History ─────────────────────────────────────────────────────────────────
export async function getAllExpenses(userId: string): Promise<(VariableExpense | FixedExpense)[]> {
  const firestore = requireFirestore();
  const varQ = query(collection(firestore, "variableExpenses"), where("userId", "==", userId));
  const fixQ = query(collection(firestore, "fixedExpenses"), where("userId", "==", userId));
  
  const [varSnap, fixSnap] = await Promise.all([getDocs(varQ), getDocs(fixQ)]);
  
  const varExpenses = varSnap.docs.map((d) => ({ id: d.id, ...d.data(), kind: "variable" } as VariableExpense & { kind: string }));
  const fixExpenses = fixSnap.docs.map((d) => ({ id: d.id, ...d.data(), kind: "fixed" } as FixedExpense & { kind: string }));
  
  return [...varExpenses, ...fixExpenses].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
