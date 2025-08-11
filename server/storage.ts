import { type Transaction, type InsertTransaction, type Category, type InsertCategory, type Budget, type InsertBudget } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Transaction operations
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Budget operations
  getBudgets(): Promise<Budget[]>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
  deleteBudget(id: string): Promise<boolean>;
  
  // Analytics operations
  getMonthlyExpenses(year: number, month: number): Promise<Transaction[]>;
  getExpensesByCategory(startDate: string, endDate: string): Promise<{ category: string; total: number; count: number }[]>;
}

export class MemStorage implements IStorage {
  private transactions: Map<string, Transaction>;
  private categories: Map<string, Category>;
  private budgets: Map<string, Budget>;

  constructor() {
    this.transactions = new Map();
    this.categories = new Map();
    this.budgets = new Map();
    
    // Initialize with default categories
    this.initializeDefaultCategories();
  }

  private initializeDefaultCategories() {
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

    defaultCategories.forEach(category => {
      const id = randomUUID();
      const fullCategory: Category = { ...category, id };
      this.categories.set(id, fullCategory);
    });
  }

  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      created_at: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const existing = this.transactions.get(id);
    if (!existing) return undefined;
    
    const updated: Transaction = { ...existing, ...updates };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return this.transactions.delete(id);
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Budget operations
  async getBudgets(): Promise<Budget[]> {
    return Array.from(this.budgets.values());
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = randomUUID();
    const budget: Budget = {
      ...insertBudget,
      id,
      created_at: new Date(),
    };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(id: string, updates: Partial<InsertBudget>): Promise<Budget | undefined> {
    const existing = this.budgets.get(id);
    if (!existing) return undefined;
    
    const updated: Budget = { ...existing, ...updates };
    this.budgets.set(id, updated);
    return updated;
  }

  async deleteBudget(id: string): Promise<boolean> {
    return this.budgets.delete(id);
  }

  // Analytics operations
  async getMonthlyExpenses(year: number, month: number): Promise<Transaction[]> {
    const transactions = Array.from(this.transactions.values());
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() === month - 1 && t.type === 'expense';
    });
  }

  async getExpensesByCategory(startDate: string, endDate: string): Promise<{ category: string; total: number; count: number }[]> {
    const transactions = Array.from(this.transactions.values());
    const filtered = transactions.filter(t => {
      const date = new Date(t.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return date >= start && date <= end && t.type === 'expense';
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

export const storage = new MemStorage();
