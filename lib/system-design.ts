export type BlueprintTone =
  | "client"
  | "edge"
  | "service"
  | "data"
  | "async"
  | "external";

export type BlueprintNode = {
  label: string;
  note?: string;
  tone?: BlueprintTone;
};

export type BlueprintLayer = {
  label: string;
  nodes: BlueprintNode[];
};

export type Blueprint = {
  caption: string;
  layers: BlueprintLayer[];
};

export type DesignDecision = {
  choice: string;
  when: string;
  cost: string;
};

export type Reference = {
  label: string;
  href: string;
};

export type SystemDesignPhase =
  | "Foundations"
  | "Scale"
  | "Distributed systems"
  | "Production";

export type SystemDesignModule = {
  slug: string;
  step: number;
  title: string;
  phase: SystemDesignPhase;
  minutes: number;
  summary: string;
  mentalModel: string;
  ideas: string[];
  topics: string[];
  blueprint: Blueprint;
  decisions: DesignDecision[];
  question: string;
  relatedCaseStudy?: string;
  refs: Reference[];
};

export const systemDesignModules: SystemDesignModule[] = [
  {
    slug: "design-foundations",
    step: 1,
    title: "Requirements to Constraints",
    phase: "Foundations",
    minutes: 30,
    summary:
      "Turn a vague prompt into a bounded problem: users, reads, writes, latency, availability and the assumptions you are willing to defend.",
    mentalModel:
      "A system design is a set of promises made under constraints. Start with who calls what, how often, and what must not break. Architecture comes after those answers.",
    ideas: [
      "Separate functional requirements (what it does) from non-functional requirements (how well it must do it).",
      "Read/write ratio decides whether you optimise the read path, the write path, or both.",
      "Back-of-the-envelope estimates are for choosing a shape, not for proving precision.",
      "Write assumptions down so the interviewer can correct them before you build on them.",
      "Design for the next order of magnitude, not for infinite scale.",
    ],
    topics: [
      "Functional requirements",
      "Non-functional requirements",
      "Read/write ratio",
      "Capacity estimates",
      "Assumptions and scope",
      "Success criteria",
    ],
    blueprint: {
      caption: "A requirement becomes a constraint before it becomes a diagram.",
      layers: [
        {
          label: "Input",
          nodes: [
            { label: "User goal", note: "who and why", tone: "client" },
            { label: "Scale", note: "users, QPS, data", tone: "client" },
          ],
        },
        {
          label: "Constraints",
          nodes: [
            { label: "Latency", note: "p95 target", tone: "edge" },
            { label: "Availability", note: "error budget", tone: "edge" },
            { label: "Consistency", note: "stale reads?", tone: "edge" },
          ],
        },
        {
          label: "Shape",
          nodes: [
            { label: "API surface", tone: "service" },
            { label: "Data model", tone: "data" },
            { label: "Scale plan", tone: "service" },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: "Optimise for reads",
        when: "Reads outnumber writes by 10x or more and stale data is tolerable for a short window.",
        cost: "Caching, replicas and invalidation become part of the system.",
      },
      {
        choice: "Optimise for writes",
        when: "Events arrive faster than users consume them, such as logging, chat or telemetry.",
        cost: "Queues, batching and backpressure are required.",
      },
      {
        choice: "Narrow the scope",
        when: "The prompt contains several products disguised as one.",
        cost: "You may need to say explicitly what v1 will not do.",
      },
    ],
    question:
      "Design a bookmarking service for 10,000 active users. Write six requirements and three estimates before drawing a single box.",
    relatedCaseStudy: "url-shortener",
    refs: [
      {
        label: "AWS — Well-Architected Framework",
        href: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
      },
      {
        label: "Google SRE — service level objectives",
        href: "https://sre.google/sre-book/service-level-objectives/",
      },
    ],
  },
  {
    slug: "scaling-from-one-server",
    step: 2,
    title: "Scaling from One Server",
    phase: "Foundations",
    minutes: 35,
    summary:
      "What actually changes when a second server appears: state, sessions, load balancing, health checks and the difference between scaling up and out.",
    mentalModel:
      "A single server is easy because everything shares one memory. The moment there are two, every piece of state must live somewhere both can see.",
    ideas: [
      "Vertical scaling is simpler and has a ceiling; horizontal scaling adds moving parts.",
      "Stateless application servers can be replaced freely; sessions and uploads need a shared home.",
      "A load balancer needs health checks, timeouts and a plan for draining connections.",
      "Sticky sessions reduce changes but make failures and deploys messy.",
      "The database is usually the first shared bottleneck after the app tier scales out.",
    ],
    topics: [
      "Vertical vs horizontal scaling",
      "Stateless services",
      "Load balancing",
      "Health checks",
      "Session storage",
      "Connection draining",
    ],
    blueprint: {
      caption: "Move state out of the app tier, then put a balanced, replaceable tier in front of it.",
      layers: [
        {
          label: "Clients",
          nodes: [{ label: "Web / mobile", tone: "client" }],
        },
        {
          label: "Edge",
          nodes: [{ label: "Load balancer", note: "TLS + health checks", tone: "edge" }],
        },
        {
          label: "App tier",
          nodes: [
            { label: "App 1", note: "stateless", tone: "service" },
            { label: "App 2", note: "stateless", tone: "service" },
            { label: "App 3", note: "stateless", tone: "service" },
          ],
        },
        {
          label: "Shared state",
          nodes: [
            { label: "Session store", note: "Redis", tone: "data" },
            { label: "Primary database", tone: "data" },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: "Scale up first",
        when: "The workload is small, the team is small and the vertical ceiling is far away.",
        cost: "A single machine remains a failure domain and has a hard limit.",
      },
      {
        choice: "Scale out with a load balancer",
        when: "Traffic is growing, availability matters and the app can be made stateless.",
        cost: "You now own routing, health checks and distributed session state.",
      },
      {
        choice: "Use sticky sessions",
        when: "A legacy app stores state in memory and cannot be changed quickly.",
        cost: "Deploys and node failures interrupt real users.",
      },
    ],
    question:
      "A single 16-core server is at 70% CPU. Explain when you would upgrade it and when you would add a second server instead.",
    relatedCaseStudy: "rate-limiter",
    refs: [
      {
        label: "NGINX — load balancing",
        href: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/",
      },
      {
        label: "AWS — stateless architecture",
        href: "https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/stateless-architecture.html",
      },
    ],
  },
  {
    slug: "apis-and-idempotency",
    step: 3,
    title: "APIs, Idempotency & Contracts",
    phase: "Foundations",
    minutes: 30,
    summary:
      "The contract between clients and services: resource shapes, pagination, retries, idempotency keys and what a timeout really means.",
    mentalModel:
      "A network call has three outcomes: success, failure, or unknown. Idempotency is how you make 'unknown' safe to retry.",
    ideas: [
      "Design APIs around resources and actions, not around database tables.",
      "Pagination needs a stable cursor when data changes underneath the reader.",
      "A retried POST can duplicate a payment, message or order without an idempotency key.",
      "Timeouts must be shorter than the caller's patience and longer than normal work.",
      "Version the contract, not every URL; deprecation is a product decision.",
    ],
    topics: [
      "REST and RPC",
      "Resource modelling",
      "Cursor pagination",
      "Idempotency keys",
      "Timeouts and retries",
      "API versioning",
    ],
    blueprint: {
      caption: "Put one clear contract at the edge, then let internal services evolve behind it.",
      layers: [
        {
          label: "Client",
          nodes: [{ label: "Web / mobile", note: "retries with key", tone: "client" }],
        },
        {
          label: "Contract",
          nodes: [
            { label: "API gateway", note: "auth, limits", tone: "edge" },
            { label: "Schema", note: "versioned", tone: "edge" },
          ],
        },
        {
          label: "Services",
          nodes: [
            { label: "Command service", note: "writes", tone: "service" },
            { label: "Query service", note: "reads", tone: "service" },
          ],
        },
        {
          label: "State",
          nodes: [
            { label: "Idempotency store", tone: "data" },
            { label: "Primary data", tone: "data" },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: "REST + JSON",
        when: "Resources are familiar, clients are diverse and caching matters.",
        cost: "Chatty interfaces and awkward action endpoints.",
      },
      {
        choice: "gRPC",
        when: "Internal services need typed contracts and low overhead.",
        cost: "Browser support and debugging are less direct.",
      },
      {
        choice: "Idempotency keys",
        when: "A write is expensive, non-reversible or externally visible.",
        cost: "You must store and expire keys, and define the duplicate response.",
      },
    ],
    question:
      "A client times out while creating an order. Design the API so retrying is safe and the user never sees two orders.",
    relatedCaseStudy: "url-shortener",
    refs: [
      {
        label: "Stripe — idempotent requests",
        href: "https://docs.stripe.com/api/idempotent_requests",
      },
      {
        label: "Google API design guide",
        href: "https://cloud.google.com/apis/design",
      },
    ],
  },
  {
    slug: "caching-read-paths",
    step: 4,
    title: "Caching & Read Paths",
    phase: "Scale",
    minutes: 35,
    summary:
      "Where to put a cache, how it expires, what happens on a miss, and why invalidation is a product problem as much as a technical one.",
    mentalModel:
      "A cache is a copy that may be wrong. Decide how wrong it is allowed to be before you decide where it lives.",
    ideas: [
      "Cache close to the reader: browser, CDN, edge, service, database, in that order of distance.",
      "Cache-aside keeps the application in control; write-through keeps the cache warm at write time.",
      "A TTL is a freshness promise, not a correctness guarantee.",
      "A stampede happens when a popular key expires and every request misses at once.",
      "Invalidation needs a source of truth and a way to know a key changed.",
    ],
    topics: [
      "Cache-aside",
      "Write-through",
      "TTL and freshness",
      "Stampede protection",
      "CDN caching",
      "Invalidation",
    ],
    blueprint: {
      caption: "The read path should stop at the closest copy that satisfies its freshness promise.",
      layers: [
        {
          label: "Reader",
          nodes: [{ label: "Browser", note: "HTTP cache", tone: "client" }],
        },
        {
          label: "Edge",
          nodes: [
            { label: "CDN", note: "static + public pages", tone: "edge" },
            { label: "Edge cache", note: "personalised?", tone: "edge" },
          ],
        },
        {
          label: "Service",
          nodes: [
            { label: "Read API", tone: "service" },
            { label: "Cache-aside", note: "Redis", tone: "async" },
          ],
        },
        {
          label: "Truth",
          nodes: [{ label: "Primary database", tone: "data" }],
        },
      ],
    },
    decisions: [
      {
        choice: "Cache-aside with TTL",
        when: "Reads dominate and a short stale window is acceptable.",
        cost: "The first read after expiry is slow; stampedes need protection.",
      },
      {
        choice: "Write-through",
        when: "Every write must be visible immediately from the cache.",
        cost: "Write latency grows and cache failures can block writes.",
      },
      {
        choice: "Do not cache",
        when: "The data is personal, highly sensitive or changes on every read.",
        cost: "You carry the full load and latency of the source of truth.",
      },
    ],
    question:
      "A product page is read 50,000 times a minute and changes twice a day. What would you cache, for how long, and how would you invalidate it?",
    relatedCaseStudy: "news-feed",
    refs: [
      {
        label: "AWS — caching best practices",
        href: "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/BestPractices.html",
      },
      {
        label: "MDN — HTTP caching",
        href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
      },
    ],
  },
  {
    slug: "databases-and-indexes",
    step: 5,
    title: "Databases: Choosing the Shape",
    phase: "Scale",
    minutes: 40,
    summary:
      "Relational or document, B-tree or LSM, one primary or many replicas. Choose the shape that fits the access pattern, not the hype cycle.",
    mentalModel:
      "A database is an index plus a durability promise. The access pattern decides the index; the consistency requirement decides the topology.",
    ideas: [
      "Relational databases are strong defaults when relationships and transactions matter.",
      "Indexes speed reads by adding write cost and storage; an unused index is a tax.",
      "B-trees favour read-heavy workloads; LSM trees favour write-heavy ingestion.",
      "Read replicas trade freshness for read throughput.",
      "Schema flexibility is not the same as schema freedom.",
    ],
    topics: [
      "SQL vs document stores",
      "B-tree vs LSM",
      "Index design",
      "Transactions",
      "Read replicas",
      "Replication lag",
    ],
    blueprint: {
      caption: "Separate the write path from the read path when their loads diverge.",
      layers: [
        {
          label: "Writes",
          nodes: [{ label: "Write API", note: "transactions", tone: "service" }],
        },
        {
          label: "Primary",
          nodes: [{ label: "Primary database", note: "source of truth", tone: "data" }],
        },
        {
          label: "Replication",
          nodes: [
            { label: "Replica A", note: "async lag", tone: "data" },
            { label: "Replica B", note: "async lag", tone: "data" },
          ],
        },
        {
          label: "Reads",
          nodes: [
            { label: "Read API", tone: "service" },
            { label: "Search index", note: "derived", tone: "async" },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: "Relational database",
        when: "You need joins, constraints, transactions or a well-understood operational model.",
        cost: "Scaling writes requires partitioning or a different architecture.",
      },
      {
        choice: "Document store",
        when: "Documents are self-contained and the schema varies by product.",
        cost: "Cross-document consistency and joins become application work.",
      },
      {
        choice: "Read replicas",
        when: "Reads outnumber writes and some replication lag is acceptable.",
        cost: "Read-your-writes needs routing or a session guarantee.",
      },
    ],
    question:
      "An events app writes 2,000 RSVPs per second and reads them in three different shapes. Choose a store, indexes and a read topology.",
    relatedCaseStudy: "url-shortener",
    refs: [
      {
        label: "PostgreSQL — indexes",
        href: "https://www.postgresql.org/docs/current/indexes.html",
      },
      {
        label: "Use The Index, Luke",
        href: "https://use-the-index-luke.com/",
      },
    ],
  },
  {
    slug: "partitioning-and-hot-keys",
    step: 6,
    title: "Partitioning & Hot Keys",
    phase: "Scale",
    minutes: 35,
    summary:
      "When one machine can no longer hold the data: shard keys, consistent hashing, resharding and the celebrity problem.",
    mentalModel:
      "Partitioning buys capacity by making a routing decision. A bad key concentrates traffic; a good key spreads it without making common queries impossible.",
    ideas: [
      "Hash partitioning spreads writes evenly but makes range queries expensive.",
      "Range partitioning keeps related rows together but risks uneven shards.",
      "Consistent hashing reduces data movement when nodes join or leave.",
      "A hot key is a distribution problem; replicate it, split it or cache it.",
      "Resharding must be planned before the first shard fills up.",
    ],
    topics: [
      "Shard keys",
      "Hash vs range",
      "Consistent hashing",
      "Hot-key mitigation",
      "Secondary indexes",
      "Resharding",
    ],
    blueprint: {
      caption: "A router maps each key to a shard; the shard owns the data and its local index.",
      layers: [
        {
          label: "Request",
          nodes: [{ label: "Write request", note: "tenant_id + id", tone: "client" }],
        },
        {
          label: "Routing",
          nodes: [{ label: "Shard router", note: "hash(key) % N", tone: "edge" }],
        },
        {
          label: "Shards",
          nodes: [
            { label: "Shard 1", tone: "data" },
            { label: "Shard 2", tone: "data" },
            { label: "Shard 3", tone: "data" },
          ],
        },
        {
          label: "Pressure",
          nodes: [
            { label: "Hot key", note: "replicate / split", tone: "async" },
            { label: "Rebalance", note: "move ranges", tone: "async" },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: "Hash the tenant or user id",
        when: "Access is mostly by one user and even write distribution matters.",
        cost: "Cross-user range queries need a secondary index or fan-out.",
      },
      {
        choice: "Range by time or region",
        when: "Queries naturally scan a range and locality matters.",
        cost: "Recent ranges become hot and need splitting.",
      },
      {
        choice: "Replicate a hot key",
        when: "A single key receives disproportionate traffic.",
        cost: "Writes to that key still need a single owner.",
      },
    ],
    question:
      "A celebrity posts once and 40 million followers read it. Your feed is sharded by user id. Where does the pressure land, and what do you change?",
    relatedCaseStudy: "news-feed",
    refs: [
      {
        label: "Amazon — Dynamo paper",
        href: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
      },
      {
        label: "MongoDB — sharding",
        href: "https://www.mongodb.com/docs/manual/sharding/",
      },
    ],
  },
  {
    slug: "queues-and-streams",
    step: 7,
    title: "Queues, Streams & Async Work",
    phase: "Distributed systems",
    minutes: 35,
    summary:
      "Move slow or bursty work out of the request path without losing it: delivery semantics, ordering, backpressure and dead letters.",
    mentalModel:
      "A queue turns a synchronous promise into an asynchronous one. The user gets a receipt; the system still owes the work.",
    ideas: [
      "At-least-once delivery plus an idempotent consumer is the practical default.",
      "Ordering is per partition or per key, not global, unless you pay for it.",
      "Backpressure protects consumers; an unbounded queue only hides the failure.",
      "A dead-letter queue is an operational tool, not a garbage bin.",
      "Exactly-once is usually a transaction boundary, not a broker setting.",
    ],
    topics: [
      "Queue vs log",
      "Delivery semantics",
      "Idempotent consumers",
      "Ordering and partitions",
      "Backpressure",
      "Dead-letter queues",
    ],
    blueprint: {
      caption: "Accept the write quickly, then let durable workers catch up at their own pace.",
      layers: [
        {
          label: "Producer",
          nodes: [{ label: "API", note: "accept + enqueue", tone: "service" }],
        },
        {
          label: "Durable log",
          nodes: [{ label: "Event stream", note: "partitioned", tone: "async" }],
        },
        {
          label: "Consumers",
          nodes: [
            { label: "Worker pool", note: "idempotent", tone: "service" },
            { label: "Retry queue", note: "backoff", tone: "async" },
          ],
        },
        {
          label: "Outcomes",
          nodes: [
            { label: "Primary store", tone: "data" },
            { label: "Dead-letter queue", note: "inspect", tone: "external" },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: "Queue",
        when: "Each job is handled once by one worker and ordering is not global.",
        cost: "Visibility, retries and duplicate handling live with you.",
      },
      {
        choice: "Log / stream",
        when: "Multiple consumers replay history or build derived views.",
        cost: "Retention, partition keys and consumer lag become first-class concerns.",
      },
      {
        choice: "Synchronous call",
        when: "The user needs the result before they can continue.",
        cost: "The request inherits every downstream failure mode.",
      },
    ],
    question:
      "A video upload should return immediately but produce five renditions and a thumbnail. Design the handoff and the failure path.",
    relatedCaseStudy: "video-streaming",
    refs: [
      {
        label: "Apache Kafka — design",
        href: "https://kafka.apache.org/documentation/#design",
      },
      {
        label: "AWS — dead-letter queues",
        href: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
      },
    ],
  },
  {
    slug: "consistency-and-cap",
    step: 8,
    title: "Consistency, CAP & Transactions",
    phase: "Distributed systems",
    minutes: 40,
    summary:
      "What CAP really says, when eventual consistency is honest, and how sagas, quorums and idempotency keep distributed workflows coherent.",
    mentalModel:
      "Consistency is a user-facing promise about what a read may return. CAP is a statement about what happens during a network partition, not a menu of three equal choices.",
    ideas: [
      "Strong consistency makes every read see the latest acknowledged write.",
      "Eventual consistency is a promise about convergence, not a promise about when.",
      "CAP: during a partition, choose availability or consistency for a specific operation.",
      "Quorums trade read and write latency for overlap and recency.",
      "A saga replaces one distributed transaction with compensatable local steps.",
    ],
    topics: [
      "Strong vs eventual",
      "CAP and PACELC",
      "Quorum reads and writes",
      "Consensus",
      "Sagas",
      "Compensating actions",
    ],
    blueprint: {
      caption: "A distributed write is a sequence of local decisions with an explicit failure story.",
      layers: [
        {
          label: "Command",
          nodes: [{ label: "Place order", note: "idempotency key", tone: "client" }],
        },
        {
          label: "Coordinator",
          nodes: [{ label: "Saga orchestrator", note: "state machine", tone: "service" }],
        },
        {
          label: "Local steps",
          nodes: [
            { label: "Reserve stock", tone: "service" },
            { label: "Charge card", tone: "external" },
            { label: "Create order", tone: "data" },
          ],
        },
        {
          label: "Failure path",
          nodes: [
            { label: "Compensate", note: "release + refund", tone: "async" },
            { label: "Audit log", note: "immutable", tone: "data" },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: "Strong consistency",
        when: "A stale read causes a direct correctness or money problem.",
        cost: "Coordination, latency and reduced availability during partitions.",
      },
      {
        choice: "Eventual consistency",
        when: "Users can tolerate a short lag and the UI makes it explicit.",
        cost: "You need conflict resolution, idempotency and convergence checks.",
      },
      {
        choice: "Saga",
        when: "A workflow spans services that cannot share one transaction.",
        cost: "Every step needs a compensation and the system can be temporarily inconsistent.",
      },
    ],
    question:
      "A payment succeeds but the order write fails. Walk through the compensating actions and the user-visible state at each step.",
    relatedCaseStudy: "ride-dispatch",
    refs: [
      {
        label: "Martin Kleppmann — distributed systems notes",
        href: "https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf",
      },
      {
        label: "Microsoft — saga pattern",
        href: "https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga",
      },
    ],
  },
  {
    slug: "resilience-and-failure",
    step: 9,
    title: "Resilience: Failure Is Normal",
    phase: "Distributed systems",
    minutes: 35,
    summary:
      "Timeouts, retries with jitter, circuit breakers, bulkheads and graceful degradation — the difference between a blip and an outage.",
    mentalModel:
      "Every dependency will fail. Design the smallest possible blast radius, then decide what the product does while the dependency is gone.",
    ideas: [
      "A timeout without a retry policy can still multiply load; a retry without jitter can synchronise a stampede.",
      "Circuit breakers stop retrying a dependency that is already down.",
      "Bulkheads isolate pools so one slow dependency cannot consume every worker.",
      "Graceful degradation is a product decision: hide, queue, or serve stale.",
      "Multi-region failover is not complete until you have tested the failover.",
    ],
    topics: [
      "Timeouts",
      "Retries and jitter",
      "Circuit breakers",
      "Bulkheads",
      "Graceful degradation",
      "Disaster recovery",
    ],
    blueprint: {
      caption: "Contain each dependency failure, then choose the product's fallback.",
      layers: [
        {
          label: "Request",
          nodes: [{ label: "User action", tone: "client" }],
        },
        {
          label: "Guard",
          nodes: [
            { label: "Timeout", note: "p99 + margin", tone: "edge" },
            { label: "Circuit breaker", note: "open / half-open", tone: "edge" },
            { label: "Bulkhead", note: "isolated pool", tone: "edge" },
          ],
        },
        {
          label: "Dependency",
          nodes: [
            { label: "Primary", tone: "service" },
            { label: "Fallback", note: "cache / queue", tone: "async" },
          ],
        },
        {
          label: "Signal",
          nodes: [
            { label: "Error rate", tone: "data" },
            { label: "Latency", tone: "data" },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: "Fail fast",
        when: "The user can retry later and a slow response is worse than a clear error.",
        cost: "Some requests that might have succeeded are abandoned.",
      },
      {
        choice: "Serve stale",
        when: "Old data is still useful and the source is unavailable.",
        cost: "The product must expose freshness or tolerate silent staleness.",
      },
      {
        choice: "Queue for later",
        when: "The action is durable and eventual completion is acceptable.",
        cost: "The user needs a status surface and duplicate protection.",
      },
    ],
    question:
      "Your payment provider's p99 latency jumps from 300 ms to 12 seconds. Write the failure policy for a checkout flow.",
    relatedCaseStudy: "chat-realtime",
    refs: [
      {
        label: "Google SRE — handling overload",
        href: "https://sre.google/sre-book/handling-overload/",
      },
      {
        label: "Azure — circuit breaker pattern",
        href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker",
      },
    ],
  },
  {
    slug: "observability-and-slos",
    step: 10,
    title: "Observability & SLOs",
    phase: "Production",
    minutes: 30,
    summary:
      "Instrument the user journey, define what good looks like, and alert on symptoms instead of every spike in a dashboard.",
    mentalModel:
      "Observability is the ability to ask a new question without shipping new code. An SLO turns that question into a promise.",
    ideas: [
      "Metrics are cheap aggregates; logs are detailed events; traces connect one request across services.",
      "Track rate, errors and duration (RED) for services; utilisation, saturation and errors (USE) for resources.",
      "An SLO is a target for a user-visible signal, not a server CPU threshold.",
      "An error budget makes the trade-off between shipping and stability explicit.",
      "Alert on symptoms with a runbook, not on every cause without one.",
    ],
    topics: [
      "Metrics, logs, traces",
      "RED and USE",
      "SLIs and SLOs",
      "Error budgets",
      "Alert design",
      "Runbooks",
    ],
    blueprint: {
      caption: "Signals become a user promise, then an alert with an owner and a next action.",
      layers: [
        {
          label: "Emit",
          nodes: [
            { label: "Metrics", note: "counters + histograms", tone: "service" },
            { label: "Traces", note: "request context", tone: "service" },
            { label: "Logs", note: "structured events", tone: "service" },
          ],
        },
        {
          label: "Correlate",
          nodes: [
            { label: "Trace id", tone: "edge" },
            { label: "Dashboards", tone: "edge" },
          ],
        },
        {
          label: "Promise",
          nodes: [{ label: "SLO", note: "99.9% < 300ms", tone: "data" }],
        },
        {
          label: "Act",
          nodes: [
            { label: "Alert", note: "symptom + owner", tone: "external" },
            { label: "Runbook", note: "next step", tone: "external" },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: "Symptom alert",
        when: "Users are experiencing elevated errors or latency.",
        cost: "You may page later than a cause-based alert; the signal is more actionable.",
      },
      {
        choice: "Cause alert",
        when: "A leading indicator reliably predicts a user-visible failure.",
        cost: "Noisy thresholds and dashboards that nobody trusts.",
      },
      {
        choice: "Error budget policy",
        when: "Product and reliability need a shared rule for release velocity.",
        cost: "Requires leadership agreement and honest measurement.",
      },
    ],
    question:
      "Define three SLIs for a file-sharing product and one alert for each. Explain what a page should tell the on-call engineer.",
    relatedCaseStudy: "video-streaming",
    refs: [
      {
        label: "Google SRE — monitoring distributed systems",
        href: "https://sre.google/sre-book/monitoring-distributed-systems/",
      },
      {
        label: "OpenTelemetry — concepts",
        href: "https://opentelemetry.io/docs/concepts/",
      },
    ],
  },
  {
    slug: "security-and-auth",
    step: 11,
    title: "Security, Auth & Abuse",
    phase: "Production",
    minutes: 35,
    summary:
      "Identity, sessions, permissions, rate limits and the abuse cases that turn a correct design into an unsafe one.",
    mentalModel:
      "Security is a set of boundaries. Every boundary needs authentication, authorisation, input validation and a limit on how much damage it can do.",
    ideas: [
      "OAuth delegates access; OIDC tells you who the user is.",
      "Server-side sessions are revocable; self-contained tokens are easy to verify but harder to invalidate.",
      "Authorise every object access, not just every route.",
      "Rate limits protect availability and reduce credential stuffing; they are not a substitute for auth.",
      "Encrypt in transit and at rest; keep secrets out of source and logs.",
    ],
    topics: [
      "OAuth and OIDC",
      "Sessions vs JWT",
      "RBAC and object auth",
      "Rate limiting",
      "Secrets management",
      "Input validation",
    ],
    blueprint: {
      caption: "Identity flows through a gate; every downstream service still checks the object boundary.",
      layers: [
        {
          label: "Identity",
          nodes: [
            { label: "OIDC provider", note: "login", tone: "external" },
            { label: "Session / token", note: "revocable", tone: "client" },
          ],
        },
        {
          label: "Edge",
          nodes: [
            { label: "API gateway", note: "auth + limits", tone: "edge" },
            { label: "WAF", note: "abuse signals", tone: "edge" },
          ],
        },
        {
          label: "Service",
          nodes: [
            { label: "Policy check", note: "role + object", tone: "service" },
            { label: "Audit log", note: "who did what", tone: "data" },
          ],
        },
        {
          label: "Data",
          nodes: [
            { label: "Encrypted store", tone: "data" },
            { label: "Secret manager", tone: "external" },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: "Server-side session",
        when: "You need immediate logout and central revocation.",
        cost: "Session lookup becomes a dependency on every request.",
      },
      {
        choice: "Short-lived JWT",
        when: "Services need stateless verification and the token lifetime is small.",
        cost: "Revocation needs denylists or short expiry plus refresh.",
      },
      {
        choice: "Token bucket rate limit",
        when: "You need burst tolerance with a predictable average.",
        cost: "Distributed counters need a shared store and careful key design.",
      },
    ],
    question:
      "A user shares a private document link. Explain authentication, object authorisation, expiry and revocation in one flow.",
    relatedCaseStudy: "rate-limiter",
    refs: [
      {
        label: "OWASP — authorization cheat sheet",
        href: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
      },
      {
        label: "OAuth 2.0 — security best practices",
        href: "https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics",
      },
    ],
  },
  {
    slug: "the-design-interview",
    step: 12,
    title: "The 45-Minute Design Interview",
    phase: "Production",
    minutes: 30,
    summary:
      "A repeatable loop for the room: clarify, estimate, sketch, deep-dive, break it, then summarise the trade-offs you chose.",
    mentalModel:
      "The interviewer is evaluating your reasoning, not guessing whether you memorised the canonical diagram. Make your assumptions visible and your trade-offs explicit.",
    ideas: [
      "Spend the first five minutes on users, scale, latency and the two hardest requirements.",
      "Draw the smallest end-to-end path before adding caches, queues or regions.",
      "Pick one component to deep-dive; breadth without depth is a sketch, not a design.",
      "Say what breaks and how you detect it. Failure is part of the architecture.",
      "Close with the trade-offs you accepted and what you would measure in production.",
    ],
    topics: [
      "Requirement framing",
      "Capacity estimates",
      "High-level sketch",
      "Deep dive selection",
      "Failure discussion",
      "Trade-off summary",
    ],
    blueprint: {
      caption: "A 45-minute loop with deliberate time boxes.",
      layers: [
        {
          label: "0–5 min",
          nodes: [
            { label: "Clarify", note: "users + constraints", tone: "client" },
            { label: "Scope", note: "what is out", tone: "client" },
          ],
        },
        {
          label: "5–10",
          nodes: [
            { label: "Estimate", note: "QPS + storage", tone: "edge" },
            { label: "API", note: "core operations", tone: "edge" },
          ],
        },
        {
          label: "10–30",
          nodes: [
            { label: "High-level path", tone: "service" },
            { label: "Data model", tone: "data" },
            { label: "Deep dive", note: "pick one hard part", tone: "service" },
          ],
        },
        {
          label: "30–45",
          nodes: [
            { label: "Failure", note: "what breaks", tone: "async" },
            { label: "Trade-offs", note: "what you chose", tone: "external" },
            { label: "Recap", note: "metrics + next", tone: "external" },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: "Go broad first",
        when: "You have not yet agreed on the end-to-end path.",
        cost: "Depth may be shallow until you choose a component.",
      },
      {
        choice: "Go deep early",
        when: "The prompt names one hard constraint, such as consistency or latency.",
        cost: "You may miss an obvious interface or operational gap.",
      },
      {
        choice: "Name the trade-off",
        when: "You make any non-trivial choice.",
        cost: "It takes time, but it demonstrates judgement rather than recall.",
      },
    ],
    question:
      "Design a collaborative document editor. Use the loop: requirements, estimates, API, data model, one deep dive, failure and a trade-off recap.",
    relatedCaseStudy: "chat-realtime",
    refs: [
      {
        label: "System Design Primer",
        href: "https://github.com/donnemartin/system-design-primer",
      },
      {
        label: "Google — how to design a system",
        href: "https://www.google.com/about/careers/applications/how-we-hire/",
      },
    ],
  },
];

export const systemDesignPhases = [
  "Foundations",
  "Scale",
  "Distributed systems",
  "Production",
] as const;

export function getSystemDesignModule(slug: string) {
  return systemDesignModules.find((module) => module.slug === slug);
}

export function getSystemDesignModuleByStep(step: number) {
  return systemDesignModules.find((module) => module.step === step);
}

export function getNextSystemDesignModule(step: number) {
  return systemDesignModules.find((module) => module.step === step + 1);
}

export function getPreviousSystemDesignModule(step: number) {
  return systemDesignModules.find((module) => module.step === step - 1);
}
