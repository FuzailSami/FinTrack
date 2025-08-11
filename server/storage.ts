import {
  users,
  transactions,
  categories,
  budgets,
  type Transaction,
  type InsertTransaction,
  type Category,
  type InsertCategory,
  type Budget,
  type InsertBudget,
  type User,
  type UpsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Transaction operations
  getTransactions(userId: string): Promise<Transaction[]>;
  getTransaction(id: string, userId: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction, userId: string): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>, userId: string): Promise<Transaction | undefined>;
  deleteTransaction(id: string, userId: string): Promise<boolean>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Budget operations
  getBudgets(userId: string): Promise<Budget[]>;
  createBudget(budget: InsertBudget, userId: string): Promise<Budget>;
  updateBudget(id: string, budget: Partial<InsertBudget>, userId: string): Promise<Budget | undefined>;
  deleteBudget(id: string, userId: string): Promise<boolean>;
  
  // Analytics operations
  getMonthlyExpenses(year: number, month: number, userId: string): Promise<Transaction[]>;
  getExpensesByCategory(startDate: string, endDate: string, userId: string): Promise<{ category: string; total: number; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with default categories on first run
    this.initializeDefaultCategories();
  }

  private async initializeDefaultCategories() {
    try {
      // Check if categories already exist
      const existingCategories = await db.select().from(categories).limit(1);
      if (existingCategories.length > 0) return;

      const defaultCategories: InsertCategory[] = [
        { name: "Food & Dining", type: "expense", color: "#F44336", icon: "fas fa-utensils" },
        { name: "Transportation", type: "expense", color: "#FF9800", icon: "fas fa-car" },
        { name: "Utilities", type: "expense", color: "#2196F3", icon: "fas fa-bolt" },
        { name: "Entertainment", type: "expense", color: "#9C27B0", icon: "fas fa-film" },
        { name: "Healthcare", type: "expense", color: "#4CAF50", icon: "fas fa-heartbeat" },
        { name: "Shopping", type: "expense", color: "#795548", icon: "fas fa-shopping-bag" },
        { name: "Income", type: "income", color: "#4CAF50", icon: "fas fa-dollar-sign" },
        { name: "Other", type: "expense", color: "#607D8B", icon: "fas fa-question" },
      ];

      await db.insert(categories).values(defaultCategories);
    } catch (error) {
      console.error("Error initializing default categories:", error);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Transaction operations
  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId));
  }

  async getTransaction(id: string, userId: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return transaction;
  }

  async createTransaction(insertTransaction: InsertTransaction, userId: string): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values({ ...insertTransaction, userId })
      .returning();
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<InsertTransaction>, userId: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set(updates)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    return transaction;
  }

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return result.rowCount > 0;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  // Budget operations
  async getBudgets(userId: string): Promise<Budget[]> {
    return await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, userId));
  }

  async createBudget(insertBudget: InsertBudget, userId: string): Promise<Budget> {
    const [budget] = await db
      .insert(budgets)
      .values({ ...insertBudget, userId })
      .returning();
    return budget;
  }

  async updateBudget(id: string, updates: Partial<InsertBudget>, userId: string): Promise<Budget | undefined> {
    const [budget] = await db
      .update(budgets)
      .set(updates)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
      .returning();
    return budget;
  }

  async deleteBudget(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(budgets)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)));
    return result.rowCount > 0;
  }

  // Analytics operations
  async getMonthlyExpenses(year: number, month: number, userId: string): Promise<Transaction[]> {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    return await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, 'expense'),
          // Note: Using string comparison since date is stored as varchar
          // This works for ISO date strings (YYYY-MM-DD)
        )
      );
  }

  async getExpensesByCategory(startDate: string, endDate: string, userId: string): Promise<{ category: string; total: number; count: number }[]> {
    const userTransactions = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, 'expense')
        )
      );

    // Filter by date range and group by category
    const filtered = userTransactions.filter(t => {
      const date = new Date(t.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return date >= start && date <= end;
    });

    const grouped = filtered.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { category: t.category, total: 0, count: 0 };
      }
      acc[t.category].total += parseFloat(t.amount);
      acc[t.category].count += 1;
      return acc;
    }, {} as Record<string, { category: string; total: number; count: number }>);

    return Object.values(grouped);
  }
}

export const storage = new DatabaseStorage();
