import { Achievement } from "../types";
import { Article, ArticleStatus } from "../types/article";

export const badges: Achievement[] = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first contest",
    type: "first",
    rarity: "common",
    earned: false,
    earnedDate: "2024-01-10",
    progress: "",
  },
  {
    id: "2",
    name: "Speed Demon",
    description: "Answer 10 questions in under 30 seconds",
    type: "speed",
    rarity: "rare",
    earned: false,
    earnedDate: "",
    progress: "",
  },
  {
    id: "3",
    name: "Perfectionist",
    description: "Score 100% in any contest",
    type: "perfection",
    rarity: "epic",
    earned: false,
    earnedDate: "",
    progress: "",
  },
  {
    id: "4",
    name: "Streak Master",
    description: "Maintain a 7-day winning streak",
    type: "streak",
    rarity: "rare",
    earned: false,
    earnedDate: "2024-01-20",
    progress: "",
  },
  {
    id: "5",
    name: "Math Wizard",
    description: "Score 90%+ in 5 math contests",
    type: "subject",
    rarity: "epic",
    earned: false,
    earnedDate: "",
    progress: "",
  },
  {
    id: "6",
    name: "Champion",
    description: "Reach top 10 in global leaderboard",
    type: "rank",
    rarity: "legendary",
    earned: false,
    earnedDate: "",
    progress: "",
  },
];

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "The Future of Web Development: Trends to Watch in 2025",
    content: `
      <div class="prose max-w-none">
        <h2>Introduction</h2>
        <p>Web development continues to evolve at a rapid pace, with new technologies and methodologies emerging regularly. As we look towards 2025, several key trends are shaping the future of how we build and interact with web applications.</p>
        
        <h2>Key Trends</h2>
        <h3>1. AI-Powered Development Tools</h3>
        <p>Artificial intelligence is revolutionizing the development process, from code completion to automated testing. Tools like GitHub Copilot and ChatGPT are becoming integral parts of the developer workflow.</p>
        
        <h3>2. Edge Computing</h3>
        <p>With the rise of edge computing, applications are becoming faster and more responsive by processing data closer to the user. This trend is particularly important for global applications.</p>
        
        <h3>3. WebAssembly (WASM)</h3>
        <p>WebAssembly continues to gain traction, allowing developers to run high-performance applications in the browser using languages like Rust, C++, and Go.</p>
        
        <h2>Conclusion</h2>
        <p>The web development landscape is more exciting than ever. By staying informed about these trends and continuously learning, developers can build better, faster, and more secure applications.</p>
      </div>
    `,
    excerpt:
      "Explore the key trends shaping web development in 2025, from AI-powered tools to edge computing and WebAssembly.",
    author: {
      id: "author1",
      name: "Sarah Chen",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    status: "published" as ArticleStatus,
    publishedAt: new Date("2024-12-15T10:00:00Z"),
    createdAt: new Date("2024-12-10T09:00:00Z"),
    updatedAt: new Date("2024-12-15T10:00:00Z"),
    tags: ["web-development", "trends", "technology", "ai"],
    thumbnail: "",
    readTime: 8,
  },
  {
    id: "2",
    title: "Building Scalable React Applications: Best Practices",
    content: `
      <div class="prose max-w-none">
        <h2>Architecture Patterns</h2>
        <p>When building large-scale React applications, choosing the right architecture pattern is crucial for maintainability and scalability.</p>
        
        <h3>Component Organization</h3>
        <p>Organize your components in a logical hierarchy. Use container components for state management and presentational components for UI rendering.</p>
        
        <h3>State Management</h3>
        <p>Choose appropriate state management solutions based on your application's complexity. For simple apps, React's built-in state might suffice, but for complex applications, consider Redux, Zustand, or Jotai.</p>
        
        <h2>Performance Optimization</h2>
        <p>Performance is critical for user experience. Implement code splitting, lazy loading, and memoization where appropriate.</p>
        
        <h3>Code Splitting</h3>
        <p>Use React.lazy() and Suspense to split your code and load components only when needed.</p>
        
        <pre><code>const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    &lt;Suspense fallback={&lt;div&gt;Loading...&lt;/div&gt;}&gt;
      &lt;LazyComponent /&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>
      </div>
    `,
    excerpt:
      "Learn essential best practices for building scalable React applications, including architecture patterns and performance optimization.",
    author: {
      id: "author2",
      name: "Michael Rodriguez",
      avatar:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    status: "published" as ArticleStatus,
    publishedAt: new Date("2024-12-12T14:30:00Z"),
    createdAt: new Date("2024-12-08T11:00:00Z"),
    updatedAt: new Date("2024-12-12T14:30:00Z"),
    tags: ["react", "javascript", "scalability", "best-practices"],
    thumbnail:
      "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
    readTime: 12,
  },
  {
    id: "3",
    title: "Understanding TypeScript: A Complete Guide",
    content: `
      <h2>Architecture Patterns</h2>
  <p>When building large-scale React applications ...</p>

  <h3>Component Organization</h3>
  <p>Organize your components in a logical hierarchy ...</p>

  <h3>State Management</h3>
  <p>Choose appropriate state management solutions ...</p>

  <h2>Performance Optimization</h2>
  <p>Performance is critical ...</p>

  <h3>Code Splitting</h3>
  <p>Use React.lazy() and Suspense ...</p>

  <pre><code>
    const LazyComponent = React.lazy(() => import('./LazyComponent'));

    function App() {
      return (
        &lt;Suspense fallback={&lt;div&gt;Loading...&lt;/div&gt;}&gt;
          &lt;LazyComponent /&gt;
        &lt;/Suspense&gt;
      );
    }
  </code></pre>
    `,
    excerpt:
      "A comprehensive guide to TypeScript, covering basic types, interfaces, and advanced features for building type-safe applications.",
    author: {
      id: "author3",
      name: "Emily Watson",
      avatar:
        "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    status: "draft" as ArticleStatus,
    createdAt: new Date("2024-12-14T16:00:00Z"),
    updatedAt: new Date("2024-12-16T10:30:00Z"),
    tags: ["typescript", "javascript", "programming", "tutorial"],
    thumbnail:
      "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
    readTime: 15,
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox: When to Use Each",
    content: `
      <div class="prose max-w-none">
        <h2>Understanding the Difference</h2>
        <p>Both CSS Grid and Flexbox are powerful layout systems, but they serve different purposes and excel in different scenarios.</p>
        
        <h2>Flexbox: One-Dimensional Layouts</h2>
        <p>Flexbox is designed for one-dimensional layouts - either in a row or a column. It's perfect for:</p>
        <ul>
          <li>Navigation bars</li>
          <li>Button groups</li>
          <li>Centering content</li>
          <li>Equal height columns</li>
        </ul>
        
        <h2>CSS Grid: Two-Dimensional Layouts</h2>
        <p>CSS Grid excels at two-dimensional layouts where you need to control both rows and columns simultaneously:</p>
        <ul>
          <li>Complex page layouts</li>
          <li>Card grids</li>
          <li>Magazine-style layouts</li>
          <li>Responsive design patterns</li>
        </ul>
        
        <h2>When to Use Which?</h2>
        <h3>Use Flexbox when:</h3>
        <ul>
          <li>You're working with a single dimension</li>
          <li>Content determines the layout</li>
          <li>You need to distribute space among items</li>
        </ul>
        
        <h3>Use Grid when:</h3>
        <ul>
          <li>You're working with two dimensions</li>
          <li>Layout determines content placement</li>
          <li>You need precise control over positioning</li>
        </ul>
      </div>
    `,
    excerpt:
      "Learn the key differences between CSS Grid and Flexbox, and discover when to use each layout system for optimal results.",
    author: {
      id: "author1",
      name: "Sarah Chen",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    status: "published" as ArticleStatus,
    publishedAt: new Date("2024-12-10T12:00:00Z"),
    createdAt: new Date("2024-12-05T14:00:00Z"),
    updatedAt: new Date("2024-12-10T12:00:00Z"),
    tags: ["css", "layout", "web-design", "frontend"],
    thumbnail:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
    readTime: 6,
  },
  {
    id: "5",
    title: "Database Design Principles: From Concept to Implementation",
    content: `
      <div class="prose max-w-none">
        <h2>Introduction to Database Design</h2>
        <p>Good database design is the foundation of any successful application. It ensures data integrity, performance, and scalability.</p>
        
        <h2>Normalization</h2>
        <p>Database normalization is the process of organizing data to minimize redundancy and improve data integrity.</p>
        
        <h3>First Normal Form (1NF)</h3>
        <p>Each table cell should contain a single value, and each column should have a unique name.</p>
        
        <h3>Second Normal Form (2NF)</h3>
        <p>The table must be in 1NF and all non-key attributes must be fully functionally dependent on the primary key.</p>
        
        <h3>Third Normal Form (3NF)</h3>
        <p>The table must be in 2NF and all attributes must be directly dependent on the primary key.</p>
        
        <h2>Relationships</h2>
        <p>Understanding relationships between entities is crucial for effective database design:</p>
        <ul>
          <li><strong>One-to-One:</strong> Each record in table A relates to one record in table B</li>
          <li><strong>One-to-Many:</strong> Each record in table A can relate to multiple records in table B</li>
          <li><strong>Many-to-Many:</strong> Records in both tables can have multiple relationships</li>
        </ul>
        
        <h2>Best Practices</h2>
        <ul>
          <li>Use descriptive names for tables and columns</li>
          <li>Implement proper indexing strategies</li>
          <li>Consider performance implications</li>
          <li>Plan for scalability</li>
        </ul>
      </div>
    `,
    excerpt:
      "Master the fundamentals of database design, from normalization principles to relationship modeling and best practices.",
    author: {
      id: "author2",
      name: "Michael Rodriguez",
      avatar:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    status: "archived" as ArticleStatus,
    publishedAt: new Date("2024-11-20T09:00:00Z"),
    createdAt: new Date("2024-11-15T10:00:00Z"),
    updatedAt: new Date("2024-11-20T09:00:00Z"),
    tags: ["database", "sql", "design", "backend"],
    thumbnail:
      "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
    readTime: 10,
  },
];
