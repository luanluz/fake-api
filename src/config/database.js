const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const config = require("./app.config");

const SEED_USER_ID = "seed-user-001";
const SEED_USER_2_ID = "seed-user-002";

const seedPassword = bcrypt.hashSync(config.seed.password, 10);

/** @type {Map<string, object>} */
const users = new Map([
  [
    SEED_USER_ID,
    {
      id: SEED_USER_ID,
      name: "Dev User",
      email: "dev@example.com",
      password: seedPassword,
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    },
  ],
  [
    SEED_USER_2_ID,
    {
      id: SEED_USER_2_ID,
      name: "Test User",
      email: "test@example.com",
      password: seedPassword,
      createdAt: "2025-01-02T00:00:00.000Z",
      updatedAt: "2025-01-02T00:00:00.000Z",
    },
  ],
]);

const PRIORITIES = ["low", "medium", "high"];
const CATEGORIES = ["personal", "work", "study", "health", "finance", "other"];

const todoSeeds = [
  {
    title: "Set up project architecture",
    description: "Define layers: data, domain, presentation. Choose state management.",
    completed: false,
    priority: "high",
    category: "work",
    tags: ["architecture", "setup"],
    dueDate: "2025-06-30T00:00:00.000Z",
    userId: SEED_USER_ID,
  },
  {
    title: "Integrate fake REST API",
    description: "Test JWT auth flow and full CRUD with pagination and filters.",
    completed: true,
    priority: "high",
    category: "work",
    tags: ["api", "http", "testing"],
    dueDate: "2025-05-15T00:00:00.000Z",
    userId: SEED_USER_ID,
  },
  {
    title: "Write unit tests for repositories",
    description: "Cover all data layer methods with mocks.",
    completed: false,
    priority: "medium",
    category: "work",
    tags: ["testing", "backend"],
    dueDate: "2025-07-10T00:00:00.000Z",
    userId: SEED_USER_ID,
  },
  {
    title: "Learn state management patterns",
    description: null,
    completed: false,
    priority: "medium",
    category: "study",
    tags: ["frontend", "patterns"],
    dueDate: null,
    userId: SEED_USER_ID,
  },
  {
    title: "Read Clean Architecture book",
    description: "Focus on chapters 15-20 about boundaries.",
    completed: true,
    priority: "low",
    category: "study",
    tags: ["architecture", "books"],
    dueDate: "2025-04-01T00:00:00.000Z",
    userId: SEED_USER_ID,
  },
  {
    title: "Morning workout routine",
    description: "30 min cardio + 20 min strength.",
    completed: false,
    priority: "medium",
    category: "health",
    tags: ["fitness"],
    dueDate: null,
    userId: SEED_USER_ID,
  },
  {
    title: "Review monthly budget",
    description: "Check subscriptions and cancel unused ones.",
    completed: false,
    priority: "high",
    category: "finance",
    tags: ["money", "planning"],
    dueDate: "2025-06-05T00:00:00.000Z",
    userId: SEED_USER_ID,
  },
  {
    title: "Buy groceries",
    description: "Milk, eggs, bread, fruits.",
    completed: true,
    priority: "low",
    category: "personal",
    tags: [],
    dueDate: null,
    userId: SEED_USER_ID,
  },
  {
    title: "Schedule dentist appointment",
    description: null,
    completed: false,
    priority: "medium",
    category: "health",
    tags: ["appointments"],
    dueDate: "2025-07-01T00:00:00.000Z",
    userId: SEED_USER_ID,
  },
  {
    title: "Deploy app to production",
    description: "Complete release checklist, monitoring, and rollback plan.",
    completed: false,
    priority: "high",
    category: "work",
    tags: ["deployment", "devops"],
    dueDate: "2025-08-01T00:00:00.000Z",
    userId: SEED_USER_ID,
  },
  {
    title: "Prepare presentation slides",
    description: "Tech talk on API design and Clean Architecture.",
    completed: false,
    priority: "medium",
    category: "work",
    tags: ["presentation"],
    dueDate: "2025-06-20T00:00:00.000Z",
    userId: SEED_USER_ID,
  },
  {
    title: "Call family",
    description: null,
    completed: false,
    priority: "low",
    category: "personal",
    tags: ["family"],
    dueDate: null,
    userId: SEED_USER_ID,
  },
];

/** @type {Map<string, object>} */
const todos = new Map();

todoSeeds.forEach((seed, i) => {
  const id = uuidv4();
  const date = new Date(2025, 0, i + 1).toISOString();
  todos.set(id, { id, ...seed, createdAt: date, updatedAt: date });
});

module.exports = { users, todos, PRIORITIES, CATEGORIES };
