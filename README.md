# Fake API

Fake RESTful API for development and testing. Node.js + Express, JWT auth, in-memory storage, RFC 7807 error responses, full filtering, sorting and pagination on todos.

## Getting started

```bash
npm install
npm run env:init   # optional: copy .env.example to .env
npm start          # or: npm run dev (reload on file changes)
```

Default URL: `http://localhost:3000`

### Docker

```bash
docker compose up --build
# or: npm run docker:up
```

API available at `http://localhost:3000`. Inside the container the server binds to `0.0.0.0`; `BASE_URL` defaults to `http://localhost:3000` for RFC 7807 links when accessed from the host.

Override compose variables via a project `.env` file (used for substitution) or the shell, e.g. `JWT_SECRET`, `PORT`, `BASE_URL`.

---

## Configuration

Copy `.env.example` to `.env` and adjust as needed.

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | `Fake API` | Application name |
| `APP_VERSION` | `1.0.0` (from package.json) | Version shown in API metadata |
| `HOST` | `localhost` | Host for binding and URL construction |
| `PORT` | `3000` | Server port |
| `BASE_URL` | `http://{HOST}:{PORT}` | Public base URL (used in RFC 7807 `type` fields) |
| `JWT_SECRET` | `fake-api-secret` | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | JWT expiration |
| `SEED_PASSWORD` | `password123` | Password for seed users |
| `PAGINATION_DEFAULT_PAGE` | `1` | Default page number |
| `PAGINATION_DEFAULT_LIMIT` | `10` | Default page size |
| `PAGINATION_MAX_LIMIT` | `100` | Maximum page size |

---

## Auth

Errors return `Content-Type: application/problem+json` following RFC 7807. The `type` field points to this API's status catalog (e.g. `http://localhost:3000/status/422`):

```json
{
  "type": "http://localhost:3000/status/422",
  "title": "Unprocessable Entity",
  "status": 422,
  "detail": "Validation failed",
  "instance": "/todos",
  "errors": [
    { "field": "title", "message": "Title is required" }
  ]
}
```

Success returns the resource directly — no wrapper.

---

## Endpoints

### `POST /auth/register`

```json
{ "name": "Alice", "email": "alice@example.com", "password": "secret123" }
```

Response `201`:
```json
{
  "token": "eyJ...",
  "user": { "id": "...", "name": "Alice", "email": "alice@example.com", "createdAt": "...", "updatedAt": "..." }
}
```

---

### `POST /auth/login`

```json
{ "email": "dev@example.com", "password": "password123" }
```

Response `200`: same shape as register.

---

### `GET /auth/me` (requires auth)

Response `200`: user object (no password).

---

### `GET /todos` (requires auth)

Response `200`:
```json
{
  "data": [ ...todos ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Query params

| Param | Type | Description |
|-------|------|-------------|
| `completed` | `true \| false` | Filter by completion status |
| `priority` | `low \| medium \| high` | Filter by priority |
| `category` | `personal \| work \| study \| health \| finance \| other` | Filter by category |
| `tags` | `string` | Comma-separated tag list (AND logic). e.g. `api,testing` |
| `search` | `string` | Case-insensitive match on title or description |
| `dueBefore` | ISO date | Due date ≤ this date |
| `dueAfter` | ISO date | Due date ≥ this date |
| `createdBefore` | ISO date | Created at ≤ this date |
| `createdAfter` | ISO date | Created at ≥ this date |
| `sort` | `string` | `field` (asc) or `-field` (desc). Fields: `title`, `createdAt`, `updatedAt`, `dueDate`, `priority` |
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page, max 100 (default: 10) |

Examples:
```
GET /todos?priority=high&completed=false&sort=-dueDate&page=1&limit=5
GET /todos?search=api&tags=api,testing&category=work
GET /todos?dueAfter=2025-06-01&dueBefore=2025-07-31&sort=priority
```

---

### `GET /todos/:id` (requires auth)

Response `200`: todo object.

---

### `POST /todos` (requires auth)

```json
{
  "title": "My task",
  "description": "Optional description",
  "priority": "high",
  "category": "work",
  "tags": ["api", "testing"],
  "dueDate": "2025-08-01T00:00:00.000Z"
}
```

Only `title` is required. Response `201`: created todo.

---

### `PUT /todos/:id` (requires auth)

All fields optional (PATCH semantics despite PUT — idiomatic for fake APIs):

```json
{
  "completed": true,
  "priority": "low",
  "tags": "reading,books"
}
```

Response `200`: updated todo.

---

### `DELETE /todos/:id` (requires auth)

Response `204`: no body.

---

### `GET /status`

Lists all documented HTTP status codes with links to their detail pages.

---

### `GET /status/:code`

Returns detailed information about an HTTP status code and an RFC 7807 example payload.

Example: `GET /status/422`

```json
{
  "code": 422,
  "title": "Unprocessable Entity",
  "description": "The request was well-formed but could not be processed due to semantic validation errors.",
  "class": "4xx Client Error",
  "rfc": "RFC 4918",
  "usedInApi": true,
  "typicalCauses": ["Missing required fields", "Invalid enum value", "Invalid date format"],
  "fieldsNote": "Responses may include an `errors` array with per-field messages.",
  "type": "http://localhost:3000/status/422",
  "problemDetails": {
    "contentType": "application/problem+json",
    "specification": "RFC 7807",
    "example": {
      "type": "http://localhost:3000/status/422",
      "title": "Unprocessable Entity",
      "status": 422,
      "detail": "Validation failed",
      "instance": "/status/422",
      "errors": [{ "field": "title", "message": "Title is required" }]
    }
  }
}
```

---

## Todo object

```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "My task",
  "description": "Details here",
  "completed": false,
  "priority": "high",
  "category": "work",
  "tags": ["api", "testing"],
  "dueDate": "2025-08-01T00:00:00.000Z",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

## Seed accounts

| Email | Password |
|-------|----------|
| `dev@example.com` | `password123` |
| `test@example.com` | `password123` |
