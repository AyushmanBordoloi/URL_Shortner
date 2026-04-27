# URL Shortener API

A RESTful API service for creating and managing shortened URLs with analytics, custom codes, and expiry support.

---

## Base URL

```
/api
```

---

## Table of Contents

- [Endpoints](#endpoints)
  - [Create Short URL](#1-create-short-url)
  - [Redirect to Original URL](#2-redirect-to-original-url)
  - [Get URL Analytics](#3-get-url-analytics)
  - [List All URLs](#4-list-all-urls)
  - [Delete Short URL](#5-delete-short-url)
  - [Update Expiry](#6-update-expiry)
- [Error Reference](#error-reference)

---

## Endpoints

### 1. Create Short URL

**`POST /api/shorten`**

Creates a shortened URL from a long URL. Optionally accepts a custom short code and an expiry datetime.

#### Request Body

```json
{
  "url": "https://example.com/very/long/url",
  "custom_code": "optional_custom_code",
  "expires_at": "2025-12-31T23:59:59Z"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | ✅ Yes | The original long URL to shorten |
| `custom_code` | string | ❌ No | A custom short code; must be unique |
| `expires_at` | ISO 8601 datetime | ❌ No | Expiry date/time for the short URL |

#### Behavior

- If `custom_code` is not provided, a unique short code is auto-generated.
- If `custom_code` is provided, it must not already exist in the system.
- The URL is stored with the optional expiry timestamp.

#### Response — `201 Created`

```json
{
  "short_url": "http://yourdomain.com/abc123",
  "code": "abc123",
  "expires_at": "2025-12-31T23:59:59Z"
}
```

---

### 2. Redirect to Original URL

**`GET /:code`**

Resolves a short code and redirects the user to the original URL.

#### Behavior

- Looks up the URL by the provided `code`.
- If the code does not exist → `404 Not Found`
- If the URL has expired → `410 Gone`
- On a valid, active URL:
  - Increments the click counter
  - Updates the `last_accessed` timestamp
  - Redirects to the original URL (`301` or `302`)

---

### 3. Get URL Analytics

**`GET /api/urls/:code`**

Returns analytics and metadata for a specific short URL.

#### Response — `200 OK`

```json
{
  "original_url": "https://example.com/very/long/url",
  "short_code": "abc123",
  "clicks": 42,
  "last_accessed": "2025-06-15T10:30:00Z",
  "created_at": "2025-01-01T00:00:00Z",
  "expires_at": "2025-12-31T23:59:59Z"
}
```

#### Behavior

- Returns `404 Not Found` if the code does not exist.

---

### 4. List All URLs

**`GET /api/urls`**

Retrieves a paginated list of all shortened URLs in the system.

#### Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `10` | Number of results per page |

#### Response — `200 OK`

```json
{
  "data": [
    {
      "short_code": "abc123",
      "original_url": "https://example.com/very/long/url",
      "clicks": 10
    }
  ],
  "page": 1,
  "limit": 10
}
```

---

### 5. Delete Short URL

**`DELETE /api/urls/:code`**

Permanently removes a short URL from the system.

#### Behavior

- Deletes the URL entry associated with the given code.
- Returns `404 Not Found` if the code does not exist.

#### Response — `200 OK`

```json
{
  "message": "Deleted successfully"
}
```

---

### 6. Update Expiry

**`PATCH /api/urls/:code`**

Updates the expiry date of an existing short URL.

#### Request Body

```json
{
  "expires_at": "2026-06-01T00:00:00Z"
}
```

#### Behavior

- Updates the `expires_at` field for the given short code.
- Returns `404 Not Found` if the code does not exist.

#### Response — `200 OK`

```json
{
  "message": "Expiry updated successfully",
  "code": "abc123",
  "expires_at": "2026-06-01T00:00:00Z"
}
```

---

## Error Reference

| HTTP Status | Meaning | Trigger |
|---|---|---|
| `400 Bad Request` | Invalid URL format | Malformed or non-URL value in the `url` field |
| `404 Not Found` | Resource not found | Short code does not exist |
| `409 Conflict` | Duplicate custom code | Provided `custom_code` is already in use |
| `410 Gone` | URL has expired | Short code exists but is past its `expires_at` |

### Error Response Format

All errors follow a consistent response shape:

```json
{
  "error": "Short code already exists",
  "status": 409
}
```

---

## Tech Stack (Suggested)

> Swap these out based on your implementation choices.

- **Runtime**: Node.js / Python / Go
- **Framework**: Express / FastAPI / Gin
- **Database**: PostgreSQL / MongoDB / Redis
- **ID Generation**: nanoid / UUID / custom base62 encoder

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/url-shortener.git
cd url-shortener

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the server
npm run dev
```

### Environment Variables

```env
PORT=3000
BASE_URL=http://localhost:3000
DATABASE_URL=your_database_connection_string
```

---

## License

MIT
