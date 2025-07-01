import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBusinessProfileSchema, insertPostSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});

// Subscription tier limits
const SUBSCRIPTION_LIMITS = {
  free: 5,
  starter: 15,
  pro: 50,
  enterprise: -1, // unlimited
};

const SUBSCRIPTION_PRICES = {
  starter: 900, // $9.00 in cents
  pro: 2900, // $29.00 in cents
  enterprise: 9900, // $99.00 in cents
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Business Profile routes
  app.get('/api/business-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getBusinessProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching business profile:", error);
      res.status(500).json({ message: "Failed to fetch business profile" });
    }
  });

  app.post('/api/business-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertBusinessProfileSchema.parse({
        ...req.body,
        userId,
      });
      
      // Check if profile already exists
      const existingProfile = await storage.getBusinessProfile(userId);
      if (existingProfile) {
        const updatedProfile = await storage.updateBusinessProfile(userId, validatedData);
        res.json(updatedProfile);
      } else {
        const profile = await storage.createBusinessProfile(validatedData);
        res.json(profile);
      }
    } catch (error) {
      console.error("Error creating/updating business profile:", error);
      res.status(500).json({ message: "Failed to save business profile" });
    }
  });

  // Instagram OAuth routes (Mock implementation)
  app.get('/api/instagram/auth-url', isAuthenticated, async (req: any, res) => {
    try {
      // In a real implementation, this would generate Instagram OAuth URL
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=mock&redirect_uri=${encodeURIComponent(
        `${req.protocol}://${req.get('host')}/api/instagram/callback`
      )}&scope=user_profile,user_media&response_type=code`;
      
      res.json({ authUrl });
    } catch (error) {
      console.error("Error generating Instagram auth URL:", error);
      res.status(500).json({ message: "Failed to generate auth URL" });
    }
  });

  app.post('/api/instagram/connect', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { code } = req.body;
      
      // Mock Instagram connection - in real implementation, exchange code for access token
      const mockAccessToken = 'mock_access_token_' + Date.now();
      const mockInstagramUserId = 'mock_ig_user_' + userId;
      const mockUsername = 'businessaccount' + userId.slice(-4);
      
      const profile = await storage.updateInstagramConnection(
        userId,
        mockUsername,
        mockAccessToken,
        mockInstagramUserId
      );
      
      res.json(profile);
    } catch (error) {
      console.error("Error connecting Instagram:", error);
      res.status(500).json({ message: "Failed to connect Instagram" });
    }
  });

  // Posts routes
  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/recent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getRecentPosts(userId, 6);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
      res.status(500).json({ message: "Failed to fetch recent posts" });
    }
  });

  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check subscription limits
      const limit = SUBSCRIPTION_LIMITS[user.subscriptionTier as keyof typeof SUBSCRIPTION_LIMITS] || SUBSCRIPTION_LIMITS.free;
      if (limit !== -1 && (user.monthlyPostsUsed || 0) >= limit) {
        return res.status(403).json({ message: "Monthly post limit reached" });
      }

      const validatedData = insertPostSchema.parse({
        ...req.body,
        userId,
      });
      
      const post = await storage.createPost({
        ...validatedData,
        userId,
      });
      
      // Increment user's posts used count
      await storage.incrementUserPostsUsed(userId);
      
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.put('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const postId = parseInt(req.params.id);
      const updates = req.body;
      
      const post = await storage.updatePost(postId, updates);
      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const postId = parseInt(req.params.id);
      await storage.deletePost(postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      
      // Get user to include subscription info
      const user = await storage.getUser(userId);
      const limit = SUBSCRIPTION_LIMITS[user?.subscriptionTier as keyof typeof SUBSCRIPTION_LIMITS] || SUBSCRIPTION_LIMITS.free;
      
      res.json({
        ...stats,
        monthlyLimit: limit,
        subscriptionTier: user?.subscriptionTier || 'free',
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Stripe subscription routes - handles both free tier setup and paid subscriptions
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { tier } = req.body;
      
      if (!['free', 'starter', 'pro', 'enterprise'].includes(tier)) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }

      const user = await storage.getUser(userId);
      if (!user || !user.email) {
        return res.status(400).json({ message: "User email required" });
      }

      let customerId = user.stripeCustomerId;

      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        });
        customerId = customer.id;
      }

      if (tier === 'free') {
        // For free tier, create a setup intent to collect payment method
        const setupIntent = await stripe.setupIntents.create({
          customer: customerId,
          usage: 'off_session',
        });

        // Update user subscription to free tier
        await storage.updateUserSubscription(userId, 'free', 'active');

        res.json({
          clientSecret: setupIntent.client_secret,
          tier: 'free',
          requiresPaymentMethod: true,
        });
        return;
      }

      // For paid tiers, create product and subscription
      const product = await stripe.products.create({
        name: `SocialBoost ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`,
      });

      // Create price
      const price = await stripe.prices.create({
        currency: 'usd',
        product: product.id,
        unit_amount: SUBSCRIPTION_PRICES[tier as keyof typeof SUBSCRIPTION_PRICES],
        recurring: {
          interval: 'month',
        },
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: price.id,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with Stripe info
      await storage.updateUserStripeInfo(userId, customerId, subscription.id);
      await storage.updateUserSubscription(userId, tier, 'active');

      const clientSecret = (subscription.latest_invoice as any)?.payment_intent?.client_secret;

      res.json({
        subscriptionId: subscription.id,
        clientSecret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription: " + error.message });
    }
  });

  app.post('/api/cancel-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }

      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      await storage.updateUserSubscription(userId, 'free', 'canceled');

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ message: "Failed to cancel subscription: " + error.message });
    }
  });

  // Mock Instagram API routes for posting
  app.post('/api/instagram/publish', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { postId } = req.body;
      
      const post = await storage.getPost(postId);
      if (!post || post.userId !== userId) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Mock Instagram publishing
      const mockInstagramPostId = 'ig_post_' + Date.now();
      
      await storage.updatePost(postId, {
        status: 'published',
        publishedAt: new Date(),
        instagramPostId: mockInstagramPostId,
        // Mock engagement data
        likes: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 20) + 1,
      });

      res.json({ success: true, instagramPostId: mockInstagramPostId });
    } catch (error) {
      console.error("Error publishing to Instagram:", error);
      res.status(500).json({ message: "Failed to publish post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
