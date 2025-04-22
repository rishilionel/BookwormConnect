import type { Express, Request, Response, Router } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { insertCartItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a router for API routes
  const apiRouter: Router = express.Router();
  
  // Get all categories
  apiRouter.get("/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Get category by slug
  apiRouter.get("/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });
  
  // Get all products
  apiRouter.get("/products", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  // Get products by category (specific route before generic routes)
  apiRouter.get("/products/category/:slug", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProductsByCategorySlug(req.params.slug);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });
  
  // Search products (specific route before generic routes)
  apiRouter.get("/products/search/:query", async (req: Request, res: Response) => {
    try {
      const products = await storage.searchProducts(req.params.query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });
  
  // Get product by slug (generic route after specific routes)
  apiRouter.get("/products/:slug", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  // Get featured products
  apiRouter.get("/featured-products", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });
  
  // Get trending products
  apiRouter.get("/trending-products", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getTrendingProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending products" });
    }
  });
  
  // Cart Routes
  
  // Get cart
  apiRouter.get("/cart/:sessionId", async (req: Request, res: Response) => {
    try {
      const cartItems = await storage.getCartItemsBySessionId(req.params.sessionId);
      
      // Get product details for each cart item
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return {
            ...item,
            product,
          };
        })
      );
      
      res.json(cartWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });
  
  // Add to cart
  apiRouter.post("/cart", async (req: Request, res: Response) => {
    try {
      const parsedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addItemToCart(parsedData);
      
      // Get product details
      const product = await storage.getProductById(cartItem.productId);
      
      res.status(201).json({
        ...cartItem,
        product,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });
  
  // Update cart item quantity
  apiRouter.patch("/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const quantity = req.body.quantity;
      
      if (isNaN(id) || !Number.isInteger(quantity)) {
        return res.status(400).json({ message: "Invalid ID or quantity" });
      }
      
      const updatedItem = await storage.updateCartItemQuantity(id, quantity);
      
      if (!updatedItem) {
        if (quantity <= 0) {
          return res.json({ message: "Item removed from cart" });
        }
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      // Get product details
      const product = await storage.getProductById(updatedItem.productId);
      
      res.json({
        ...updatedItem,
        product,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });
  
  // Clear cart (specific route before generic route)
  apiRouter.delete("/cart/session/:sessionId", async (req: Request, res: Response) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
  
  // Remove from cart (generic route after specific route)
  apiRouter.delete("/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      await storage.removeCartItem(id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  // Mount the router with prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
