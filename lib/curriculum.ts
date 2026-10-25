export type CodeSample = {
  language: string;
  filename: string;
  code: string;
};

export type ComplexityRow = {
  operation: string;
  time: string;
  space: string;
};

export type Reference = {
  label: string;
  href: string;
};

export type Module = {
  slug: string;
  step: number;
  title: string;
  phase: "Foundations" | "Core structures" | "Algorithms" | "Advanced";
  minutes: number;
  summary: string;
  mentalModel: string;
  ideas: string[];
  topics: string[];
  complexity: ComplexityRow[];
  code: CodeSample;
  practice: string[];
  refs: Reference[];
};

export const modules: Module[] = [
  {
    slug: "programming-foundations",
    step: 1,
    title: "Programming Foundations",
    phase: "Foundations",
    minutes: 25,
    summary:
      "The small set of programming ideas every data structure relies on: values, control flow, functions and collections.",
    mentalModel:
      "A program is a sequence of decisions over values. If you can trace a loop by hand, you can trace an algorithm.",
    ideas: [
      "Variables hold values; types decide which operations are valid.",
      "Loops repeat work, and the number of repeats becomes your first cost estimate.",
      "Functions isolate a job and give you a name for it.",
      "Arrays and strings are the default containers for almost every problem.",
    ],
    topics: [
      "Variables and types",
      "Conditionals and loops",
      "Functions and scope",
      "Arrays and strings",
      "Reading a stack trace",
    ],
    complexity: [
      { operation: "Read an array index", time: "O(1)", space: "O(1)" },
      { operation: "Single loop", time: "O(n)", space: "O(1)" },
      { operation: "Nested loops", time: "O(n²)", space: "O(1)" },
      { operation: "Recursive call chain", time: "O(calls)", space: "O(depth)" },
    ],
    code: {
      language: "Java",
      filename: "Sum.java",
      code: `int sum(int[] nums) {
    int total = 0;
    for (int n : nums) {
        total += n;
    }
    return total;
}`,
    },
    practice: [],
    refs: [
      {
        label: "MDN — JavaScript first steps",
        href: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting",
      },
      { label: "The Python tutorial", href: "https://docs.python.org/3/tutorial/" },
    ],
  },
  {
    slug: "time-and-space-complexity",
    step: 2,
    title: "Time & Space Complexity",
    phase: "Foundations",
    minutes: 30,
    summary:
      "A practical way to compare algorithms without counting every instruction: focus on how work grows as the input grows.",
    mentalModel:
      "Big-O is a ceiling on growth. Drop constants, keep the dominant term, and ask what happens when n doubles.",
    ideas: [
      "Big-O describes an upper bound, not a stopwatch reading.",
      "Nested loops multiply; sequential loops add.",
      "Recursion costs depend on the number of calls and the depth of the stack.",
      "Space complexity includes the input only when you allocate new structures.",
    ],
    topics: [
      "Big-O notation",
      "Big-Theta and Big-Omega",
      "Amortised analysis",
      "Space complexity",
      "Reading complexity from code",
    ],
    complexity: [
      { operation: "Hash map lookup (average)", time: "O(1)", space: "O(n)" },
      { operation: "Binary search", time: "O(log n)", space: "O(1)" },
      { operation: "Sorting", time: "O(n log n)", space: "O(n)" },
      { operation: "All pairs", time: "O(n²)", space: "O(1)" },
    ],
    code: {
      language: "Python",
      filename: "pair_exists.py",
      code: `def pair_exists(nums, target):
    seen = set()
    for n in nums:
        if target - n in seen:
            return True
        seen.add(n)
    return False`,
    },
    practice: [],
    refs: [
      { label: "Big-O cheat sheet", href: "https://www.bigocheatsheet.com/" },
      { label: "CP-Algorithms — complexity", href: "https://cp-algorithms.com/" },
    ],
  },
  {
    slug: "arrays",
    step: 3,
    title: "Arrays",
    phase: "Foundations",
    minutes: 40,
    summary:
      "Contiguous memory gives you instant indexing and painful insertions. Two pointers and sliding windows turn many quadratic scans into linear ones.",
    mentalModel:
      "An array is a row of numbered boxes. Moving a pointer is cheap; shifting every box is not.",
    ideas: [
      "Random access is O(1); inserting in the middle is O(n).",
      "Two pointers work when the data is ordered or can be ordered.",
      "A sliding window keeps a running answer instead of recomputing it.",
      "Prefix sums trade O(n) memory for O(1) range queries.",
    ],
    topics: [
      "Traversal and indexing",
      "Two pointers",
      "Sliding window",
      "Prefix sums",
      "In-place updates",
    ],
    complexity: [
      { operation: "Index access", time: "O(1)", space: "O(1)" },
      { operation: "Linear scan", time: "O(n)", space: "O(1)" },
      { operation: "Insert / delete middle", time: "O(n)", space: "O(1)" },
      { operation: "Prefix sum build", time: "O(n)", space: "O(n)" },
    ],
    code: {
      language: "Java",
      filename: "PairSum.java",
      code: `int[] pairSum(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return new int[]{left, right};
        if (sum < target) left++;
        else right--;
    }
    return new int[]{-1, -1};
}`,
    },
    practice: ["pair-sum", "longest-unique-substring"],
    refs: [
      { label: "Visualgo — array", href: "https://visualgo.net/en/list" },
      {
        label: "MDN — Array",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
      },
    ],
  },
  {
    slug: "strings",
    step: 4,
    title: "Strings",
    phase: "Core structures",
    minutes: 35,
    summary:
      "Strings are arrays with character semantics. Palindromes, anagrams and pattern matching are the three shapes worth recognising.",
    mentalModel:
      "Most string problems are array problems with a character alphabet. Decide whether order matters before choosing a structure.",
    ideas: [
      "Two pointers handle palindromes and reversals.",
      "Frequency maps turn anagram checks into O(n) comparisons.",
      "Sliding windows handle longest/shortest substring questions.",
      "Naive pattern matching is O(n·m); KMP is the linear upgrade.",
    ],
    topics: [
      "Character access",
      "Palindromes",
      "Anagrams",
      "Sliding windows",
      "Pattern matching",
    ],
    complexity: [
      { operation: "Index a character", time: "O(1)", space: "O(1)" },
      { operation: "Concatenate (immutable)", time: "O(n + m)", space: "O(n + m)" },
      { operation: "Frequency count", time: "O(n)", space: "O(k)" },
      { operation: "Naive substring search", time: "O(n·m)", space: "O(1)" },
    ],
    code: {
      language: "Python",
      filename: "palindrome.py",
      code: `def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
    },
    practice: ["longest-unique-substring"],
    refs: [
      {
        label: "CP-Algorithms — string hashing",
        href: "https://cp-algorithms.com/string/string-hashing.html",
      },
      {
        label: "MDN — String",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
      },
    ],
  },
  {
    slug: "hashing",
    step: 5,
    title: "Hashing",
    phase: "Core structures",
    minutes: 35,
    summary:
      "Hash maps turn membership and counting into near-constant work. They are the most common way to remove a nested loop.",
    mentalModel:
      "A hash map is a labelled shelf: you compute a label from the key and jump straight to the bucket.",
    ideas: [
      "Use a map when you need to remember something you have already seen.",
      "Use a set when you only need membership.",
      "Average O(1) depends on a good hash and load factor.",
      "Store the index, not just the value, when positions matter.",
    ],
    topics: [
      "Hash maps",
      "Sets",
      "Frequency counting",
      "Collision basics",
      "Trade-offs vs sorting",
    ],
    complexity: [
      { operation: "Insert / lookup (average)", time: "O(1)", space: "O(n)" },
      { operation: "Worst case lookup", time: "O(n)", space: "O(n)" },
      { operation: "Frequency count", time: "O(n)", space: "O(k)" },
      { operation: "Sort then scan", time: "O(n log n)", space: "O(1)" },
    ],
    code: {
      language: "Python",
      filename: "two_sum.py",
      code: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], i]
        seen[n] = i
    return [-1, -1]`,
    },
    practice: ["pair-sum", "top-k-frequent"],
    refs: [
      { label: "Visualgo — hash table", href: "https://visualgo.net/en/hashtable" },
      {
        label: "CP-Algorithms — string hashing",
        href: "https://cp-algorithms.com/string/string-hashing.html",
      },
    ],
  },
  {
    slug: "recursion",
    step: 6,
    title: "Recursion",
    phase: "Core structures",
    minutes: 40,
    summary:
      "Solve a problem by solving a smaller copy of itself. The skill is defining the base case and trusting the recursive step.",
    mentalModel:
      "Every recursive call is a frame on a stack. If you can describe the smaller problem in one sentence, the code is usually short.",
    ideas: [
      "A base case must stop every path.",
      "The recursive step must move toward the base case.",
      "The call stack costs memory; deep recursion can overflow.",
      "Divide and conquer splits the input, then combines results.",
    ],
    topics: [
      "Base cases",
      "The call stack",
      "Divide and conquer",
      "Recursion trees",
      "Converting to iteration",
    ],
    complexity: [
      { operation: "Factorial", time: "O(n)", space: "O(n)" },
      { operation: "Binary search (recursive)", time: "O(log n)", space: "O(log n)" },
      { operation: "Merge sort", time: "O(n log n)", space: "O(n)" },
      { operation: "Naive Fibonacci", time: "O(2ⁿ)", space: "O(n)" },
    ],
    code: {
      language: "Python",
      filename: "factorial.py",
      code: `def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    },
    practice: ["generate-subsets"],
    refs: [
      { label: "Visualgo — recursion", href: "https://visualgo.net/en/recursion" },
      { label: "CP-Algorithms", href: "https://cp-algorithms.com/" },
    ],
  },
  {
    slug: "backtracking",
    step: 7,
    title: "Backtracking",
    phase: "Core structures",
    minutes: 45,
    summary:
      "Recursion with an undo button. Choose a candidate, explore, then remove it and try the next one.",
    mentalModel:
      "You are walking a decision tree. The path array is your current choice; popping it is the undo.",
    ideas: [
      "Build candidates incrementally and prune impossible branches early.",
      "The path must be copied when added to results.",
      "Sorting first makes duplicate-skipping possible.",
      "N-Queens is the canonical pruning exercise.",
    ],
    topics: [
      "Subsets",
      "Permutations",
      "Combination sum",
      "Pruning",
      "N-Queens",
    ],
    complexity: [
      { operation: "All subsets", time: "O(2ⁿ)", space: "O(n)" },
      { operation: "All permutations", time: "O(n!)", space: "O(n)" },
      { operation: "N-Queens", time: "O(n!)", space: "O(n)" },
      { operation: "Path copy per result", time: "O(n) each", space: "O(n)" },
    ],
    code: {
      language: "Python",
      filename: "subsets.py",
      code: `def subsets(nums):
    result = []
    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result`,
    },
    practice: ["generate-subsets"],
    refs: [
      { label: "Visualgo — recursion", href: "https://visualgo.net/en/recursion" },
      { label: "CP-Algorithms", href: "https://cp-algorithms.com/" },
    ],
  },
  {
    slug: "linked-lists",
    step: 8,
    title: "Linked Lists",
    phase: "Core structures",
    minutes: 35,
    summary:
      "Nodes connected by pointers. You lose random access, but gain O(1) insertion at a known position.",
    mentalModel:
      "Follow the next pointer like a treasure hunt. Keep a previous pointer whenever you need to rewire edges.",
    ideas: [
      "Always draw the pointers before writing the code.",
      "Reversing a list needs three pointers: prev, current, next.",
      "Fast and slow pointers detect cycles and find midpoints.",
      "Dummy heads remove edge cases at the front.",
    ],
    topics: [
      "Singly and doubly linked lists",
      "Traversal",
      "Reversal",
      "Fast and slow pointers",
      "Merge and remove",
    ],
    complexity: [
      { operation: "Access by index", time: "O(n)", space: "O(1)" },
      { operation: "Insert at head", time: "O(1)", space: "O(1)" },
      { operation: "Search", time: "O(n)", space: "O(1)" },
      { operation: "Reverse", time: "O(n)", space: "O(1)" },
    ],
    code: {
      language: "Python",
      filename: "reverse_list.py",
      code: `def reverse_list(head):
    prev = None
    while head:
        nxt = head.next
        head.next = prev
        prev = head
        head = nxt
    return prev`,
    },
    practice: ["reverse-linked-list"],
    refs: [
      { label: "Visualgo — linked list", href: "https://visualgo.net/en/list" },
      { label: "CP-Algorithms", href: "https://cp-algorithms.com/" },
    ],
  },
  {
    slug: "stacks",
    step: 9,
    title: "Stacks",
    phase: "Core structures",
    minutes: 30,
    summary:
      "Last in, first out. Stacks model nesting, undo, and the call stack itself. Monotonic stacks solve next-greater questions in one pass.",
    mentalModel:
      "A stack is a pile of plates: only the top is reachable. If a problem has nested structure, try a stack.",
    ideas: [
      "Push and pop are O(1).",
      "Balanced parentheses is the hello-world of stacks.",
      "A monotonic stack keeps candidates in sorted order.",
      "The call stack is why recursion depth matters.",
    ],
    topics: [
      "LIFO behaviour",
      "Balanced parentheses",
      "Monotonic stack",
      "Expression evaluation",
      "Stack vs recursion",
    ],
    complexity: [
      { operation: "Push / pop", time: "O(1)", space: "O(1)" },
      { operation: "Balanced parentheses", time: "O(n)", space: "O(n)" },
      { operation: "Next greater element", time: "O(n)", space: "O(n)" },
      { operation: "Expression evaluation", time: "O(n)", space: "O(n)" },
    ],
    code: {
      language: "Python",
      filename: "valid_parentheses.py",
      code: `def is_valid(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack`,
    },
    practice: [],
    refs: [
      { label: "Visualgo — stack", href: "https://visualgo.net/en/list" },
      { label: "CP-Algorithms", href: "https://cp-algorithms.com/" },
    ],
  },
  {
    slug: "queues",
    step: 10,
    title: "Queues",
    phase: "Core structures",
    minutes: 30,
    summary:
      "First in, first out. Queues power breadth-first search, scheduling and sliding-window maxima.",
    mentalModel:
      "A queue is a line: arrivals join at the back, service happens at the front. Never shift an array; use a deque.",
    ideas: [
      "Enqueue and dequeue are O(1) with a deque.",
      "BFS uses a queue to process level by level.",
      "A monotonic deque maintains sliding-window maxima.",
      "A circular buffer avoids reallocating memory.",
    ],
    topics: [
      "FIFO behaviour",
      "Circular queue",
      "Deque",
      "BFS queue",
      "Sliding-window maximum",
    ],
    complexity: [
      { operation: "Enqueue / dequeue", time: "O(1)", space: "O(1)" },
      { operation: "BFS", time: "O(V + E)", space: "O(V)" },
      { operation: "Sliding-window max", time: "O(n)", space: "O(k)" },
      { operation: "Array shift", time: "O(n)", space: "O(1)" },
    ],
    code: {
      language: "Python",
      filename: "bfs.py",
      code: `from collections import deque

def bfs(graph, start):
    queue = deque([start])
    seen = {start}
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                queue.append(nxt)
    return order`,
    },
    practice: [],
    refs: [
      { label: "Visualgo — queue", href: "https://visualgo.net/en/list" },
      { label: "CP-Algorithms — BFS", href: "https://cp-algorithms.com/graph/breadth-first-search.html" },
    ],
  },
  {
    slug: "sorting-and-searching",
    step: 11,
    title: "Sorting & Searching",
    phase: "Algorithms",
    minutes: 50,
    summary:
      "Sorting unlocks two pointers, binary search and greedy scans. Binary search is the highest-leverage algorithm to know cold.",
    mentalModel:
      "Sorting buys order; order buys halving. If a search space is monotonic, binary search can find a boundary.",
    ideas: [
      "Merge sort is stable and predictable; quicksort is fast in practice.",
      "Binary search works on answers, not only arrays.",
      "Always define the invariant and the boundary update.",
      "Sorting first is often cheaper than a nested loop.",
    ],
    topics: [
      "Merge sort",
      "Quicksort",
      "Binary search",
      "Search on answer",
      "Comparator thinking",
    ],
    complexity: [
      { operation: "Merge sort", time: "O(n log n)", space: "O(n)" },
      { operation: "Quicksort (average)", time: "O(n log n)", space: "O(log n)" },
      { operation: "Quicksort (worst)", time: "O(n²)", space: "O(log n)" },
      { operation: "Binary search", time: "O(log n)", space: "O(1)" },
    ],
    code: {
      language: "Python",
      filename: "binary_search.py",
      code: `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
    },
    practice: [],
    refs: [
      { label: "Visualgo — sorting", href: "https://visualgo.net/en/sorting" },
      { label: "CP-Algorithms — binary search", href: "https://cp-algorithms.com/" },
    ],
  },
  {
    slug: "trees",
    step: 12,
    title: "Trees",
    phase: "Algorithms",
    minutes: 45,
    summary:
      "Hierarchies without cycles. Traversals are the vocabulary; depth, diameter and lowest common ancestor are the recurring questions.",
    mentalModel:
      "A tree is a recursive structure: every child is the root of a smaller tree. Write the function for one node and trust it.",
    ideas: [
      "Inorder, preorder and postorder are three orders of the same walk.",
      "Most tree answers are returned upward from children.",
      "Height and diameter differ: diameter may not pass through the root.",
      "BFS is better for level-based questions.",
    ],
    topics: [
      "Traversals",
      "Depth and height",
      "Diameter",
      "Lowest common ancestor",
      "Level-order traversal",
    ],
    complexity: [
      { operation: "Traversal", time: "O(n)", space: "O(h)" },
      { operation: "Height", time: "O(n)", space: "O(h)" },
      { operation: "Diameter", time: "O(n)", space: "O(h)" },
      { operation: "Level-order", time: "O(n)", space: "O(w)" },
    ],
    code: {
      language: "Python",
      filename: "inorder.py",
      code: `def inorder(node, out):
    if not node:
        return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)`,
    },
    practice: ["kth-smallest-bst"],
    refs: [
      { label: "Visualgo — BST", href: "https://visualgo.net/en/bst" },
      { label: "CP-Algorithms", href: "https://cp-algorithms.com/" },
    ],
  },
  {
    slug: "binary-search-tree",
    step: 13,
    title: "Binary Search Tree",
    phase: "Algorithms",
    minutes: 40,
    summary:
      "An ordered tree: everything left is smaller, everything right is larger. The ordering enables search, floor, ceil and ordered traversal.",
    mentalModel:
      "Each comparison discards half the tree — if the tree is balanced. Inorder traversal returns sorted values.",
    ideas: [
      "Search, insert and delete are O(h).",
      "Validation needs a range, not just a parent comparison.",
      "The kth smallest value is the kth node in inorder.",
      "Unbalanced insertion degenerates into a linked list.",
    ],
    topics: [
      "Insert and delete",
      "Validation",
      "Kth smallest",
      "Floor and ceil",
      "Balanced trees",
    ],
    complexity: [
      { operation: "Search", time: "O(h)", space: "O(1)" },
      { operation: "Insert", time: "O(h)", space: "O(1)" },
      { operation: "Delete", time: "O(h)", space: "O(1)" },
      { operation: "Inorder", time: "O(n)", space: "O(h)" },
    ],
    code: {
      language: "Python",
      filename: "validate_bst.py",
      code: `def is_bst(node, low=float("-inf"), high=float("inf")):
    if not node:
        return True
    if not (low < node.val < high):
        return False
    return (is_bst(node.left, low, node.val)
            and is_bst(node.right, node.val, high))`,
    },
    practice: ["kth-smallest-bst"],
    refs: [
      { label: "Visualgo — BST", href: "https://visualgo.net/en/bst" },
      { label: "CP-Algorithms", href: "https://cp-algorithms.com/" },
    ],
  },
  {
    slug: "heaps",
    step: 14,
    title: "Heaps / Priority Queue",
    phase: "Advanced",
    minutes: 40,
    summary:
      "A complete tree that always exposes the smallest or largest element. The right tool for top-k, streaming medians and scheduling.",
    mentalModel:
      "A heap is a partial order, not a sorted array. It only promises that the root is the extreme value.",
    ideas: [
      "Push and pop are O(log n); peek is O(1).",
      "Build a heap in O(n) with heapify.",
      "Keep a heap of size k for top-k questions.",
      "Two heaps maintain a running median.",
    ],
    topics: [
      "Heap property",
      "Heapify",
      "Push and pop",
      "Top-k",
      "Merge k lists",
    ],
    complexity: [
      { operation: "Peek", time: "O(1)", space: "O(1)" },
      { operation: "Push / pop", time: "O(log n)", space: "O(1)" },
      { operation: "Build heap", time: "O(n)", space: "O(n)" },
      { operation: "Top-k with size-k heap", time: "O(n log k)", space: "O(k)" },
    ],
    code: {
      language: "Python",
      filename: "kth_largest.py",
      code: `import heapq

def kth_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)
    for n in nums[k:]:
        if n > heap[0]:
            heapq.heapreplace(heap, n)
    return heap[0]`,
    },
    practice: ["top-k-frequent"],
    refs: [
      { label: "Visualgo — heap", href: "https://visualgo.net/en/heap" },
      { label: "CP-Algorithms", href: "https://cp-algorithms.com/" },
    ],
  },
  {
    slug: "tries",
    step: 15,
    title: "Tries",
    phase: "Advanced",
    minutes: 35,
    summary:
      "A prefix tree for strings. Lookup cost depends on word length, not dictionary size, which makes autocomplete and prefix queries natural.",
    mentalModel:
      "Each edge is a character; each path from the root spells a prefix. Shared prefixes share nodes.",
    ideas: [
      "Insert and search are O(m) for word length m.",
      "Store an end-of-word flag, not just children.",
      "Prefix search returns a subtree, not a single node.",
      "A bitwise trie solves maximum XOR pairs.",
    ],
    topics: [
      "Insert and search",
      "Prefix queries",
      "Autocomplete",
      "Word dictionaries",
      "Bitwise trie",
    ],
    complexity: [
      { operation: "Insert", time: "O(m)", space: "O(m)" },
      { operation: "Search", time: "O(m)", space: "O(1)" },
      { operation: "Prefix query", time: "O(m + output)", space: "O(output)" },
      { operation: "Total space", time: "—", space: "O(total characters)" },
    ],
    code: {
      language: "Python",
      filename: "trie.py",
      code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.end = True

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.end`,
    },
    practice: [],
    refs: [
      { label: "Visualgo — trie", href: "https://visualgo.net/en/trie" },
      { label: "CP-Algorithms", href: "https://cp-algorithms.com/" },
    ],
  },
  {
    slug: "graphs",
    step: 16,
    title: "Graphs",
    phase: "Advanced",
    minutes: 60,
    summary:
      "Nodes and edges model networks, dependencies and grids. BFS and DFS are the base; topological sort and shortest paths are the extensions.",
    mentalModel:
      "A graph is a set of relationships. Choose a representation first, then choose a traversal that matches the question.",
    ideas: [
      "Adjacency lists are the default representation.",
      "BFS finds shortest paths in unweighted graphs.",
      "DFS powers cycle detection and topological sort.",
      "Union-find handles connectivity and Kruskal's MST.",
    ],
    topics: [
      "Representation",
      "BFS and DFS",
      "Topological sort",
      "Shortest paths",
      "Union-find",
      "Minimum spanning tree",
    ],
    complexity: [
      { operation: "BFS / DFS", time: "O(V + E)", space: "O(V)" },
      { operation: "Dijkstra (binary heap)", time: "O((V + E) log V)", space: "O(V)" },
      { operation: "Topological sort", time: "O(V + E)", space: "O(V)" },
      { operation: "Union-find", time: "≈O(1) amortised", space: "O(V)" },
    ],
    code: {
      language: "Python",
      filename: "dfs.py",
      code: `def dfs(graph, node, seen):
    if node in seen:
        return
    seen.add(node)
    for nxt in graph[node]:
        dfs(graph, nxt, seen)`,
    },
    practice: ["prerequisite-order"],
    refs: [
      { label: "Visualgo — graph", href: "https://visualgo.net/en/graphds" },
      { label: "CP-Algorithms — graph", href: "https://cp-algorithms.com/graph/" },
    ],
  },
  {
    slug: "dynamic-programming",
    step: 17,
    title: "Dynamic Programming",
    phase: "Advanced",
    minutes: 60,
    summary:
      "Reuse overlapping subproblems instead of recomputing them. Start with a recursive definition, then memoise, then tabulate.",
    mentalModel:
      "Write the answer for the last step in terms of smaller steps. Cache it. That is the whole trick.",
    ideas: [
      "Define the state before choosing a table shape.",
      "Top-down memoisation is easiest to derive.",
      "Bottom-up tabulation can reduce space.",
      "Many 2D tables compress to two rows or two variables.",
    ],
    topics: [
      "State and transition",
      "Memoisation",
      "Tabulation",
      "Knapsack",
      "Longest increasing subsequence",
      "Grid DP",
    ],
    complexity: [
      { operation: "Climbing stairs", time: "O(n)", space: "O(1)" },
      { operation: "0/1 knapsack", time: "O(n·W)", space: "O(n·W)" },
      { operation: "Longest common subsequence", time: "O(n·m)", space: "O(n·m)" },
      { operation: "House robber", time: "O(n)", space: "O(1)" },
    ],
    code: {
      language: "Python",
      filename: "house_robber.py",
      code: `def rob(nums):
    prev, curr = 0, 0
    for n in nums:
        prev, curr = curr, max(curr, prev + n)
    return curr`,
    },
    practice: ["house-robber"],
    refs: [
      { label: "Visualgo — recursion", href: "https://visualgo.net/en/recursion" },
      {
        label: "CP-Algorithms — intro to DP",
        href: "https://cp-algorithms.com/dynamic_programming/intro-to-dp.html",
      },
    ],
  },
];

export const phases = [
  "Foundations",
  "Core structures",
  "Algorithms",
  "Advanced",
] as const;

export const totalTopics = modules.reduce(
  (total, module) => total + module.topics.length,
  0,
);

export function getModule(slug: string) {
  return modules.find((module) => module.slug === slug);
}

export function getModuleByStep(step: number) {
  return modules.find((module) => module.step === step);
}

export function getNextModule(step: number) {
  return modules.find((module) => module.step === step + 1);
}

export function getPreviousModule(step: number) {
  return modules.find((module) => module.step === step - 1);
}
