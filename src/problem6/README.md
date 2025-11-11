# Live Scoreboard System - Technical Specification

## 1. Overview

This document outlines the requirements and implementation guidelines for a real-time scoreboard system that displays the top 10 users based on their scores. The system must support live updates, secure score incrementation, and prevent unauthorized score manipulation.

---

## 2. Functional Requirements

### 2.1 Core Features

| Feature                 | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| **Top 10 Scoreboard**   | Display top 10 users ranked by score in descending order     |
| **Real-time Updates**   | Scoreboard automatically reflects score changes without page refresh |
| **Score Increment API** | Secure endpoint to increment user scores upon action completion |
| **Authorization**       | Prevent unauthorized score manipulation                      |

### 2.2 User Flow

```
[User] → Completes Action → [Client] → API Call → [Server] → Update Score
                                                       ↓
                                            Broadcast Update (WebSocket/SSE)
                                                       ↓
                                            [All Connected Clients] → Update UI
```

---

## 3. API Specifications

### 3.1 Increment Score Endpoint

**Endpoint:** `POST /api/v1/scores/increment`

**Authentication:** Required (JWT Bearer Token)

**Request Body:**

```json
{
  "actionId": "string (UUID)",
  "actionType": "string (enum: 'TASK_COMPLETE', 'ACHIEVEMENT_UNLOCK', etc.)",
  "metadata": {
    "clientVersion": "string",
    "platform": "string (web/mobile)"
  }
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "userId": "string (UUID)",
    "previousScore": 1500,
    "newScore": 1600,
    "increment": 100,
    "rank": 7,
    "previousRank": 9,
    "timestamp": "2025-11-08T01:46:00Z"
  }
}
```

**Response (Error - 4xx/5xx):**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED_ACTION",
    "message": "Action verification failed",
    "details": {}
  }
}
```

**Error Codes:**

| Code                   | HTTP Status | Description                                      |
| ---------------------- | ----------- | ------------------------------------------------ |
| `UNAUTHORIZED`         | 401         | Invalid or missing JWT token                     |
| `ACTION_NOT_FOUND`     | 404         | ActionId does not exist or has already processed |
| `INVALID_SIGNATURE`    | 403         | Request signature validation failed              |
| `RATE_LIMIT_EXCEEDED`  | 429         | Too many requests from this user                 |
| `DUPLICATE_REQUEST`    | 409         | Request already processed (idempotency check)    |
| `INVALID_ACTION_STATE` | 400         | Action not in a completable state                |

---

### 3.2 Get Scoreboard Endpoint

**Endpoint:** `GET /api/v1/scores/leaderboard`

**Authentication:** Optional (for personalized view showing the current user's rank)

**Query Parameters:**

```
?limit=10 (default: 10, max: 100)
&offset=0 (for pagination)
&includeMe=true (include current user if authenticated)
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "uuid",
        "username": "player123",
        "displayName": "Player 123",
        "score": 9500,
        "avatar": "https://cdn.example.com/avatars/user1.jpg",
        "isCurrentUser": false
      }
    ],
    "currentUser": {
      "rank": 42,
      "score": 1250,
      "percentile": 75.5
    },
    "totalPlayers": 10000,
    "lastUpdated": "2025-11-08T01:46:00Z"
  }
}
```

---

## 4. Real-time Update Implementation

### 4.1 WebSocket Connection (Recommended)

**Endpoint:** `wss://api.example.com/ws/scoreboard`

**Connection Flow:**

1. Client establishes WebSocket connection with JWT in query param or header
2. Server validates token and subscribes client to scoreboard updates
3. Server broadcasts score changes to all connected clients
4. Client reconnects automatically on disconnect

**Message Format (Server → Client):**

```json
{
  "type": "SCORE_UPDATE",
  "timestamp": "2025-11-08T01:46:00Z",
  "data": {
    "affectedRanks": [7, 8, 9, 10],
    "updates": [
      {
        "rank": 7,
        "userId": "uuid",
        "username": "player456",
        "score": 1600,
        "previousRank": 9
      }
    ]
  }
}
```

**Alternative Message Types:**

- `LEADERBOARD_REFRESH`: Full leaderboard data (sent on reconnect)
- `RANK_CHANGE`: Notify user of their rank change
- `CONNECTION_ACK`: Connection successful acknowledgment

### 4.2 Server-Sent Events (SSE) Alternative

