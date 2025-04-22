import { 
  User, InsertUser, users,
  Category, InsertCategory, categories,
  Product, InsertProduct, products,
  CartItem, InsertCartItem, cartItems
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsByCategorySlug(slug: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getTrendingProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart operations
  getCartItemsBySessionId(sessionId: string): Promise<CartItem[]>;
  getCartItemWithProduct(sessionId: string, productId: number): Promise<CartItem | undefined>;
  addItemToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private userCurrentId: number;
  private categoryCurrentId: number;
  private productCurrentId: number;
  private cartItemCurrentId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.productCurrentId = 1;
    this.cartItemCurrentId = 1;
    
    // Initialize with default categories and products for Diwali
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }
  
  async getProductsByCategorySlug(slug: string): Promise<Product[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) return [];
    return this.getProductsByCategory(category.id);
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isFeatured
    );
  }
  
  async getTrendingProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isTrending
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  // Cart operations
  async getCartItemsBySessionId(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
  }
  
  async getCartItemWithProduct(sessionId: string, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      (item) => item.sessionId === sessionId && item.productId === productId
    );
  }
  
  async addItemToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const existingItem = await this.getCartItemWithProduct(
      insertCartItem.sessionId,
      insertCartItem.productId
    );
    
    if (existingItem) {
      // Update quantity if already exists
      return this.updateCartItemQuantity(
        existingItem.id, 
        existingItem.quantity + insertCartItem.quantity
      ) as Promise<CartItem>;
    }
    
    // Add new item
    const id = this.cartItemCurrentId++;
    const cartItem: CartItem = { 
      ...insertCartItem, 
      id, 
      createdAt: new Date() 
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    // Delete if quantity is 0
    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }
    
    // Update quantity
    const updatedItem: CartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeCartItem(id: number): Promise<void> {
    this.cartItems.delete(id);
  }
  
  async clearCart(sessionId: string): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId)
      .map(item => item.id);
    
    itemsToRemove.forEach(id => this.cartItems.delete(id));
  }
  
  // Initialize data with sample categories and products
  private initializeData() {
    // Add categories
    const categoryData: InsertCategory[] = [
      {
        name: "Diyas & Candles",
        slug: "diyas-candles",
        description: "Traditional & Modern Designs",
        imageUrl: "https://images.unsplash.com/photo-1604422230737-a31c4523ea68?ixlib=rb-4.0.3",
      },
      {
        name: "Rangoli & Colors",
        slug: "rangoli-colors",
        description: "Beautiful Floor Decorations",
        imageUrl: "https://images.unsplash.com/photo-1598431429388-7a5dbb6c3c8a?ixlib=rb-4.0.3",
      },
      {
        name: "Home Decorations",
        slug: "home-decorations",
        description: "Lanterns, Lights & Hangings",
        imageUrl: "https://images.unsplash.com/photo-1605696005660-83852c140bde?ixlib=rb-4.0.3",
      },
      {
        name: "Gift Boxes",
        slug: "gift-boxes",
        description: "Premium Gift Collections",
        imageUrl: "https://images.unsplash.com/photo-1582584564635-0d92662810a5?ixlib=rb-4.0.3",
      }
    ];
    
    categoryData.forEach(category => {
      this.createCategory(category);
    });
    
    // Add products
    const productData: InsertProduct[] = [
      {
        name: "Handcrafted Clay Diyas (Set of 6)",
        slug: "handcrafted-clay-diyas",
        description: "Beautiful handcrafted clay diyas perfect for Diwali celebrations. Each diya is handmade by skilled artisans.",
        price: "349",
        compareAtPrice: "410",
        imageUrl: "https://images.unsplash.com/photo-1604422744102-3b0c4e44b873?ixlib=rb-4.0.3",
        categoryId: 1,
        isFeatured: true,
        isTrending: false,
        badge: "-15%",
        stock: 50,
        rating: "4.5",
        reviewCount: 42,
      },
      {
        name: "Decorative LED String Lights (10m)",
        slug: "decorative-led-string-lights",
        description: "Add a festive glow to your home with these beautiful LED string lights. Perfect for Diwali decorations.",
        price: "599",
        compareAtPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1610848812882-784b7eb968ba?ixlib=rb-4.0.3",
        categoryId: 3,
        isFeatured: true,
        isTrending: false,
        badge: null,
        stock: 100,
        rating: "5.0",
        reviewCount: 87,
      },
      {
        name: "Reusable Rangoli Stencil Kit",
        slug: "reusable-rangoli-stencil-kit",
        description: "Create beautiful rangoli designs easily with these reusable stencils. Perfect for beginners and experts alike.",
        price: "249",
        compareAtPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1564941727588-d31f95e117d1?ixlib=rb-4.0.3",
        categoryId: 2,
        isFeatured: true,
        isTrending: false,
        badge: "New",
        stock: 75,
        rating: "4.0",
        reviewCount: 23,
      },
      {
        name: "Premium Diwali Gift Hamper",
        slug: "premium-diwali-gift-hamper",
        description: "Luxury gift hamper containing assorted sweets, dry fruits, diyas, and decorative items. Perfect gift for family and friends.",
        price: "1499",
        compareAtPrice: "1799",
        imageUrl: "https://images.unsplash.com/photo-1601286794092-d7e3215ba03d?ixlib=rb-4.0.3",
        categoryId: 4,
        isFeatured: true,
        isTrending: false,
        badge: "Best Seller",
        stock: 30,
        rating: "4.5",
        reviewCount: 143,
      },
      {
        name: "Decorative Brass Puja Thali Set",
        slug: "decorative-brass-puja-thali-set",
        description: "Elegant brass puja thali set complete with all the necessary items for Diwali puja rituals.",
        price: "1299",
        compareAtPrice: "1499",
        imageUrl: "https://images.unsplash.com/photo-1605696612053-aa1b0e9d5167?ixlib=rb-4.0.3",
        categoryId: 3,
        isFeatured: false,
        isTrending: true,
        badge: null,
        stock: 25,
        rating: "4.5",
        reviewCount: 56,
      },
      {
        name: "Hanging Metal Lanterns (Set of 3)",
        slug: "hanging-metal-lanterns",
        description: "Beautiful metal lanterns that add an elegant touch to your Diwali decorations. Available in gold finish.",
        price: "899",
        compareAtPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1605696914456-e635610d3d20?ixlib=rb-4.0.3",
        categoryId: 3,
        isFeatured: false,
        isTrending: true,
        badge: null,
        stock: 40,
        rating: "4.0",
        reviewCount: 38,
      },
      {
        name: "Handmade Wall Decorations",
        slug: "handmade-wall-decorations",
        description: "Beautiful handcrafted wall hangings to add a festive touch to your home during Diwali celebrations.",
        price: "749",
        compareAtPrice: "999",
        imageUrl: "https://images.unsplash.com/photo-1611464613261-5e7fef52fcbb?ixlib=rb-4.0.3",
        categoryId: 3,
        isFeatured: false,
        isTrending: true,
        badge: null,
        stock: 35,
        rating: "5.0",
        reviewCount: 72,
      },
      {
        name: "Colorful Rangoli Powder Set",
        slug: "colorful-rangoli-powder-set",
        description: "Set of 10 vibrant colors to create beautiful rangoli designs for Diwali celebrations.",
        price: "399",
        compareAtPrice: "499",
        imageUrl: "https://images.unsplash.com/photo-1598431429388-7a5dbb6c3c8a?ixlib=rb-4.0.3",
        categoryId: 2,
        isFeatured: false,
        isTrending: false,
        badge: "-20%",
        stock: 85,
        rating: "4.5",
        reviewCount: 63,
      },
      {
        name: "Traditional Silver Pooja Bells",
        slug: "traditional-silver-pooja-bells",
        description: "Beautifully crafted silver pooja bells with intricate designs, perfect for your Diwali rituals.",
        price: "799",
        compareAtPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1604422230737-a31c4523ea68?ixlib=rb-4.0.3",
        categoryId: 1,
        isFeatured: false,
        isTrending: false,
        badge: null,
        stock: 20,
        rating: "4.0",
        reviewCount: 28,
      },
      {
        name: "Luxury Dry Fruits Gift Box",
        slug: "luxury-dry-fruits-gift-box",
        description: "Premium selection of dry fruits presented in an elegant gift box, perfect for Diwali gifting.",
        price: "1299",
        compareAtPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1582584564635-0d92662810a5?ixlib=rb-4.0.3",
        categoryId: 4,
        isFeatured: false,
        isTrending: false,
        badge: "Premium",
        stock: 15,
        rating: "4.5",
        reviewCount: 47,
      },
    ];
    
    productData.forEach(product => {
      this.createProduct(product);
    });
  }
}

export const storage = new MemStorage();
