import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  serial,
  json,
  real,
  uuid,
} from "drizzle-orm/pg-core";

// ── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").default(""),
  displayName: varchar("display_name", { length: 255 }).notNull().default("User"),
  plan: varchar("plan", { length: 20 }).notNull().default("free"),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  notifications: boolean("notifications").notNull().default(true),
  onboardingComplete: boolean("onboarding_complete").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Month Budgets ───────────────────────────────────────────────────────────
export const monthBudgets = pgTable("month_budgets", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  monthId: varchar("month_id", { length: 7 }).notNull(),
  totalBudget: real("total_budget").notNull().default(0),
  homePart: real("home_part").notNull().default(0),
  walletPart: real("wallet_part").notNull().default(0),
  bankPart: real("bank_part").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Variable Expenses ───────────────────────────────────────────────────────
export const variableExpenses = pgTable("variable_expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  monthBudgetId: integer("month_budget_id").notNull().references(() => monthBudgets.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  amount: real("amount").notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Fixed Expenses ──────────────────────────────────────────────────────────
export const fixedExpenses = pgTable("fixed_expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  monthBudgetId: integer("month_budget_id").notNull().references(() => monthBudgets.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  amount: real("amount").notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  base: real("base").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Saving Goals ────────────────────────────────────────────────────────────
export const savingGoals = pgTable("saving_goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  target: real("target").notNull(),
  current: real("current").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Sport Programmes ────────────────────────────────────────────────────────
export const sportProgrammes = pgTable("sport_programmes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  daysPerWeek: integer("days_per_week").notNull().default(3),
  level: varchar("level", { length: 20 }).notNull().default("beginner"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Programme Exercises ─────────────────────────────────────────────────────
export const programmeExercises = pgTable("programme_exercises", {
  id: uuid("id").defaultRandom().primaryKey(),
  programmeId: uuid("programme_id").notNull().references(() => sportProgrammes.id, { onDelete: "cascade" }),
  exerciseId: varchar("exercise_id", { length: 50 }).notNull(),
  exerciseName: varchar("exercise_name", { length: 255 }).notNull(),
  bodyPart: varchar("body_part", { length: 100 }).notNull(),
  target: varchar("target", { length: 100 }).notNull(),
  equipment: varchar("equipment", { length: 100 }),
  gifUrl: text("gif_url"),
  sets: integer("sets").notNull().default(3),
  reps: integer("reps").notNull().default(10),
  day: integer("day").notNull().default(1),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Workout Logs ────────────────────────────────────────────────────────────
export const workoutLogs = pgTable("workout_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  programmeId: uuid("programme_id").notNull().references(() => sportProgrammes.id, { onDelete: "cascade" }),
  exerciseId: varchar("exercise_id", { length: 50 }).notNull(),
  completedSets: integer("completed_sets").notNull().default(0),
  completedReps: integer("completed_reps").notNull().default(0),
  weight: real("weight"),
  notes: text("notes"),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});
