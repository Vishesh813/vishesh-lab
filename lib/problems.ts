export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProblemExample = {
  input: string;
  output: string;
  note?: string;
};

export type Problem = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  summary: string;
  statement: string;
  examples: ProblemExample[];
  constraints: string[];
  hints: string[];
  moduleSlug: string;
  time: string;
  space: string;
};

export const problems: Problem[] = [
  {
    slug: "pair-sum",
    title: "Pair with target sum",
    difficulty: "Easy",
    tags: ["Arrays", "Two pointers", "Hashing"],
    summary:
      "Return the indices of two numbers in a sorted array that add up to a target.",
    statement:
      "You are given an array of integers sorted in ascending order and an integer target. Return the indices of the two numbers that add up to target. Each input has exactly one solution, and you may not use the same element twice. Return the indices in ascending order.",
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", note: "2 + 7 = 9." },
      { input: "nums = [-3, 2, 4, 8], target = 5", output: "[1, 2]", note: "2 + 4 = 5." },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 100,000",
      "nums is sorted in ascending order",
      "Exactly one valid pair exists",
      "Index pairs are 0-based",
    ],
    hints: [
      "Because the array is sorted, the smallest and largest values bound every possible sum.",
      "Move the left pointer right when the sum is too small.",
      "Move the right pointer left when the sum is too large.",
    ],
    moduleSlug: "arrays",
    time: "O(n)",
    space: "O(1)",
  },
  {
    slug: "longest-unique-substring",
    title: "Longest unique substring",
    difficulty: "Medium",
    tags: ["Strings", "Sliding window"],
    summary:
      "Find the length of the longest substring that contains no repeated characters.",
    statement:
      "Given a string s, return the length of the longest substring that does not contain repeating characters. A substring is a contiguous sequence of characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", note: 'The answer is "abc".' },
      { input: 's = "bbbbb"', output: "1", note: 'The answer is "b".' },
      { input: 's = "pwwkew"', output: "3", note: 'The answer is "wke".' },
    ],
    constraints: [
      "0 ≤ s.length ≤ 100,000",
      "s contains printable ASCII characters",
    ],
    hints: [
      "Maintain a window with no duplicates.",
      "Store the last index of each character.",
      "When a duplicate appears, move the left edge past its previous position.",
    ],
    moduleSlug: "strings",
    time: "O(n)",
    space: "O(k)",
  },
  {
    slug: "generate-subsets",
    title: "Generate all subsets",
    difficulty: "Medium",
    tags: ["Recursion", "Backtracking"],
    summary:
      "Return every possible subset of an array of distinct integers.",
    statement:
      "Given an array of distinct integers, return all possible subsets (the power set). The solution must not contain duplicate subsets, and the order of the output does not matter.",
    examples: [
      {
        input: "nums = [1, 2, 3]",
        output: "[[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]",
      },
    ],
    constraints: [
      "0 ≤ nums.length ≤ 10",
      "All values in nums are distinct",
    ],
    hints: [
      "At each index you make a binary choice: include the value or skip it.",
      "Alternatively, loop from a start index and append every prefix to the result.",
      "Copy the current path before adding it; otherwise later mutations change old results.",
    ],
    moduleSlug: "backtracking",
    time: "O(2ⁿ)",
    space: "O(n)",
  },
  {
    slug: "reverse-linked-list",
    title: "Reverse a linked list",
    difficulty: "Easy",
    tags: ["Linked list", "Pointers"],
    summary:
      "Reverse a singly linked list in one pass and return the new head.",
    statement:
      "Given the head of a singly linked list, reverse the list and return the new head. Aim for O(1) extra space.",
    examples: [
      { input: "head = 1 → 2 → 3 → null", output: "3 → 2 → 1 → null" },
      { input: "head = null", output: "null" },
    ],
    constraints: [
      "0 ≤ number of nodes ≤ 100,000",
      "Node values fit in a signed 32-bit integer",
    ],
    hints: [
      "Keep three pointers: previous, current and next.",
      "Save next before rewiring current.next.",
      "When current becomes null, previous is the new head.",
    ],
    moduleSlug: "linked-lists",
    time: "O(n)",
    space: "O(1)",
  },
  {
    slug: "kth-smallest-bst",
    title: "Kth smallest in a BST",
    difficulty: "Medium",
    tags: ["Trees", "BST", "Inorder"],
    summary:
      "Use the ordering of a binary search tree to find the kth smallest value.",
    statement:
      "Given the root of a binary search tree and an integer k, return the kth smallest value in the tree. k is 1-indexed.",
    examples: [
      {
        input: "root = [3, 1, 4, null, 2], k = 1",
        output: "1",
        note: "Inorder traversal gives 1, 2, 3, 4.",
      },
      {
        input: "root = [5, 3, 6, 2, 4, null, null, 1], k = 3",
        output: "3",
      },
    ],
    constraints: [
      "1 ≤ k ≤ number of nodes ≤ 10,000",
      "Node values are unique",
    ],
    hints: [
      "An inorder traversal of a BST visits values in sorted order.",
      "You can stop as soon as you visit the kth node.",
      "An iterative stack avoids recursion depth limits.",
    ],
    moduleSlug: "binary-search-tree",
    time: "O(h + k)",
    space: "O(h)",
  },
  {
    slug: "prerequisite-order",
    title: "Prerequisite order",
    difficulty: "Hard",
    tags: ["Graphs", "Topological sort", "Cycles"],
    summary:
      "Decide whether every module can be completed given a set of prerequisites.",
    statement:
      "There are numModules modules labelled from 0 to numModules - 1. You are given prerequisites where prerequisites[i] = [a, b] means you must take b before a. Return true if you can finish all modules, otherwise false.",
    examples: [
      { input: "numModules = 2, prerequisites = [[1, 0]]", output: "true" },
      {
        input: "numModules = 2, prerequisites = [[1, 0], [0, 1]]",
        output: "false",
        note: "The prerequisites form a cycle.",
      },
    ],
    constraints: [
      "1 ≤ numModules ≤ 2,000",
      "0 ≤ prerequisites.length ≤ 5,000",
      "All prerequisite pairs are unique",
    ],
    hints: [
      "Model modules as nodes and prerequisites as directed edges.",
      "A schedule exists exactly when the graph has no directed cycle.",
      "Kahn's algorithm repeatedly removes nodes with indegree zero.",
    ],
    moduleSlug: "graphs",
    time: "O(V + E)",
    space: "O(V + E)",
  },
  {
    slug: "house-robber",
    title: "House robber",
    difficulty: "Medium",
    tags: ["Dynamic programming", "Arrays"],
    summary:
      "Maximise the loot without robbing two adjacent houses.",
    statement:
      "Given an array of non-negative integers representing the money in each house, return the maximum amount you can rob without robbing two adjacent houses.",
    examples: [
      { input: "nums = [2, 7, 9, 3, 1]", output: "12", note: "Rob houses 0, 2 and 4." },
      { input: "nums = [2, 7, 9, 3, 1, 2]", output: "13" },
    ],
    constraints: ["0 ≤ nums.length ≤ 100,000", "0 ≤ nums[i] ≤ 1,000"],
    hints: [
      "At each house, choose between skipping it and robbing it plus the best result two houses back.",
      "Track two values: best up to the previous house and best up to the one before that.",
      "The order of the tuple assignment matters; update both values together.",
    ],
    moduleSlug: "dynamic-programming",
    time: "O(n)",
    space: "O(1)",
  },
  {
    slug: "top-k-frequent",
    title: "Top K frequent elements",
    difficulty: "Medium",
    tags: ["Heaps", "Hashing", "Bucket sort"],
    summary:
      "Return the k most frequent values in an array, faster than sorting everything.",
    statement:
      "Given an integer array nums and an integer k, return the k most frequent elements. The answer may be returned in any order.",
    examples: [
      { input: "nums = [1, 1, 1, 2, 2, 3], k = 2", output: "[1, 2]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 100,000",
      "1 ≤ k ≤ number of distinct elements",
    ],
    hints: [
      "Count frequencies with a hash map first.",
      "A min-heap of size k keeps only the current best candidates.",
      "Bucket sort by frequency gives O(n) time when frequencies are bounded by n.",
    ],
    moduleSlug: "heaps",
    time: "O(n log k)",
    space: "O(n)",
  },
];

export function getProblem(slug: string) {
  return problems.find((problem) => problem.slug === slug);
}

export function problemsForModule(moduleSlug: string) {
  return problems.filter((problem) => problem.moduleSlug === moduleSlug);
}