**Endpoint:** `GET /api/v1/scores/leaderboard/stream`

**Response:**

```
event: score-update
data: {"rank": 7, "userId": "uuid", "score": 1600}

event: keepalive
data: {"timestamp": "2025-11-08T01:46:00Z"}
```

---

## 5. Security & Authorization

### 5.1 Authentication & Authorization

**Implementation Requirements:**

1. **User Authentication:** Verify user identity before accepting score updates
2. **JWT Tokens:** Use short-lived tokens (15-30 minutes) with a refresh mechanism
3. **Session Validation:** Verify session hasn't been hijacked or expired

**Action Token Structure (JWT):**

```json
{
  "actionId": "uuid",
  "userId": "uuid",
  "actionType": "TASK_COMPLETE",
  "expectedScore": 100,
  "iat": 1699401600,
  "exp": 1699405200
}
```

### 5.2 Rate Limiting

Implement multi-layer rate limiting:

| Layer           | Limit       | Window   | Scope                    |
| --------------- | ----------- | -------- | ------------------------ |
| **User**        | 10 requests | 1 minute | Per user ID              |
| **IP**          | 50 requests | 1 minute | Per IP address           |
| **Action Type** | 5 requests  | 1 minute | Per user per action type |

Return `429 Too Many Requests` with `Retry-After` header when exceeded.

### 5.3 Input Validation

**Validate all inputs:**

- Action token format and signature
- Timestamp within acceptable range (±5 minutes from server time)
- User ID matches authenticated user
- Action type is valid and enabled
- Request body schema validation (use Zod, Joi, or similar)

### 5.4 Additional Security Measures

1. **Idempotency:** Track processed `actionId` to prevent duplicate processing
2. **HTTPS Only:** Enforce TLS/SSL for all communications
3. **Session Validation:** Verify user session is active and valid
4. **CORS Configuration:** Whitelist allowed origins
5. **XSS Prevention:** Sanitize user inputs (usernames, etc.)
6. **Audit Logging:** Log all score changes with IP, user agent, timestamp

---

## 6. Database Schema

### 6.1 Users Model

- **Fields:**
  - `id`: Unique identifier (UUID)
  - `username`: Unique string (max 50 characters), required
  - `display_name`: Optional string (max 100 characters)
  - `score`: Integer, defaults to 0
  - `rank`: Integer (used for ordering in leaderboard)
  - `avatar_url`: Optional string (URL)
  - `created_at`: Timestamp of account creation
  - `updated_at`: Timestamp of last update
- **Indexes:**
  - Order users by `score` for leaderboard display
  - Order users by `rank` for fast lookup

### 6.2 Actions Model

- **Fields:**
  - `id`: Unique identifier (UUID)
  - `user_id`: Reference to user (UUID)
  - `action_type`: String describing type; examples: `TASK_COMPLETE`, `ACHIEVEMENT_UNLOCK`
  - `status`: Enum - can be `INITIATED`, `COMPLETED`, or `CONSUMED`
  - `score_value`: Integer (amount of score for action)
  - `token_hash`: String (action token hash, to prevent replay)
  - `initiated_at`: Timestamp when created
  - `completed_at`, `consumed_at`, `expires_at`: Optional timestamps
  - `metadata`: Arbitrary JSON object
- **Indexes:**
  - Fast lookup of actions by `userId`
  - Fast querying by `status` and `expires_at` (for cleanup and verification)

### 6.3 Score History Model

- **Fields:**
  - `id`: Numeric, auto-incremented
  - `user_id`: Reference to user (UUID)
  - `action_id`: Reference to action (UUID)
  - `previous_score`, `new_score`, `increment`: Integers representing change
  - `previous_rank`, `new_rank`: Integers to show rank change
  - `ip_address`: String (for audit)
  - `user_agent`: String (for audit)
  - `request_id`: String, unique per request
  - `created_at`: Timestamp
- **Indexes:**
  - Lookup by `user_id` for audit/history
  - Ordering by creation date for recent changes

### 6.4 Processed Requests Model

- **Fields:**
  - `request_id`: String, unique per request
  - `user_id`: User reference (UUID)
  - `processed_at`: Timestamp of request processing
  - `expires_at`: Timestamp until when it is considered for idempotency
- **Indexes:**
  - Cleanup and lookup by `expiresAt` for deduplication

## 7. Performance Considerations

