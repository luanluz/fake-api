const { todos } = require("../../config/database");

const TodoRepository = {
  findAllByUser(userId) {
    return [...todos.values()].filter((t) => t.userId === userId);
  },

  findByIdAndUser(id, userId) {
    const todo = todos.get(id);
    if (!todo || todo.userId !== userId) return null;
    return todo;
  },

  create(todo) {
    todos.set(todo.id, todo);
    return todo;
  },

  update(id, updates) {
    const existing = todos.get(id);
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    todos.set(id, updated);
    return updated;
  },

  delete(id) {
    todos.delete(id);
  },
};

module.exports = TodoRepository;
