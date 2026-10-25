export type NodePosition = {
  id: string;
  x: number;
  y: number;
};

export const GRAPH_WIDTH = 1000;
export const GRAPH_HEIGHT = 1324;
export const NODE_WIDTH = 176;
export const NODE_HEIGHT = 104;

/**
 * Dependency layout for the DSA roadmap. Coordinates are in the graph's
 * 1000 × 1324 space, with the top edge of each node at `y`.
 */
export const nodePositions: NodePosition[] = [
  { id: "programming-foundations", x: 500, y: 0 },
  { id: "time-and-space-complexity", x: 500, y: 150 },
  { id: "arrays", x: 500, y: 300 },
  { id: "strings", x: 300, y: 450 },
  { id: "hashing", x: 700, y: 450 },
  { id: "recursion", x: 100, y: 600 },
  { id: "backtracking", x: 300, y: 600 },
  { id: "linked-lists", x: 500, y: 600 },
  { id: "stacks", x: 700, y: 600 },
  { id: "queues", x: 900, y: 600 },
  { id: "sorting-and-searching", x: 500, y: 750 },
  { id: "trees", x: 300, y: 900 },
  { id: "binary-search-tree", x: 700, y: 900 },
  { id: "heaps", x: 100, y: 1050 },
  { id: "tries", x: 500, y: 1050 },
  { id: "graphs", x: 900, y: 1050 },
  { id: "dynamic-programming", x: 500, y: 1200 },
];

export const graphEdges: Array<[string, string]> = [
  ["programming-foundations", "time-and-space-complexity"],
  ["time-and-space-complexity", "arrays"],
  ["arrays", "strings"],
  ["arrays", "hashing"],
  ["strings", "recursion"],
  ["strings", "backtracking"],
  ["hashing", "linked-lists"],
  ["hashing", "stacks"],
  ["hashing", "queues"],
  ["recursion", "sorting-and-searching"],
  ["backtracking", "sorting-and-searching"],
  ["linked-lists", "sorting-and-searching"],
  ["stacks", "sorting-and-searching"],
  ["queues", "sorting-and-searching"],
  ["sorting-and-searching", "trees"],
  ["sorting-and-searching", "binary-search-tree"],
  ["trees", "heaps"],
  ["trees", "tries"],
  ["binary-search-tree", "graphs"],
  ["heaps", "dynamic-programming"],
  ["tries", "dynamic-programming"],
  ["graphs", "dynamic-programming"],
];

export type RoadmapNodeMeta = {
  id: string;
  phase: string;
  blurb: string;
};

/**
 * Maps graph nodes to the phase names used by the lesson data. Keeping this
 * separate from positions lets the graph stay a pure layout module.
 */
export const roadmapNodeMeta: RoadmapNodeMeta[] = [
  {
    id: "programming-foundations",
    phase: "Programming Foundations",
    blurb: "Variables, types, control flow, classes and memory.",
  },
  {
    id: "time-and-space-complexity",
    phase: "Time and Space Complexity",
    blurb: "Big-O, growth rates and the cost of recursion.",
  },
  {
    id: "arrays",
    phase: "Arrays",
    blurb: "Indexing, traversal and in-place updates.",
  },
  {
    id: "strings",
    phase: "Strings",
    blurb: "Character sequences, builders and two pointers.",
  },
  {
    id: "hashing",
    phase: "Hashing",
    blurb: "Hash maps, sets, collisions and frequency counts.",
  },
  {
    id: "recursion",
    phase: "Recursion",
    blurb: "Base cases, call stacks and divide-and-conquer.",
  },
  {
    id: "backtracking",
    phase: "Backtracking",
    blurb: "Choose, explore, undo — decision trees with pruning.",
  },
  {
    id: "linked-lists",
    phase: "Linked List",
    blurb: "Pointer surgery, fast/slow pointers and reversal.",
  },
  {
    id: "stacks",
    phase: "Stack",
    blurb: "LIFO, monotonic stacks and bracket matching.",
  },
  {
    id: "queues",
    phase: "Queue",
    blurb: "FIFO, deques and breadth-first traversal.",
  },
  {
    id: "sorting-and-searching",
    phase: "Sorting & Searching",
    blurb: "Ordering, binary search and the cost of stability.",
  },
  {
    id: "trees",
    phase: "Trees",
    blurb: "Traversal, depth, recursion and tree structure.",
  },
  {
    id: "binary-search-tree",
    phase: "Binary Search Tree",
    blurb: "Ordered insertion, lookup and deletion.",
  },
  {
    id: "heaps",
    phase: "Heap and Priority Queue",
    blurb: "Top-k, scheduling and the heap invariant.",
  },
  {
    id: "tries",
    phase: "Trie",
    blurb: "Prefix trees for autocomplete and word search.",
  },
  {
    id: "graphs",
    phase: "Graphs",
    blurb: "BFS, DFS, topological order and shortest paths.",
  },
  {
    id: "dynamic-programming",
    phase: "Dynamic Programming",
    blurb: "Overlapping subproblems, memo and tabulation.",
  },
];

export const graphNodeMap = new Map(
  nodePositions.map((position) => [position.id, position]),
);

export function edgePath(fromId: string, toId: string) {
  const from = graphNodeMap.get(fromId);
  const to = graphNodeMap.get(toId);
  if (!from || !to) return "";

  const x1 = from.x;
  const y1 = from.y + NODE_HEIGHT;
  const x2 = to.x;
  // Stop just above the destination node so the arrowhead stays visible.
  const y2 = to.y - 10;
  const curve = Math.max(36, (y2 - y1) * 0.45);

  return `M ${x1} ${y1} C ${x1} ${y1 + curve}, ${x2} ${y2 - curve}, ${x2} ${y2}`;
}
