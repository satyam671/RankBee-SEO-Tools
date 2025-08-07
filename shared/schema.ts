import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password"),
  name: text("name").notNull(),
  googleId: text("google_id").unique(),
  avatar: text("avatar"),
  provider: text("provider").default("local"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const toolResults = pgTable("tool_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  toolType: text("tool_type").notNull(),
  query: text("query").notNull(),
  results: jsonb("results").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
  googleId: true,
  avatar: true,
  provider: true,
}).partial({ password: true, googleId: true, avatar: true, provider: true });

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertToolResultSchema = createInsertSchema(toolResults).pick({
  toolType: true,
  query: true,
  results: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type ToolResult = typeof toolResults.$inferSelect;
export type InsertToolResult = z.infer<typeof insertToolResultSchema>;
export type UserSession = typeof userSessions.$inferSelect;

// Competition Checker Interfaces
export interface CompetitorData {
  name: string;
  domain: string;
  url: string;
  rank: number;
  pa: number;
  da: number;
  backlinks: number;
  referringDomains: number;
  organicKeywords: number;
}

export interface CompetitionAnalysis {
  targetDomain: string;
  keywords: string[];
  country: string;
  competitors: CompetitorData[];
  keywordAnalysis: {
    keyword: string;
    difficulty: number;
    searchVolume: number;
    topCompetitors: {
      domain: string;
      position: number;
      url: string;
      title: string;
    }[];
  }[];
  summary: {
    totalCompetitors: number;
    averageDA: number;
    averagePA: number;
    topCompetitorsByDA: CompetitorData[];
    keywordGaps: string[];
  };
}

// Top Search Queries Interfaces
export interface SearchQueryData {
  keyword: string;
  rank: number;
  cpc: number;
  difficulty: number;
  monthlyVolume: number;
  clicks: number;
  url: string;
  searchVolume: number;
  trend: string;
}

export interface ReferrerData {
  url: string;
  domain: string;
  backlinks: number;
  domainAuthority: number;
  firstSeenDate: Date | null;
  lastSeenDate: Date | null;
  linkType: 'dofollow' | 'nofollow';
  anchorText: string;
  pageTitle: string;
}

export interface TopSearchQueriesAnalysis {
  domain: string;
  country: string;
  totalQueries: number;
  queries: SearchQueryData[];
  summary: {
    averageRank: number;
    totalClicks: number;
    averageCPC: number;
    highVolumeKeywords: number;
    competitiveKeywords: number;
  };
}
