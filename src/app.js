const express = require("express");
const cors = require("cors");
const config = require("./config/app.config");
const authRouter = require("./modules/auth/auth.router");
const todoRouter = require("./modules/todos/todo.router");
const statusRouter = require("./modules/status/status.router");
const errorHandler = require("./middleware/error-handler.middleware");
const { PRIORITIES, CATEGORIES } = require("./config/database");
const { statusTypeUrl } = require("./shared/utils/problem.util");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: config.name,
    version: config.version,
    baseUrl: config.baseUrl,
    seedUsers: [
      { email: "dev@example.com", password: config.seed.password },
      { email: "test@example.com", password: config.seed.password },
    ],
    enums: { priorities: PRIORITIES, categories: CATEGORIES },
    endpoints: {
      auth: {
        "POST /auth/register": "Register a new user",
        "POST /auth/login": "Login and receive a JWT",
        "GET /auth/me": "Get authenticated user profile [requires auth]",
      },
      todos: {
        "GET /todos": "List todos with filters, sort and pagination [requires auth]",
        "GET /todos/:id": "Get a single todo [requires auth]",
        "POST /todos": "Create a todo [requires auth]",
        "PUT /todos/:id": "Update a todo (partial) [requires auth]",
        "DELETE /todos/:id": "Delete a todo [requires auth]",
      },
      status: {
        "GET /status": "List documented HTTP status codes",
        "GET /status/:code": "HTTP status details and RFC 7807 example (e.g. /status/422)",
      },
    },
    queryParams: {
      filters: {
        completed: "boolean ('true' | 'false')",
        priority: `enum (${PRIORITIES.join(" | ")})`,
        category: `enum (${CATEGORIES.join(" | ")})`,
        tags: "comma-separated string (e.g. 'api,testing')",
        search: "string — matches title or description (case-insensitive)",
        dueBefore: "ISO 8601 date",
        dueAfter: "ISO 8601 date",
        createdBefore: "ISO 8601 date",
        createdAfter: "ISO 8601 date",
      },
      sort: "field or -field for descending. Options: title, createdAt, updatedAt, dueDate, priority",
      pagination: {
        page: "integer >= 1 (default: 1)",
        limit: "integer 1–100 (default: 10)",
      },
    },
  });
});

app.use("/auth", authRouter);
app.use("/todos", todoRouter);
app.use("/status", statusRouter);

app.use((req, res) => {
  res.status(404).set("Content-Type", "application/problem+json").json({
    type: statusTypeUrl(404),
    title: "Not Found",
    status: 404,
    detail: `Route '${req.method} ${req.path}' does not exist`,
    instance: req.path,
  });
});

app.use(errorHandler);

module.exports = app;
