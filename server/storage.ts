import {
  users,
  businessProfiles,
  posts,
  analytics,
  type User,
  type UpsertUser,
  type BusinessProfile,
  type InsertBusinessProfile,
  type Post,
  type InsertPost,
  type Analytics,
  type InsertAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  updateUserSubscription(userId: string, tier: string, status: string): Promise<User>;
  incrementUserPostsUsed(userId: string): Promise<User>;
  resetUserPostsUsed(userId: string): Promise<User>;

  // Business Profile operations
  getBusinessProfile(userId: string): Promise<BusinessProfile | undefined>;
  createBusinessProfile(profile: InsertBusinessProfile): Promise<BusinessProfile>;
  updateBusinessProfile(userId: string, updates: Partial<InsertBusinessProfile>): Promise<BusinessProfile>;
  updateInstagramConnection(userId: string, username: string, accessToken: string, instagramUserId: string): Promise<BusinessProfile>;

  // Post operations
  getPosts(userId: string, limit?: number): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: Partial<InsertPost>): Promise<Post>;
  deletePost(id: number): Promise<void>;
  getScheduledPosts(userId: string): Promise<Post[]>;
  getRecentPosts(userId: string, limit?: number): Promise<Post[]>;

  // Analytics operations
  getAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getUserStats(userId: string): Promise<{
    postsThisMonth: number;
    engagementRate: string;
    followersGrowth: number;
    scheduledPosts: number;
  }>;
}

export class DatabaseStorage implements IStorage {
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

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserSubscription(userId: string, tier: string, status: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionTier: tier,
        subscriptionStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async incrementUserPostsUsed(userId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const [updatedUser] = await db
      .update(users)
      .set({
        monthlyPostsUsed: (user.monthlyPostsUsed || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async resetUserPostsUsed(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        monthlyPostsUsed: 0,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Business Profile operations
  async getBusinessProfile(userId: string): Promise<BusinessProfile | undefined> {
    const [profile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.userId, userId));
    return profile;
  }

  async createBusinessProfile(profile: InsertBusinessProfile): Promise<BusinessProfile> {
    const [newProfile] = await db
      .insert(businessProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateBusinessProfile(userId: string, updates: Partial<InsertBusinessProfile>): Promise<BusinessProfile> {
    const [profile] = await db
      .update(businessProfiles)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(businessProfiles.userId, userId))
      .returning();
    return profile;
  }

  async updateInstagramConnection(userId: string, username: string, accessToken: string, instagramUserId: string): Promise<BusinessProfile> {
    const [profile] = await db
      .update(businessProfiles)
      .set({
        instagramUsername: username,
        instagramConnected: true,
        instagramAccessToken: accessToken,
        instagramUserId: instagramUserId,
        updatedAt: new Date(),
      })
      .where(eq(businessProfiles.userId, userId))
      .returning();
    return profile;
  }

  // Post operations
  async getPosts(userId: string, limit = 50): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: number, updates: Partial<InsertPost>): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async getScheduledPosts(userId: string): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.userId, userId),
          eq(posts.status, "scheduled")
        )
      )
      .orderBy(posts.scheduledFor);
  }

  async getRecentPosts(userId: string, limit = 10): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.userId, userId),
          eq(posts.status, "published")
        )
      )
      .orderBy(desc(posts.publishedAt))
      .limit(limit);
  }

  // Analytics operations
  async getAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<Analytics[]> {
    if (startDate && endDate) {
      return await db
        .select()
        .from(analytics)
        .where(
          and(
            eq(analytics.userId, userId),
            gte(analytics.date, startDate),
            lte(analytics.date, endDate)
          )
        )
        .orderBy(desc(analytics.date));
    }

    return await db
      .select()
      .from(analytics)
      .where(eq(analytics.userId, userId))
      .orderBy(desc(analytics.date));
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [analytics] = await db
      .insert(analytics)
      .values(analyticsData)
      .returning();
    return analytics;
  }

  async getUserStats(userId: string): Promise<{
    postsThisMonth: number;
    engagementRate: string;
    followersGrowth: number;
    scheduledPosts: number;
  }> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Get posts this month
    const postsThisMonth = await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.userId, userId),
          gte(posts.createdAt, startOfMonth),
          lte(posts.createdAt, endOfMonth)
        )
      );

    // Get scheduled posts count
    const scheduledPosts = await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.userId, userId),
          eq(posts.status, "scheduled")
        )
      );

    // Get latest analytics for engagement rate and followers growth
    const latestAnalytics = await db
      .select()
      .from(analytics)
      .where(eq(analytics.userId, userId))
      .orderBy(desc(analytics.date))
      .limit(1);

    return {
      postsThisMonth: postsThisMonth.length,
      engagementRate: latestAnalytics[0]?.engagementRate || "0%",
      followersGrowth: latestAnalytics[0]?.followersGrowth || 0,
      scheduledPosts: scheduledPosts.length,
    };
  }
}

export const storage = new DatabaseStorage();
