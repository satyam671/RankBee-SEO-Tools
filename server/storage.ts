import { type User, type InsertUser, type LoginUser, type ToolResult, type InsertToolResult, type UserSession } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Tool results
  saveToolResult(result: InsertToolResult & { userId?: string }): Promise<ToolResult>;
  getToolResults(userId: string, toolType?: string): Promise<ToolResult[]>;
  
  // Sessions
  createSession(userId: string, token: string, expiresAt: Date): Promise<UserSession>;
  getSessionByToken(token: string): Promise<UserSession | undefined>;
  deleteSession(token: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private toolResults: Map<string, ToolResult>;
  private userSessions: Map<string, UserSession>;

  constructor() {
    this.users = new Map();
    this.toolResults = new Map();
    this.userSessions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = insertUser.password ? await bcrypt.hash(insertUser.password, 10) : null;
    const user: User = { 
      ...insertUser, 
      id, 
      password: hashedPassword,
      googleId: insertUser.googleId || null,
      avatar: insertUser.avatar || null,
      provider: insertUser.provider || 'local',
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async saveToolResult(result: InsertToolResult & { userId?: string }): Promise<ToolResult> {
    const id = randomUUID();
    const toolResult: ToolResult = {
      ...result,
      id,
      userId: result.userId || null,
      createdAt: new Date()
    };
    this.toolResults.set(id, toolResult);
    return toolResult;
  }

  async getToolResults(userId: string, toolType?: string): Promise<ToolResult[]> {
    return Array.from(this.toolResults.values()).filter(
      (result) => result.userId === userId && (!toolType || result.toolType === toolType)
    );
  }

  async createSession(userId: string, token: string, expiresAt: Date): Promise<UserSession> {
    const id = randomUUID();
    const session: UserSession = {
      id,
      userId,
      token,
      expiresAt,
      createdAt: new Date()
    };
    this.userSessions.set(token, session);
    return session;
  }

  async getSessionByToken(token: string): Promise<UserSession | undefined> {
    const session = this.userSessions.get(token);
    if (session && session.expiresAt > new Date()) {
      return session;
    }
    if (session) {
      this.userSessions.delete(token);
    }
    return undefined;
  }

  async deleteSession(token: string): Promise<void> {
    this.userSessions.delete(token);
  }
}

export const storage = new MemStorage();