### 7.1 Caching Strategy

**Redis Cache Structure:**

1. **Leaderboard Cache**
   - Store the top 100 users in Redis Sorted Set
   - TTL: No expiration (updated on every score change)
   - Backup: Sync to PostgreSQL every 5 minutes

2. **User Rank Cache**
   - Cache individual user rankings
   - TTL: 30 seconds
   - Key pattern: `rank:{user_id}`

3. **Token Validation Cache**
   - Cache used tokens to prevent replay attacks
   - TTL: 5 minutes (token expiration time)
   - Key pattern: `used_token:{token_hash}`

**Cache Invalidation:**

- Invalidate on score update
- Use pub/sub for multi-server cache invalidation

### 7.2 Database Optimization

1. **Refresh Strategy:**
   - Refresh every 30 seconds via cron job
   - Or refresh on demand after score updates affecting the top 100

2. **Rank Calculation:**
   - Use window functions for efficient rank calculation
   - Only recalculate ranks for affected users

### 7.3 WebSocket Scaling

1. **Use Redis Pub/Sub** for broadcasting across multiple server instances
2. **Sticky Sessions** for WebSocket connections (if using multiple servers)
3. **Connection Pooling** - Limit max connections per server
4. **Graceful Degradation** - Fall back to polling if WebSocket is unavailable

---

## 8. Logging

Log all score increment attempts with:

- User ID
- Action ID
- IP address
- User agent
- Request ID
- Timestamp
- Success/failure status
- Error code (if failed)

---

## 9. Testing Requirements

### 9.1 Unit Tests

- Action token generation and validation
- Request signature validation
- Rate limiting logic
- Rank calculation algorithms

### 9.2 Integration Tests

- End-to-end score increment flow
- WebSocket connection and broadcasting
- Cache invalidation
- Idempotency enforcement

### 9.3 Security Tests

- Attempt to increment score without a valid token
- Replay attack simulation
- Rate limit bypass attempts
- SQL injection testing
- JWT token manipulation

### 9.4 Load Tests

- 10,000 concurrent WebSocket connections
- 1,000 score increment requests/second
- Leaderboard retrieval under load
- Cache performance under load

---

## 10. Improvement Suggestions & Comments

### Performance Improvements

1. **Incremental Rank Updates**
   - **Current Gap:** Full rank recalculation can be expensive
   - **Recommendation:** Only update ranks for users within ±100 positions of the score change

2. **CDN for Static Leaderboard**
   - **Suggestion:** Cache the top 10 leaderboard as static JSON on CDN
   - **Refresh:** Every 5-10 seconds
   - **Benefit:** Reduce database load by 95%+

3. **Sharding Strategy**
   - **For Scale:** Shard users by score ranges (e.g., 0-1000, 1001-5000, etc.)
   - **Benefit:** Parallel processing for rank calculations
   - **Trade-off:** More complex cross-shard queries

### Feature Enhancements

4. **Historical Leaderboards**
   - **Suggestion:** Support daily/weekly/monthly/all-time leaderboards
   - **Implementation:** Separate tables or partitions
   - **User Engagement:** Allows users to see progress over time

5. **Team/Group Leaderboards**
   - **Suggestion:** Support team-based scoring
   - **Use Case:** Guild systems, corporate competitions
   - **Schema:** Additional `teams` table with aggregate scores

6. **Personalized Leaderboard View**
   - **Suggestion:** Show user's position + 5 above + 5 below
   - **Benefit:** More relevant for users not in the top 10
   - **Implementation:** Window function with OFFSET based on the user's rank

7. **Admin API for Moderation**
   - **Management:** Tools for handling abuse
   - **Endpoints:**
      - `POST /admin/users/:user_id/reset-score` - Reset score to 0
      - `POST /admin/users/:user_id/ban` - Ban user from leaderboard
      - `GET /admin/audit-log` - Review all score changes
      - `POST /admin/scores/:score_id/revert` - Undo fraudulent score update

### Internationalization

8. **Multi-region Support**
    - **Current Gap:** No mention of geo-distributed architecture
    - **Recommendation:**
      - Regional leaderboards
      - Cross-region replication with eventual consistency
      - CDN for static leaderboard data

9. **Localization**
    - **Suggestion:** Support localized display names
    - **Implementation:** Store `locale` in the user table
    - **API:** Accept `Accept-Language` header
