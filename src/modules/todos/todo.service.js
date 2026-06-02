const { v4: uuidv4 } = require("uuid");
const TodoRepository = require("./todo.repository");
const { PRIORITIES, CATEGORIES } = require("../../config/database");
const { NotFoundError, BadRequestError, UnprocessableEntityError } = require("../../shared/errors/http-errors");
const { parsePagination, buildPaginatedResponse } = require("../../shared/utils/pagination.util");
const { parseSort, sortItems } = require("../../shared/utils/sort.util");

const SORTABLE_FIELDS = ["title", "createdAt", "updatedAt", "dueDate", "priority"];

const PRIORITY_WEIGHT = { low: 1, medium: 2, high: 3 };

const TodoService = {
  list(userId, query) {
    let items = TodoRepository.findAllByUser(userId);

    if (query.completed !== undefined) {
      const flag = _parseBool(query.completed, "completed");
      items = items.filter((t) => t.completed === flag);
    }

    if (query.priority) {
      _assertAllowed(query.priority, PRIORITIES, "priority");
      items = items.filter((t) => t.priority === query.priority);
    }

    if (query.category) {
      _assertAllowed(query.category, CATEGORIES, "category");
      items = items.filter((t) => t.category === query.category);
    }

    if (query.tags) {
      const filterTags = query.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
      if (filterTags.length > 0) {
        items = items.filter((t) =>
          filterTags.every((tag) => t.tags.map((x) => x.toLowerCase()).includes(tag))
        );
      }
    }

    if (query.search) {
      const q = query.search.toLowerCase();
      items = items.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    if (query.dueBefore) {
      const date = _parseDate(query.dueBefore, "dueBefore");
      items = items.filter((t) => t.dueDate && new Date(t.dueDate) <= date);
    }

    if (query.dueAfter) {
      const date = _parseDate(query.dueAfter, "dueAfter");
      items = items.filter((t) => t.dueDate && new Date(t.dueDate) >= date);
    }

    if (query.createdBefore) {
      const date = _parseDate(query.createdBefore, "createdBefore");
      items = items.filter((t) => new Date(t.createdAt) <= date);
    }

    if (query.createdAfter) {
      const date = _parseDate(query.createdAfter, "createdAfter");
      items = items.filter((t) => new Date(t.createdAt) >= date);
    }

    const { field, order } = parseSort(query.sort, SORTABLE_FIELDS, "createdAt");

    if (field === "priority") {
      items = items.sort((a, b) => {
        const diff = (PRIORITY_WEIGHT[a.priority] || 0) - (PRIORITY_WEIGHT[b.priority] || 0);
        return order === "asc" ? diff : -diff;
      });
    } else {
      items = sortItems(items, field, order);
    }

    const { page, limit, offset } = parsePagination(query);
    return buildPaginatedResponse(items, page, limit, offset);
  },

  getById(id, userId) {
    const todo = TodoRepository.findByIdAndUser(id, userId);
    if (!todo) throw new NotFoundError(`Todo with id '${id}' not found`, `/todos/${id}`);
    return todo;
  },

  create(userId, dto) {
    const errors = _validateTodoDto(dto, true);
    if (errors.length > 0) throw new UnprocessableEntityError("Validation failed", errors, "/todos");

    const now = new Date().toISOString();
    const todo = {
      id: uuidv4(),
      userId,
      title: dto.title.trim(),
      description: dto.description?.trim() ?? null,
      completed: false,
      priority: dto.priority || "medium",
      category: dto.category || "other",
      tags: _parseTags(dto.tags),
      dueDate: dto.dueDate ?? null,
      createdAt: now,
      updatedAt: now,
    };

    return TodoRepository.create(todo);
  },

  update(id, userId, dto) {
    const existing = TodoRepository.findByIdAndUser(id, userId);
    if (!existing) throw new NotFoundError(`Todo with id '${id}' not found`, `/todos/${id}`);

    const errors = _validateTodoDto(dto, false);
    if (errors.length > 0) throw new UnprocessableEntityError("Validation failed", errors, `/todos/${id}`);

    const updates = {};
    if (dto.title !== undefined) updates.title = dto.title.trim();
    if (dto.description !== undefined) updates.description = dto.description?.trim() ?? null;
    if (dto.completed !== undefined) updates.completed = Boolean(dto.completed);
    if (dto.priority !== undefined) updates.priority = dto.priority;
    if (dto.category !== undefined) updates.category = dto.category;
    if (dto.tags !== undefined) updates.tags = _parseTags(dto.tags);
    if (dto.dueDate !== undefined) updates.dueDate = dto.dueDate;

    return TodoRepository.update(id, updates);
  },

  delete(id, userId) {
    const existing = TodoRepository.findByIdAndUser(id, userId);
    if (!existing) throw new NotFoundError(`Todo with id '${id}' not found`, `/todos/${id}`);
    TodoRepository.delete(id);
  },
};

function _parseBool(value, field) {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new BadRequestError(`Query param '${field}' must be 'true' or 'false'`);
}

function _parseDate(value, field) {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new BadRequestError(`Query param '${field}' must be a valid ISO 8601 date`);
  }
  return date;
}

function _assertAllowed(value, allowed, field) {
  if (!allowed.includes(value)) {
    throw new BadRequestError(
      `Invalid value '${value}' for '${field}'. Allowed: ${allowed.join(", ")}`
    );
  }
}

function _parseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  return [];
}

function _validateTodoDto(dto, isCreate) {
  const errors = [];

  if (isCreate && !dto.title?.trim()) {
    errors.push({ field: "title", message: "Title is required" });
  }

  if (dto.title !== undefined && !dto.title?.trim()) {
    errors.push({ field: "title", message: "Title cannot be empty" });
  }

  if (dto.priority !== undefined && !PRIORITIES.includes(dto.priority)) {
    errors.push({ field: "priority", message: `Priority must be one of: ${PRIORITIES.join(", ")}` });
  }

  if (dto.category !== undefined && !CATEGORIES.includes(dto.category)) {
    errors.push({ field: "category", message: `Category must be one of: ${CATEGORIES.join(", ")}` });
  }

  if (dto.dueDate !== undefined && dto.dueDate !== null) {
    const date = new Date(dto.dueDate);
    if (isNaN(date.getTime())) {
      errors.push({ field: "dueDate", message: "dueDate must be a valid ISO 8601 date or null" });
    }
  }

  return errors;
}

module.exports = TodoService;
