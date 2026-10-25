export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; language: string; code: string }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  date: string;
  displayDate: string;
  track: "DSA" | "System Design";
  accent: "green" | "blue" | "amber";
  glyph: string;
  blocks: PostBlock[];
};

export const posts: Post[] = [
  {
    slug: "the-read-path-is-the-product",
    title: "The read path is the product",
    excerpt:
      "Why read-heavy systems are mostly a cache-design problem, and the three freshness questions to ask before adding one.",
    category: "Caching",
    track: "System Design",
    readTime: 7,
    date: "2026-10-20",
    displayDate: "20 Oct 2026",
    accent: "blue",
    glyph: "↯",
    blocks: [
      {
        type: "p",
        text: "In a read-heavy product, most users never touch the write path. They see a feed, a profile, a price or a document. The read path is not a secondary concern; it is the product surface. If it is slow, the system feels broken even when every write succeeded.",
      },
      { type: "h2", text: "Start with a freshness budget" },
      {
        type: "p",
        text: "Before choosing Redis, a CDN or a materialized view, write down how stale the data is allowed to be. A product page can tolerate five minutes. A bank balance cannot. A presence badge can tolerate thirty seconds. The freshness budget tells you where a copy is allowed to live and how it must be invalidated.",
      },
      {
        type: "ul",
        items: [
          "Who is allowed to see stale data: everyone, one user, or nobody?",
          "What event makes the copy wrong: a write, a delete, a permission change?",
          "What happens if the invalidation is delayed or lost?",
        ],
      },
      { type: "h2", text: "Distance is a design tool" },
      {
        type: "p",
        text: "The closest cache is the browser. Then the CDN, the edge, the service, and finally the database. Each step closer to the user removes latency and adds a copy that can disagree. Put data as close as its freshness budget allows, not as close as technically possible.",
      },
      {
        type: "quote",
        text: "A cache is a copy that may be wrong. Decide how wrong it may be before you decide where it lives.",
      },
      { type: "h2", text: "The miss is the hard part" },
      {
        type: "p",
        text: "A cache hit is easy. A miss under load is where systems fall over. A popular key expires, thousands of requests miss at once, and the source of truth gets a spike it was never sized for. Request coalescing, a short stale-while-revalidate window, or a lock per key can turn a stampede into one slow request.",
      },
      {
        type: "p",
        text: "When someone proposes a cache, ask for the miss plan before the hit rate. The hit rate is a hope; the miss plan is the architecture.",
      },
    ],
  },
  {
    slug: "consistency-is-a-product-decision",
    title: "Consistency is a product decision",
    excerpt:
      "Strong, eventual and read-your-writes are not just database settings. They are promises the interface makes to a person.",
    category: "Distributed systems",
    track: "System Design",
    readTime: 8,
    date: "2026-10-18",
    displayDate: "18 Oct 2026",
    accent: "green",
    glyph: "⇄",
    blocks: [
      {
        type: "p",
        text: "Engineers often treat consistency as a database property. Users experience it as a product property. 'I saved it, why is it gone?' is a consistency bug even when every replica is healthy. The question is not which database is strongest; it is which promise the screen is making.",
      },
      { type: "h2", text: "Read-your-writes is the default expectation" },
      {
        type: "p",
        text: "If a user edits a profile, they expect the next screen to show the edit. That does not require strong consistency across the whole system. It requires routing that user's read to a source that has seen their write, or carrying a version token the read can wait for. The promise is scoped to one person, which makes it affordable.",
      },
      { type: "h2", text: "Eventual is not a synonym for careless" },
      {
        type: "p",
        text: "Eventual consistency promises convergence, not a time. A feed may take ten seconds to show a new post; a payment status may take a minute. If the product says 'processing', the user can reason about it. If the product says 'paid' before the ledger agrees, you have made a promise the system cannot keep.",
      },
      {
        type: "ul",
        items: [
          "Name the stale window and show it in the interface when it matters.",
          "Make writes idempotent so retries do not create duplicate effects.",
          "Give the user a status surface for work that completes asynchronously.",
        ],
      },
      { type: "h2", text: "CAP is narrower than the slogan" },
      {
        type: "p",
        text: "CAP says that during a network partition a system cannot guarantee both availability and strong consistency for the same operation. It does not say you must choose one forever. Most systems mix per-operation choices: a like count can be eventually consistent, while a seat reservation cannot.",
      },
      {
        type: "p",
        text: "The useful design move is to write the promise on the whiteboard next to the operation. If the room cannot agree on the promise, the architecture is not the disagreement.",
      },
    ],
  },
  {
    slug: "your-first-system-design-interview",
    title: "Your first system design interview",
    excerpt:
      "A calm, repeatable 45-minute loop that trades memorised diagrams for visible reasoning.",
    category: "Interview",
    track: "System Design",
    readTime: 6,
    date: "2026-10-08",
    displayDate: "8 Oct 2026",
    accent: "amber",
    glyph: "45",
    blocks: [
      {
        type: "p",
        text: "A system design interview is not a test of whether you know the canonical diagram for a chat app. It is a test of whether you can turn an ambiguous prompt into a bounded problem, make trade-offs explicit, and notice what breaks.",
      },
      { type: "h2", text: "The first five minutes" },
      {
        type: "p",
        text: "Do not draw. Ask who the users are, what the core action is, how often it happens, and which requirement is hardest. Write the answers down. Repeat the scope back in one sentence. This is the cheapest place to prevent a forty-minute misunderstanding.",
      },
      { type: "h2", text: "The middle" },
      {
        type: "ul",
        items: [
          "Estimate the read and write rate; you are choosing a shape, not proving arithmetic.",
          "Draw one end-to-end path before adding caches or queues.",
          "Define the API and the data model at a level that exposes the hard part.",
          "Choose one component to go deep on, and say why you chose it.",
        ],
      },
      { type: "h2", text: "Break it on purpose" },
      {
        type: "p",
        text: "Say what happens when the cache is cold, the queue is behind, the primary dies, or a celebrity joins. Every design has a failure mode; naming yours is more convincing than pretending it does not. Finish with the trade-offs you accepted and the metric you would watch.",
      },
      {
        type: "quote",
        text: "The interviewer cannot see your memory. They can see your reasoning. Make it visible.",
      },
      {
        type: "p",
        text: "Practise the loop on one case study. Set a timer for 45 minutes, use the board, and stop at the end. The goal of the first attempt is not a perfect design; it is a complete path you can improve.",
      },
    ],
  },
  {
    slug: "big-o-without-the-math-anxiety",
    title: "Big-O without the math anxiety",
    excerpt:
      "Grow rates, dropped constants and the three questions that tell you the complexity of almost anything.",
    category: "Foundations",
    readTime: 6,
    date: "2026-10-12",
    displayDate: "12 Oct 2026",
    track: "DSA",
    accent: "green",
    glyph: "Σ",
    blocks: [
      {
        type: "p",
        text: "Big-O is not a measurement. It is a promise about how the work grows when the input grows. You do not need calculus to read it; you need to notice loops, halving and extra memory.",
      },
      { type: "h2", text: "Growth, not stopwatch" },
      {
        type: "p",
        text: "A single loop over n items is O(n). A loop inside another loop is O(n²), because each item triggers a full pass. A loop that throws away half the remaining items is O(log n). These three shapes cover most interview code.",
      },
      {
        type: "quote",
        text: "Ask what happens when n doubles. If the work doubles, it is linear. If it quadruples, it is quadratic.",
      },
      { type: "h2", text: "The three questions" },
      {
        type: "ul",
        items: [
          "How many times does the input get touched? That is the dominant loop.",
          "Does the input shrink by a constant factor, or by one element? Shrinking by half means a logarithm.",
          "Do you allocate a structure that can grow with n? That is your space cost.",
        ],
      },
      { type: "h2", text: "A quick example" },
      {
        type: "code",
        language: "Python",
        code: `def pair_exists(nums, target):
    seen = set()
    for n in nums:          # one pass
        if target - n in seen:
            return True
        seen.add(n)         # O(1) average
    return False`,
      },
      {
        type: "p",
        text: "One pass, constant-time set operations, one set that can hold every value: O(n) time and O(n) space. The nested-loop alternative would be O(n²) time and O(1) space. Neither is universally better; the constraint decides.",
      },
      { type: "h2", text: "What to ignore" },
      {
        type: "p",
        text: "Drop constants and lower-order terms. O(2n + 7) is O(n). O(n² + n) is O(n²). This is not sloppiness; it is the point. Constants matter in real systems, but they are a separate conversation from growth.",
      },
      {
        type: "p",
        text: "When you are unsure, write down the number of operations as a function of n and simplify. That is enough for almost every interview.",
      },
    ],
  },
  {
    slug: "one-sliding-window-template",
    title: "One sliding-window template, many problems",
    excerpt:
      "The two pointers, when the window grows, and the exact moment you should shrink it.",
    category: "Arrays",
    readTime: 9,
    date: "2026-10-05",
    displayDate: "5 Oct 2026",
    track: "DSA",
    accent: "blue",
    glyph: "{ }",
    blocks: [
      {
        type: "p",
        text: "Sliding windows feel like a bag of tricks until you see the invariant. A window is just a contiguous range that maintains a property. The algorithm grows the right edge and shrinks the left edge only when the property breaks.",
      },
      { type: "h2", text: "When a window fits" },
      {
        type: "ul",
        items: [
          "The answer is about a contiguous subarray or substring.",
          "Adding an element is easy to track; removing the leftmost element is also easy.",
          "The property is monotonic: once the window is invalid, adding more cannot fix it.",
        ],
      },
      { type: "h2", text: "The template" },
      {
        type: "code",
        language: "Python",
        code: `def longest_unique(s):
    last = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best`,
      },
      {
        type: "p",
        text: "The invariant is simple: the window s[left:right+1] has no repeated characters. When a duplicate appears, jump the left edge just past its previous position. The window never moves backward, so the total work is linear.",
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "ul",
        items: [
          "Shrinking with a while loop when a direct jump is possible. Both can be correct, but know which one you are writing.",
          "Forgetting to update the best answer after the shrink, not before.",
          "Using a window when the problem is not contiguous. Subsequences are a different family.",
        ],
      },
      {
        type: "p",
        text: "Practice the template on three questions: longest substring without repeats, minimum window containing a set of characters, and maximum sum of size k. Same skeleton, different state.",
      },
    ],
  },
  {
    slug: "how-to-actually-finish-a-roadmap",
    title: "How to actually finish a DSA roadmap",
    excerpt:
      "Make the path smaller than your motivation. A weekly loop that survives bad weeks.",
    category: "Strategy",
    readTime: 5,
    date: "2026-09-28",
    displayDate: "28 Sep 2026",
    track: "DSA",
    accent: "amber",
    glyph: "◍",
    blocks: [
      {
        type: "p",
        text: "Most roadmaps fail for a boring reason: they are designed for the version of you with free evenings and high motivation. That version does not show up every week. The plan has to survive the ordinary version.",
      },
      { type: "h2", text: "Make the path smaller" },
      {
        type: "p",
        text: "Do not plan to finish graphs this month. Plan to check one topic and solve one problem this week. A module is a container, not a deadline. The only unit that matters is the next check.",
      },
      { type: "h2", text: "The weekly loop" },
      {
        type: "ul",
        items: [
          "Pick one module and read its mental model once.",
          "Check two topics you can explain out loud.",
          "Solve one problem without looking at the solution for 20 minutes.",
          "Write one sentence about what confused you.",
        ],
      },
      {
        type: "p",
        text: "That is a 90-minute week. It is small enough to repeat and large enough to compound. If you have more time, repeat the loop; do not redesign it.",
      },
      { type: "h2", text: "Track evidence, not mood" },
      {
        type: "p",
        text: "A checked topic is evidence. A solved problem is evidence. Watching three videos is input, not evidence. Keep the scoreboard boring: topics checked, problems attempted, questions written down.",
      },
      {
        type: "quote",
        text: "Bad weeks are data, not verdicts. Shrink the next week until it is possible again.",
      },
      { type: "h2", text: "Start with 20 minutes" },
      {
        type: "p",
        text: "Open the roadmap, pick the first unchecked topic, and set a timer for 20 minutes. You are allowed to stop when it rings. Finishing the roadmap is a side effect of being willing to start badly.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
