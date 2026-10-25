import type { Blueprint, DesignDecision, Reference } from "./system-design";

export type CaseStudyDifficulty = "Warm-up" | "Intermediate" | "Advanced";

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  difficulty: CaseStudyDifficulty;
  minutes: number;
  summary: string;
  prompt: string;
  requirements: string[];
  constraints: string[];
  estimates: { label: string; value: string; note: string }[];
  blueprint: Blueprint;
  api: { method: string; path: string; purpose: string }[];
  dataModel: { name: string; fields: string }[];
  sections: {
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  decisions: DesignDecision[];
  failureModes: { failure: string; impact: string; mitigation: string }[];
  checklist: string[];
  relatedModules: string[];
  refs: Reference[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "url-shortener",
    title: "Design a URL shortener",
    subtitle: "A small read-heavy system with a surprisingly sharp key-design problem.",
    difficulty: "Warm-up",
    minutes: 25,
    summary:
      "Design a service that turns long links into short codes, redirects fast, and still works when the write path and read path are separated.",
    prompt:
      "Design a URL shortener for a product with 50 million redirects per day. Users can create a short link, choose an optional custom alias, see click counts, and deactivate a link.",
    requirements: [
      "Create a short link from a long URL, with an optional custom alias.",
      "Redirect a short code to its destination with low latency.",
      "Track click counts without slowing the redirect path.",
      "Allow the owner to deactivate a link immediately.",
    ],
    constraints: [
      "Reads outnumber writes by roughly 1,000:1.",
      "Redirects should resolve in under 100 ms at p95.",
      "A short code should be unguessable when the user wants privacy.",
      "Analytics may be a few minutes stale.",
    ],
    estimates: [
      {
        label: "Redirect QPS",
        value: "~580 / s",
        note: "50M per day, with a 2x peak allowance.",
      },
      {
        label: "New links",
        value: "~12 / s",
        note: "1M new links per day is a generous planning number.",
      },
      {
        label: "Code space",
        value: "62^7 ≈ 3.5T",
        note: "Base62 with seven characters is ample for this scale.",
      },
    ],
    blueprint: {
      caption: "Keep the redirect path tiny; move analytics and link management off the hot path.",
      layers: [
        {
          label: "Client",
          nodes: [{ label: "Browser", note: "short link", tone: "client" }],
        },
        {
          label: "Edge",
          nodes: [
            { label: "CDN + cache", note: "popular codes", tone: "edge" },
            { label: "API gateway", note: "auth + limits", tone: "edge" },
          ],
        },
        {
          label: "Services",
          nodes: [
            { label: "Redirect service", note: "read only", tone: "service" },
            { label: "Link service", note: "create / revoke", tone: "service" },
            { label: "Analytics writer", note: "async", tone: "async" },
          ],
        },
        {
          label: "Data",
          nodes: [
            { label: "Key-value store", note: "code → URL", tone: "data" },
            { label: "Click stream", note: "append only", tone: "async" },
          ],
        },
      ],
    },
    api: [
      { method: "POST", path: "/links", purpose: "Create a short link and return its code." },
      { method: "GET", path: "/:code", purpose: "Resolve the code and return a 302 redirect." },
      { method: "GET", path: "/links/:code", purpose: "Read metadata and click totals for the owner." },
      { method: "DELETE", path: "/links/:code", purpose: "Deactivate a link immediately." },
    ],
    dataModel: [
      {
        name: "links",
        fields: "code (PK), long_url, owner_id, custom_alias, created_at, revoked_at",
      },
      {
        name: "clicks",
        fields: "code, occurred_at, country, referrer, user_agent (partitioned by day)",
      },
      {
        name: "idempotency",
        fields: "owner_id + request_key, response_json, expires_at",
      },
    ],
    sections: [
      {
        title: "Generate the code, not the row",
        paragraphs: [
          "The central choice is how a short code is produced. A random Base62 code gives you an even distribution and makes enumeration hard. A sequential ID encoded in Base62 is easier to generate but leaks volume and is guessable.",
          "For this product, random seven-character codes with a uniqueness check are a good default. Collisions are rare at this scale, and a retry loop handles them without coordination.",
        ],
        bullets: [
          "Random code: harder to enumerate, no central sequence, requires a collision check.",
          "Sequential code: simple, but leaks creation order and needs an extra layer for privacy.",
          "Custom alias: a separate unique index; reserve it before the generic code path.",
        ],
      },
      {
        title: "Make the redirect boring",
        paragraphs: [
          "The redirect path should do one thing: look up a code and return a 302. Put a cache in front of the key-value store, keep the service stateless, and send click events to a durable stream instead of writing synchronously.",
          "Deactivation needs to win over cached data. A short TTL plus a revocation event that deletes the cache entry keeps the window bounded. If immediate revocation is a hard promise, check a small revocation set on every redirect.",
        ],
      },
      {
        title: "Analytics is a different product",
        paragraphs: [
          "Click counts are append-only events. Ingest them into a stream, aggregate in windows, and serve the owner a slightly stale total. Never put a counter update in the redirect transaction: a slow analytics store should not make links slow.",
          "Bot filtering and deduplication belong in the analytics pipeline, not in the redirect. The redirect should remain fast even when the analytics pipeline is down.",
        ],
      },
    ],
    decisions: [
      {
        choice: "Cache-aside the code mapping",
        when: "Reads dominate and a few minutes of stale metadata is acceptable.",
        cost: "Deactivation needs an invalidation path.",
      },
      {
        choice: "Async click events",
        when: "Analytics can lag without breaking the core experience.",
        cost: "You need a durable queue and an aggregation job.",
      },
      {
        choice: "Random Base62 codes",
        when: "Privacy and unpredictability matter more than compact IDs.",
        cost: "A collision check and retry path.",
      },
    ],
    failureModes: [
      {
        failure: "The cache is cold after a deploy",
        impact: "A burst of database reads raises redirect latency.",
        mitigation: "Warm popular codes and add request coalescing per key.",
      },
      {
        failure: "Analytics stream is unavailable",
        impact: "Click totals fall behind.",
        mitigation: "Buffer locally, retry with backoff, and show freshness in the UI.",
      },
      {
        failure: "A custom alias collides",
        impact: "The create request could overwrite an existing link.",
        mitigation: "Use a unique constraint on alias and return 409.",
      },
    ],
    checklist: [
      "Requirements and read/write ratio are written down.",
      "Short-code generation strategy is chosen and justified.",
      "Redirect path has a cache and a revocation plan.",
      "Analytics is asynchronous and its staleness is visible.",
      "API returns 302, not 200, for redirects.",
      "Failure modes have a user-visible consequence and a mitigation.",
    ],
    relatedModules: ["design-foundations", "apis-and-idempotency", "databases-and-indexes"],
    refs: [
      {
        label: "RFC 9110 — redirection",
        href: "https://www.rfc-editor.org/rfc/rfc9110.html",
      },
      {
        label: "Redis — caching patterns",
        href: "https://redis.io/docs/latest/develop/clients/patterns/",
      },
    ],
  },
  {
    slug: "chat-realtime",
    title: "Design real-time chat",
    subtitle: "WebSockets, fan-out, presence and the delivery guarantees behind a simple message bubble.",
    difficulty: "Intermediate",
    minutes: 40,
    summary:
      "Design one-to-one and group chat with message history, presence, delivery states and offline catch-up across multiple devices.",
    prompt:
      "Design a chat product for 5 million daily users. It supports direct messages, groups up to 500 people, read receipts, presence, and offline delivery. Messages must not be lost.",
    requirements: [
      "Send and receive messages in real time for direct and group conversations.",
      "Persist message history and support pagination.",
      "Show delivery and read state per participant.",
      "Deliver messages to a user's other devices.",
      "Catch up on messages after an offline period.",
    ],
    constraints: [
      "Message send should feel instant; 300 ms server acknowledgement is a reasonable target.",
      "Message history must be durable and ordered within a conversation.",
      "Presence can be eventually consistent and can expire.",
      "A user may have up to five active devices.",
    ],
    estimates: [
      {
        label: "Active sockets",
        value: "~1M concurrent",
        note: "20% of daily users online at peak.",
      },
      {
        label: "Messages",
        value: "~700 / s",
        note: "50M messages per day, 2x peak.",
      },
      {
        label: "History",
        value: "~20 KB / user / day",
        note: "A planning estimate, not a retention policy.",
      },
    ],
    blueprint: {
      caption: "A persistent socket carries presence; a durable stream and store carry messages.",
      layers: [
        {
          label: "Clients",
          nodes: [
            { label: "Mobile", note: "socket + push", tone: "client" },
            { label: "Web", note: "socket", tone: "client" },
          ],
        },
        {
          label: "Realtime edge",
          nodes: [
            { label: "WebSocket gateway", note: "sticky connection", tone: "edge" },
            { label: "Presence service", note: "TTL heartbeats", tone: "edge" },
          ],
        },
        {
          label: "Messaging",
          nodes: [
            { label: "Message service", note: "validate + persist", tone: "service" },
            { label: "Fan-out stream", note: "per user", tone: "async" },
            { label: "Push service", note: "offline", tone: "external" },
          ],
        },
        {
          label: "Data",
          nodes: [
            { label: "Message store", note: "conversation partition", tone: "data" },
            { label: "Conversation index", tone: "data" },
          ],
        },
      ],
    },
    api: [
      { method: "POST", path: "/conversations/:id/messages", purpose: "Persist a message and enqueue fan-out." },
      { method: "GET", path: "/conversations/:id/messages?before=", purpose: "Page backwards through history." },
      { method: "POST", path: "/messages/:id/read", purpose: "Record a read receipt for the current user." },
      { method: "WS", path: "/realtime", purpose: "Receive new messages, typing and presence events." },
    ],
    dataModel: [
      {
        name: "messages",
        fields: "conversation_id (partition), message_id (sort), sender_id, body, created_at, client_nonce",
      },
      {
        name: "conversation_members",
        fields: "conversation_id, user_id, joined_at, last_read_message_id",
      },
      {
        name: "presence",
        fields: "user_id, device_id, last_seen_at, ttl",
      },
    ],
    sections: [
      {
        title: "Accept, persist, then fan out",
        paragraphs: [
          "A message send is a write, not a broadcast. Validate the sender's membership, assign a server-side message id, persist the message, then enqueue fan-out. The sender receives an acknowledgement with that id; the recipients receive the message through their sockets or a push notification.",
          "The client-generated nonce is important. A mobile client may retry after a timeout; the server uses the nonce to make the write idempotent and returns the existing message instead of creating a duplicate.",
        ],
      },
      {
        title: "Ordering is per conversation",
        paragraphs: [
          "Global ordering is unnecessary and expensive. Partition the message store by conversation id, use a sortable message id or sequence, and page backwards with a cursor. For groups, fan-out writes can be asynchronous, but the canonical message remains in the conversation partition.",
          "Presence is a different consistency class. A heartbeat with a TTL is enough. Do not block a message send on presence, and do not show 'online' as a permanent fact.",
        ],
        bullets: [
          "Direct message: one conversation partition.",
          "Group: one canonical message plus fan-out to members.",
          "Offline: push notification plus a catch-up cursor on reconnect.",
        ],
      },
      {
        title: "Offline catch-up and multiple devices",
        paragraphs: [
          "Each device tracks the last message id it has seen. On reconnect it asks for messages after that cursor, not for the whole conversation. A per-device cursor also makes read receipts honest: reading on a phone should not mark messages read on a laptop unless the product says so.",
          "Sockets are expensive and mobile networks are unreliable. Keep connections at the edge, use heartbeats, and fall back to long polling or push when a socket cannot be established.",
        ],
      },
    ],
    decisions: [
      {
        choice: "WebSocket gateway",
        when: "You need low-latency bidirectional events and presence.",
        cost: "Stateful connections, sticky routing and connection draining.",
      },
      {
        choice: "At-least-once fan-out",
        when: "Duplicate suppression is cheaper than losing a message.",
        cost: "Consumers need idempotency and clients need deduplication by message id.",
      },
      {
        choice: "Per-conversation ordering",
        when: "Global order has no product meaning.",
        cost: "Cross-conversation ordering is not defined; that is usually fine.",
      },
    ],
    failureModes: [
      {
        failure: "A socket gateway dies",
        impact: "All connected users on that node reconnect at once.",
        mitigation: "Add jitter to reconnect backoff and keep gateway capacity headroom.",
      },
      {
        failure: "Fan-out lags",
        impact: "Messages are stored but not delivered in real time.",
        mitigation: "Surface unread state, use push fallback, and monitor consumer lag.",
      },
      {
        failure: "Duplicate send after timeout",
        impact: "The same message appears twice.",
        mitigation: "Unique client nonce per conversation and idempotent writes.",
      },
    ],
    checklist: [
      "Message send is idempotent and acknowledged with a stable id.",
      "History is ordered within a conversation and cursor-paginated.",
      "Presence has an expiry and is not treated as durable truth.",
      "Offline catch-up uses a per-device cursor.",
      "Read receipts are scoped to the right device or user.",
      "Reconnect storms and fan-out lag have mitigations.",
    ],
    relatedModules: ["queues-and-streams", "consistency-and-cap", "resilience-and-failure"],
    refs: [
      {
        label: "RFC 6455 — WebSocket protocol",
        href: "https://www.rfc-editor.org/rfc/rfc6455.html",
      },
      {
        label: "Firebase — realtime database concepts",
        href: "https://firebase.google.com/docs/database",
      },
    ],
  },
  {
    slug: "news-feed",
    title: "Design a social news feed",
    subtitle: "The fan-out trade-off: precompute every feed, or assemble it at read time?",
    difficulty: "Advanced",
    minutes: 45,
    summary:
      "Design a feed for 100 million users with follows, ranking, pagination, celebrity accounts and a read path that stays fast under spikes.",
    prompt:
      "Design a social feed where users follow other users. The feed shows recent posts ranked by relevance. Some accounts have 50 million followers. Users refresh often and expect new posts to appear quickly.",
    requirements: [
      "Publish text and image posts.",
      "Follow and unfollow accounts.",
      "Show a ranked home feed with cursor pagination.",
      "Support celebrity accounts with tens of millions of followers.",
      "Keep the feed usable when the ranking service is slow.",
    ],
    constraints: [
      "Feed reads outnumber posts by more than 100:1.",
      "A feed request should return in under 300 ms at p95.",
      "Ranking can tolerate a short staleness window; a new post should appear within seconds.",
      "Users should not see the same post twice in one session.",
    ],
    estimates: [
      {
        label: "Daily readers",
        value: "100M",
        note: "Assume 30% active at peak, 10 refreshes each.",
      },
      {
        label: "Posts",
        value: "~2,300 / s",
        note: "200M posts per day, 2x peak.",
      },
      {
        label: "Feed reads",
        value: "~350k / s",
        note: "The read path dominates by orders of magnitude.",
      },
    ],
    blueprint: {
      caption: "Hybrid fan-out: precompute normal feeds, merge celebrity posts at read time.",
      layers: [
        {
          label: "Reader",
          nodes: [{ label: "Feed client", note: "cursor + session", tone: "client" }],
        },
        {
          label: "Read path",
          nodes: [
            { label: "Feed API", note: "merge + rank", tone: "service" },
            { label: "Feed cache", note: "precomputed ids", tone: "async" },
          ],
        },
        {
          label: "Fan-out",
          nodes: [
            { label: "Post service", note: "persist + event", tone: "service" },
            { label: "Fan-out workers", note: "followers", tone: "async" },
            { label: "Celebrity path", note: "merge later", tone: "async" },
          ],
        },
        {
          label: "Data",
          nodes: [
            { label: "Post store", tone: "data" },
            { label: "Social graph", tone: "data" },
            { label: "Ranking features", tone: "data" },
          ],
        },
      ],
    },
    api: [
      { method: "POST", path: "/posts", purpose: "Create a post and emit a fan-out event." },
      { method: "GET", path: "/feed?cursor=", purpose: "Return a ranked page of feed items." },
      { method: "POST", path: "/follows/:userId", purpose: "Follow an account and update the graph." },
      { method: "DELETE", path: "/follows/:userId", purpose: "Unfollow and stop future fan-out." },
    ],
    dataModel: [
      {
        name: "posts",
        fields: "post_id, author_id, body, media_ids, created_at",
      },
      {
        name: "feed_entries",
        fields: "user_id (partition), post_id (sort), score, inserted_at",
      },
      {
        name: "social_graph",
        fields: "follower_id, followee_id, created_at (both directions indexed)",
      },
    ],
    sections: [
      {
        title: "Fan-out on write is not enough",
        paragraphs: [
          "The naive design writes a post id into every follower's feed at publish time. That is excellent for reads and terrible for a celebrity: one post becomes 50 million writes. The opposite design reads every followee's recent posts at request time, which is excellent for publishing and expensive for users who follow thousands of accounts.",
          "The practical answer is hybrid. Precompute feed entries for normal accounts. For accounts above a follower threshold, skip fan-out and merge their recent posts into the reader's feed at request time. The read path becomes a k-way merge plus ranking.",
        ],
      },
      {
        title: "Ranking is a separate service",
        paragraphs: [
          "Store a lightweight candidate set first, then rank. The feed API should be able to serve chronological or fallback results when the ranking service is unavailable. This is graceful degradation, not a second product.",
          "Keep ranking features near the candidate generation layer. Fetching dozens of features per post at request time will blow the latency budget. Precompute what you can and cap the candidate set.",
        ],
        bullets: [
          "Candidate generation: precomputed entries plus celebrity merge.",
          "Filtering: blocks, mutes, deleted posts, duplicate ids.",
          "Ranking: bounded feature lookup with a timeout and fallback.",
        ],
      },
      {
        title: "Pagination and freshness",
        paragraphs: [
          "Offset pagination is unstable in a live feed. Use a cursor that encodes the last score and id. When new posts arrive, the next page can still be fetched without duplicates. A session-level seen set can remove duplicates introduced by ranking refreshes.",
          "A user who refreshes expects new content. Separate the refresh from the pagination cursor: new items go on top, while the existing page cursor continues backwards. This is a product decision that makes the data model simpler.",
        ],
      },
    ],
    decisions: [
      {
        choice: "Hybrid fan-out",
        when: "Follower counts are highly skewed and read latency matters.",
        cost: "Two feed assembly paths and a merge step at read time.",
      },
      {
        choice: "Precomputed feed ids",
        when: "Most users follow a manageable number of accounts.",
        cost: "Fan-out work and storage proportional to follower count.",
      },
      {
        choice: "Fallback ranking",
        when: "Ranking is an enhancement, not a correctness requirement.",
        cost: "You need a well-defined chronological or affinity fallback.",
      },
    ],
    failureModes: [
      {
        failure: "Fan-out workers fall behind",
        impact: "New posts appear late in precomputed feeds.",
        mitigation: "Monitor lag, merge recent posts from followees at read time as a backstop.",
      },
      {
        failure: "Ranking service times out",
        impact: "Feed latency spikes.",
        mitigation: "Short timeout, circuit breaker, chronological fallback.",
      },
      {
        failure: "Celebrity post causes a read spike",
        impact: "Hot post metadata is fetched repeatedly.",
        mitigation: "Cache the recent celebrity post set and replicate hot keys.",
      },
    ],
    checklist: [
      "Fan-out strategy handles both normal and celebrity accounts.",
      "Read path has a bounded candidate set and a latency budget.",
      "Pagination is cursor-based and stable under inserts.",
      "Ranking has a timeout and a fallback.",
      "Unfollow, block and delete remove future and existing feed items.",
      "Fan-out lag is observable and has a read-time backstop.",
    ],
    relatedModules: ["caching-read-paths", "partitioning-and-hot-keys", "the-design-interview"],
    refs: [
      {
        label: "Meta — news feed architecture",
        href: "https://engineering.fb.com/",
      },
      {
        label: "Redis — sorted sets",
        href: "https://redis.io/docs/latest/develop/data-types/sorted-sets/",
      },
    ],
  },
  {
    slug: "ride-dispatch",
    title: "Design ride-hailing dispatch",
    subtitle: "Geospatial search, matching and a consistency promise measured in seconds.",
    difficulty: "Advanced",
    minutes: 45,
    summary:
      "Design the path from 'find me a ride' to an accepted trip: nearby-driver search, matching, pricing, location updates and failure recovery.",
    prompt:
      "Design a ride-hailing dispatch system for a city-scale product. Riders request a trip, see nearby cars, get a price, and are matched to a driver. Drivers stream location updates. A match must not be offered to two riders at once.",
    requirements: [
      "Find available drivers near a pickup point.",
      "Estimate price and ETA before booking.",
      "Match one driver to one active trip.",
      "Stream driver locations and update rider ETA.",
      "Cancel or reassign a trip when a driver drops out.",
    ],
    constraints: [
      "Location updates arrive every 2–5 seconds per active driver.",
      "Matching should complete within 30 seconds.",
      "A driver cannot be assigned to two active trips.",
      "Location can be slightly stale; the match decision cannot.",
    ],
    estimates: [
      {
        label: "Active drivers",
        value: "50k per city",
        note: "At peak, across a dense metro area.",
      },
      {
        label: "Location writes",
        value: "~20k / s",
        note: "50k drivers at a 2.5-second interval.",
      },
      {
        label: "Trip requests",
        value: "~1k / s",
        note: "A planning number for a large city at peak.",
      },
    ],
    blueprint: {
      caption: "A geospatial index finds candidates; a transactional matcher owns the assignment.",
      layers: [
        {
          label: "Clients",
          nodes: [
            { label: "Rider app", note: "request + track", tone: "client" },
            { label: "Driver app", note: "location stream", tone: "client" },
          ],
        },
        {
          label: "Realtime",
          nodes: [
            { label: "Location ingest", note: "partitioned by city", tone: "edge" },
            { label: "Geospatial index", note: "grid + driver state", tone: "edge" },
          ],
        },
        {
          label: "Dispatch",
          nodes: [
            { label: "Pricing service", tone: "service" },
            { label: "Matching service", note: "one active trip", tone: "service" },
            { label: "Trip state machine", tone: "service" },
          ],
        },
        {
          label: "Durable state",
          nodes: [
            { label: "Trip store", note: "conditional writes", tone: "data" },
            { label: "Event log", note: "audit + recovery", tone: "async" },
          ],
        },
      ],
    },
    api: [
      { method: "POST", path: "/quotes", purpose: "Estimate price and ETA for a pickup and destination." },
      { method: "POST", path: "/trips", purpose: "Request a trip; idempotency key required." },
      { method: "POST", path: "/trips/:id/cancel", purpose: "Cancel before or after assignment with policy." },
      { method: "WS", path: "/driver/location", purpose: "Stream driver positions and availability." },
    ],
    dataModel: [
      {
        name: "trips",
        fields: "trip_id, rider_id, driver_id, status, quote_id, version",
      },
      {
        name: "driver_state",
        fields: "driver_id, geohash, status, last_location_at, version",
      },
      {
        name: "trip_events",
        fields: "trip_id, event_type, occurred_at, payload (append-only)",
      },
    ],
    sections: [
      {
        title: "Find candidates with a geospatial index",
        paragraphs: [
          "A latitude/longitude scan is not a query plan. Bucket the map into cells (geohash or a grid), keep a driver index per cell, and search the pickup cell plus its neighbours. Return a bounded candidate set with distance and ETA, not every driver in the city.",
          "Location updates are high volume and short-lived. Keep the hot index in memory or a low-latency store, and persist an append-only history separately for audit. A stale driver location is fine for ranking candidates; it is not fine for confirming an assignment.",
        ],
      },
      {
        title: "Matching is a transaction",
        paragraphs: [
          "The critical invariant is one active trip per driver. A matching worker selects candidates, offers the trip, and uses a conditional write (compare-and-set on driver status) to claim the driver. If the write fails, try the next candidate. Offers expire quickly.",
          "The trip state machine should be explicit: requested → matching → offered → accepted → arriving → in_progress → completed. Every transition is idempotent and auditable. A driver cancellation returns the trip to matching without creating a second trip.",
        ],
        bullets: [
          "Claim driver with a conditional write, not a read-then-write.",
          "Expire offers with a timer and a version check.",
          "Record every transition in an append-only event log.",
        ],
      },
      {
        title: "Pricing and location are separate promises",
        paragraphs: [
          "A quote is a time-bounded estimate, not a guarantee. Store the quote id and pricing inputs so the fare can be explained later. If demand changes after the quote expires, ask the rider to accept a new price rather than silently charging more.",
          "Live location is a read-optimised stream. It can be stale, out of order or temporarily missing. Use sequence numbers and ignore older updates. The rider's ETA should be derived from a fresh route estimate, not from a straight-line distance.",
        ],
      },
    ],
    decisions: [
      {
        choice: "Geohash / grid index",
        when: "You need nearby candidates with predictable query cost.",
        cost: "Cell boundaries and dense areas need neighbour searches and hot-cell handling.",
      },
      {
        choice: "Conditional assignment",
        when: "Double-booking a driver is unacceptable.",
        cost: "Contention causes retries and a slightly slower match.",
      },
      {
        choice: "Short-lived quotes",
        when: "Prices depend on live demand and supply.",
        cost: "The rider may need to accept a new price.",
      },
    ],
    failureModes: [
      {
        failure: "Matching worker crashes after offering",
        impact: "The driver is stuck in an offered state.",
        mitigation: "Offer expiry, version checks and a reconciliation job.",
      },
      {
        failure: "Location stream falls behind",
        impact: "ETA is inaccurate.",
        mitigation: "Mark freshness, fall back to last known location and route estimate.",
      },
      {
        failure: "Driver goes offline mid-trip",
        impact: "The rider is stranded.",
        mitigation: "Detect missed heartbeats, alert operations and reassign with policy.",
      },
    ],
    checklist: [
      "Nearby search uses a bounded geospatial index, not a full scan.",
      "The matching invariant has a conditional write and an expiry.",
      "Trip state transitions are explicit, idempotent and auditable.",
      "Quotes are stored with their pricing inputs and expiry.",
      "Location freshness is visible to the rider.",
      "Driver failure has an operational recovery path.",
    ],
    relatedModules: ["consistency-and-cap", "partitioning-and-hot-keys", "resilience-and-failure"],
    refs: [
      {
        label: "Uber — engineering blog",
        href: "https://www.uber.com/blog/engineering/",
      },
      {
        label: "Redis — geospatial commands",
        href: "https://redis.io/docs/latest/commands/geosearch/",
      },
    ],
  },
  {
    slug: "video-streaming",
    title: "Design video streaming",
    subtitle: "Upload pipelines, transcoding queues, adaptive bitrate and a CDN that carries the load.",
    difficulty: "Intermediate",
    minutes: 40,
    summary:
      "Design a platform where creators upload video and viewers stream it smoothly on unreliable networks, without making the upload wait for every rendition.",
    prompt:
      "Design a video streaming platform for creators and viewers. Uploads should return quickly, videos should play on mobile and desktop, and the system should survive a viral video.",
    requirements: [
      "Upload a source video and return immediately.",
      "Produce multiple resolutions and formats.",
      "Stream with adaptive bitrate.",
      "Track view progress and resume playback.",
      "Handle a single video receiving millions of views.",
    ],
    constraints: [
      "Uploads can be gigabytes; the request must not hold a worker for the whole transfer.",
      "Playback start should be under 2 seconds on a good connection.",
      "Transcoding is CPU-heavy and can take minutes.",
      "Most traffic should be served from the edge, not the origin.",
    ],
    estimates: [
      {
        label: "Uploads",
        value: "~10k / day",
        note: "Planning number for a mid-sized creator platform.",
      },
      {
        label: "Views",
        value: "~50M / day",
        note: "The CDN carries the majority of bytes.",
      },
      {
        label: "Renditions",
        value: "4–6",
        note: "240p to 4K, plus a thumbnail and manifest.",
      },
    ],
    blueprint: {
      caption: "Separate ingest, processing and delivery; each has a different failure budget.",
      layers: [
        {
          label: "Ingest",
          nodes: [
            { label: "Creator", note: "resumable upload", tone: "client" },
            { label: "Upload service", note: "direct to object store", tone: "edge" },
          ],
        },
        {
          label: "Process",
          nodes: [
            { label: "Transcode queue", note: "durable jobs", tone: "async" },
            { label: "Workers", note: "segmented output", tone: "service" },
            { label: "Manifest builder", note: "HLS / DASH", tone: "service" },
          ],
        },
        {
          label: "Deliver",
          nodes: [
            { label: "CDN", note: "segments + manifests", tone: "edge" },
            { label: "Playback API", note: "session + progress", tone: "service" },
          ],
        },
        {
          label: "Data",
          nodes: [
            { label: "Object storage", note: "source + renditions", tone: "data" },
            { label: "Metadata DB", note: "video state", tone: "data" },
          ],
        },
      ],
    },
    api: [
      { method: "POST", path: "/videos", purpose: "Create a video record and return a resumable upload URL." },
      { method: "GET", path: "/videos/:id/playback", purpose: "Return a signed manifest URL and playback metadata." },
      { method: "POST", path: "/videos/:id/progress", purpose: "Save playback position and completion state." },
      { method: "GET", path: "/videos/:id/status", purpose: "Poll processing state for the creator." },
    ],
    dataModel: [
      {
        name: "videos",
        fields: "video_id, creator_id, status, source_key, duration, created_at",
      },
      {
        name: "renditions",
        fields: "video_id, resolution, codec, segment_prefix, ready_at",
      },
      {
        name: "view_progress",
        fields: "user_id, video_id, position_seconds, updated_at",
      },
    ],
    sections: [
      {
        title: "Upload directly, process asynchronously",
        paragraphs: [
          "The upload service should not proxy gigabytes through an application server. Issue a signed, resumable upload URL to object storage, then emit an event when the object is complete. The API returns a video id immediately and the UI polls or subscribes to status.",
          "Transcoding is a queue of independent segment jobs. A single source is split into chunks, each chunk produces renditions, and a manifest is assembled when all parts are ready. This makes retries cheap and lets you scale workers horizontally.",
        ],
      },
      {
        title: "Adaptive bitrate is a file layout problem",
        paragraphs: [
          "Streaming is not one large MP4. Produce segmented renditions and a manifest that lists them. The player chooses a rendition based on measured bandwidth and buffer health. Keep segment durations short enough to adapt, but not so short that request overhead dominates.",
          "A viral video creates a hot object problem. The CDN absorbs the read traffic; origin should see a small fraction of requests. Pre-warm the manifest and first segments when a video is published, and set cache headers deliberately.",
        ],
        bullets: [
          "Segment size: a few seconds, aligned across renditions.",
          "Manifest: signed, short-lived, cacheable at the edge.",
          "Hot video: pre-warm popular segments and protect origin.",
        ],
      },
      {
        title: "Playback state and failure",
        paragraphs: [
          "Playback progress is a low-value, high-volume write. Buffer it client-side and send it periodically. A lost progress update should never block playback. Use a per-user, per-video upsert and tolerate last-write-wins.",
          "If transcoding fails, keep the source and the job state. Retry only the failed segments. If the manifest is missing, return a clear processing state instead of a broken player.",
        ],
      },
    ],
    decisions: [
      {
        choice: "Direct-to-object-storage upload",
        when: "Files are large and the API tier should stay stateless.",
        cost: "You need signed URLs, CORS and completion events.",
      },
      {
        choice: "Segmented transcoding",
        when: "Jobs are long and retries should not restart from zero.",
        cost: "A manifest assembly step and more object storage operations.",
      },
      {
        choice: "CDN-first delivery",
        when: "Read traffic is high and content is cacheable.",
        cost: "Cache invalidation and signed URL policy become part of the design.",
      },
    ],
    failureModes: [
      {
        failure: "A transcoding worker dies",
        impact: "A segment never completes and the video stays processing.",
        mitigation: "Job leases, heartbeats and retry with a maximum attempt count.",
      },
      {
        failure: "A video goes viral",
        impact: "Origin and metadata reads spike.",
        mitigation: "CDN caching, pre-warm, request coalescing and rate limits.",
      },
      {
        failure: "Playback progress writes fail",
        impact: "The viewer loses resume position.",
        mitigation: "Client buffer, retry later, and keep playback independent.",
      },
    ],
    checklist: [
      "Upload returns before transcoding finishes.",
      "Transcoding is chunked, retryable and observable.",
      "Manifest and segments are designed for adaptive bitrate.",
      "CDN carries the majority of playback bytes.",
      "Playback progress is asynchronous and non-blocking.",
      "A viral video has a hot-object and origin-protection plan.",
    ],
    relatedModules: ["queues-and-streams", "caching-read-paths", "observability-and-slos"],
    refs: [
      {
        label: "Apple — HTTP Live Streaming",
        href: "https://developer.apple.com/streaming/",
      },
      {
        label: "MDN — media source extensions",
        href: "https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API",
      },
    ],
  },
  {
    slug: "rate-limiter",
    title: "Design a distributed rate limiter",
    subtitle: "Token buckets, shared state and the difference between protecting a service and punishing a user.",
    difficulty: "Intermediate",
    minutes: 30,
    summary:
      "Design a rate limiter that protects APIs across many gateways, supports per-user and per-IP policies, and stays available when its shared store is degraded.",
    prompt:
      "Design a rate limiter for a public API with 20,000 requests per second across multiple regions. Policies vary by plan and endpoint. A limiter outage must not take down the API.",
    requirements: [
      "Limit requests per user, API key and IP address.",
      "Support different limits per plan and endpoint.",
      "Return clear headers so clients can back off.",
      "Share counters across gateway instances.",
      "Fail open or closed per policy when the store is unavailable.",
    ],
    constraints: [
      "The limiter adds no more than 10 ms at p95.",
      "Bursts are expected; a pure fixed window is too crude.",
      "Multiple regions must enforce a global limit approximately.",
      "A misconfigured policy must be changeable without a deploy.",
    ],
    estimates: [
      {
        label: "Requests",
        value: "20k / s",
        note: "Across all regions at peak.",
      },
      {
        label: "Keys",
        value: "~5M",
        note: "Users and API keys, with a short active window.",
      },
      {
        label: "Counter TTL",
        value: "2 windows",
        note: "Keep state only as long as the policy needs it.",
      },
    ],
    blueprint: {
      caption: "A local decision backed by a shared counter, with a defined degraded mode.",
      layers: [
        {
          label: "Request",
          nodes: [{ label: "API client", note: "key + route", tone: "client" }],
        },
        {
          label: "Gateway",
          nodes: [
            { label: "Policy lookup", note: "cached config", tone: "edge" },
            { label: "Local bucket", note: "fast path", tone: "edge" },
          ],
        },
        {
          label: "Shared",
          nodes: [
            { label: "Redis cluster", note: "atomic counters", tone: "data" },
            { label: "Config service", note: "versioned policies", tone: "service" },
          ],
        },
        {
          label: "Feedback",
          nodes: [
            { label: "Rate headers", note: "remaining + reset", tone: "external" },
            { label: "Metrics", note: "allow / deny", tone: "data" },
          ],
        },
      ],
    },
    api: [
      { method: "GET", path: "/v1/resource", purpose: "A normal API request evaluated by the limiter." },
      { method: "GET", path: "/limits", purpose: "Return the caller's current policy and usage." },
      { method: "PUT", path: "/admin/policies/:id", purpose: "Update a policy without redeploying gateways." },
    ],
    dataModel: [
      {
        name: "policy",
        fields: "policy_id, scope, limit, window_seconds, burst, fail_mode, version",
      },
      {
        name: "bucket",
        fields: "key, tokens, last_refill_ms, ttl",
      },
      {
        name: "usage",
        fields: "key, window_start, allowed, denied (aggregated for metrics)",
      },
    ],
    sections: [
      {
        title: "Token bucket, not a fixed counter",
        paragraphs: [
          "A fixed-window counter allows a burst at the boundary: 100 requests at 00:59 and another 100 at 01:00. A token bucket refills at a steady rate and allows a bounded burst. It maps naturally to the product promise: average rate plus burst capacity.",
          "For a distributed limiter, the bucket must be updated atomically. A Lua script or a transactional store operation can read, refill and decrement in one step. If you split that into read-then-write, concurrent gateways will over-admit.",
        ],
      },
      {
        title: "Keep the hot path local",
        paragraphs: [
          "Every request cannot afford a network round trip to a central store. Use a two-tier approach: each gateway keeps a local token bucket and periodically reconciles with the shared store. This admits a small overshoot in exchange for speed and resilience.",
          "The policy should define the acceptable overshoot. For a login endpoint, overshoot is dangerous; for a public read endpoint, a few extra requests are fine. Make the fail mode explicit per policy.",
        ],
        bullets: [
          "Local bucket: fast, approximate, survives store latency.",
          "Shared bucket: accurate, slower, cross-region coordination.",
          "Fail open: protect availability, accept abuse risk.",
          "Fail closed: protect the resource, accept temporary denial.",
        ],
      },
      {
        title: "Tell the client what happened",
        paragraphs: [
          "A 429 without a reset time forces blind retries. Return the limit, remaining count and reset time, and document the policy. Use `Retry-After` for hard blocks. A client that understands the headers can back off instead of hammering the gateway.",
          "Rate limiting is not the same as load shedding. A limiter enforces fairness and abuse policy; load shedding protects a saturated service. Keep the two mechanisms separate so you can reason about each.",
        ],
      },
    ],
    decisions: [
      {
        choice: "Token bucket",
        when: "You need burst tolerance with a predictable average.",
        cost: "More state than a fixed counter; refill math must be atomic.",
      },
      {
        choice: "Local + shared reconciliation",
        when: "Latency and store availability matter more than perfect precision.",
        cost: "A bounded overshoot across gateway instances.",
      },
      {
        choice: "Per-policy fail mode",
        when: "Different endpoints have different abuse and availability risks.",
        cost: "More configuration and a need to test each mode.",
      },
    ],
    failureModes: [
      {
        failure: "Redis is slow",
        impact: "Every request inherits the latency.",
        mitigation: "Local buckets, a tight timeout and a per-policy fail mode.",
      },
      {
        failure: "Policy cache is stale",
        impact: "A limit change does not take effect.",
        mitigation: "Versioned policies, a short cache TTL and a push invalidation.",
      },
      {
        failure: "A key becomes hot",
        impact: "One counter shard is overloaded.",
        mitigation: "Shard counters by key hash and aggregate for the global limit.",
      },
    ],
    checklist: [
      "The algorithm supports bursts and has an atomic update.",
      "Counters are scoped by the right identity, not just IP.",
      "Rate headers and 429 behavior are documented.",
      "The fail-open/fail-closed choice is explicit per policy.",
      "Policy changes do not require a gateway deploy.",
      "Limiter latency and deny rates are observable.",
    ],
    relatedModules: ["scaling-from-one-server", "security-and-auth", "resilience-and-failure"],
    refs: [
      {
        label: "IETF — rate limit headers",
        href: "https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/",
      },
      {
        label: "Stripe — rate limits",
        href: "https://docs.stripe.com/rate-limits",
      },
    ],
  },
];

export const caseStudyDifficulties = ["Warm-up", "Intermediate", "Advanced"] as const;

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
