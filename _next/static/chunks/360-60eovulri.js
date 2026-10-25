(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,4068,e=>{"use strict";let t=[{slug:"programming-foundations",step:1,title:"Programming Foundations",phase:"Foundations",minutes:25,summary:"The small set of programming ideas every data structure relies on: values, control flow, functions and collections.",mentalModel:"A program is a sequence of decisions over values. If you can trace a loop by hand, you can trace an algorithm.",ideas:["Variables hold values; types decide which operations are valid.","Loops repeat work, and the number of repeats becomes your first cost estimate.","Functions isolate a job and give you a name for it.","Arrays and strings are the default containers for almost every problem."],topics:["Variables and types","Conditionals and loops","Functions and scope","Arrays and strings","Reading a stack trace"],complexity:[{operation:"Read an array index",time:"O(1)",space:"O(1)"},{operation:"Single loop",time:"O(n)",space:"O(1)"},{operation:"Nested loops",time:"O(n²)",space:"O(1)"},{operation:"Recursive call chain",time:"O(calls)",space:"O(depth)"}],code:{language:"Java",filename:"Sum.java",code:`int sum(int[] nums) {
    int total = 0;
    for (int n : nums) {
        total += n;
    }
    return total;
}`},practice:[],refs:[{label:"MDN — JavaScript first steps",href:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting"},{label:"The Python tutorial",href:"https://docs.python.org/3/tutorial/"}]},{slug:"time-and-space-complexity",step:2,title:"Time & Space Complexity",phase:"Foundations",minutes:30,summary:"A practical way to compare algorithms without counting every instruction: focus on how work grows as the input grows.",mentalModel:"Big-O is a ceiling on growth. Drop constants, keep the dominant term, and ask what happens when n doubles.",ideas:["Big-O describes an upper bound, not a stopwatch reading.","Nested loops multiply; sequential loops add.","Recursion costs depend on the number of calls and the depth of the stack.","Space complexity includes the input only when you allocate new structures."],topics:["Big-O notation","Big-Theta and Big-Omega","Amortised analysis","Space complexity","Reading complexity from code"],complexity:[{operation:"Hash map lookup (average)",time:"O(1)",space:"O(n)"},{operation:"Binary search",time:"O(log n)",space:"O(1)"},{operation:"Sorting",time:"O(n log n)",space:"O(n)"},{operation:"All pairs",time:"O(n²)",space:"O(1)"}],code:{language:"Python",filename:"pair_exists.py",code:`def pair_exists(nums, target):
    seen = set()
    for n in nums:
        if target - n in seen:
            return True
        seen.add(n)
    return False`},practice:[],refs:[{label:"Big-O cheat sheet",href:"https://www.bigocheatsheet.com/"},{label:"CP-Algorithms — complexity",href:"https://cp-algorithms.com/"}]},{slug:"arrays",step:3,title:"Arrays",phase:"Foundations",minutes:40,summary:"Contiguous memory gives you instant indexing and painful insertions. Two pointers and sliding windows turn many quadratic scans into linear ones.",mentalModel:"An array is a row of numbered boxes. Moving a pointer is cheap; shifting every box is not.",ideas:["Random access is O(1); inserting in the middle is O(n).","Two pointers work when the data is ordered or can be ordered.","A sliding window keeps a running answer instead of recomputing it.","Prefix sums trade O(n) memory for O(1) range queries."],topics:["Traversal and indexing","Two pointers","Sliding window","Prefix sums","In-place updates"],complexity:[{operation:"Index access",time:"O(1)",space:"O(1)"},{operation:"Linear scan",time:"O(n)",space:"O(1)"},{operation:"Insert / delete middle",time:"O(n)",space:"O(1)"},{operation:"Prefix sum build",time:"O(n)",space:"O(n)"}],code:{language:"Java",filename:"PairSum.java",code:`int[] pairSum(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return new int[]{left, right};
        if (sum < target) left++;
        else right--;
    }
    return new int[]{-1, -1};
}`},practice:["pair-sum","longest-unique-substring"],refs:[{label:"Visualgo — array",href:"https://visualgo.net/en/list"},{label:"MDN — Array",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"}]},{slug:"strings",step:4,title:"Strings",phase:"Core structures",minutes:35,summary:"Strings are arrays with character semantics. Palindromes, anagrams and pattern matching are the three shapes worth recognising.",mentalModel:"Most string problems are array problems with a character alphabet. Decide whether order matters before choosing a structure.",ideas:["Two pointers handle palindromes and reversals.","Frequency maps turn anagram checks into O(n) comparisons.","Sliding windows handle longest/shortest substring questions.","Naive pattern matching is O(n·m); KMP is the linear upgrade."],topics:["Character access","Palindromes","Anagrams","Sliding windows","Pattern matching"],complexity:[{operation:"Index a character",time:"O(1)",space:"O(1)"},{operation:"Concatenate (immutable)",time:"O(n + m)",space:"O(n + m)"},{operation:"Frequency count",time:"O(n)",space:"O(k)"},{operation:"Naive substring search",time:"O(n·m)",space:"O(1)"}],code:{language:"Python",filename:"palindrome.py",code:`def is_palindrome(s: str) -> bool:
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
    return True`},practice:["longest-unique-substring"],refs:[{label:"CP-Algorithms — string hashing",href:"https://cp-algorithms.com/string/string-hashing.html"},{label:"MDN — String",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"}]},{slug:"hashing",step:5,title:"Hashing",phase:"Core structures",minutes:35,summary:"Hash maps turn membership and counting into near-constant work. They are the most common way to remove a nested loop.",mentalModel:"A hash map is a labelled shelf: you compute a label from the key and jump straight to the bucket.",ideas:["Use a map when you need to remember something you have already seen.","Use a set when you only need membership.","Average O(1) depends on a good hash and load factor.","Store the index, not just the value, when positions matter."],topics:["Hash maps","Sets","Frequency counting","Collision basics","Trade-offs vs sorting"],complexity:[{operation:"Insert / lookup (average)",time:"O(1)",space:"O(n)"},{operation:"Worst case lookup",time:"O(n)",space:"O(n)"},{operation:"Frequency count",time:"O(n)",space:"O(k)"},{operation:"Sort then scan",time:"O(n log n)",space:"O(1)"}],code:{language:"Python",filename:"two_sum.py",code:`def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], i]
        seen[n] = i
    return [-1, -1]`},practice:["pair-sum","top-k-frequent"],refs:[{label:"Visualgo — hash table",href:"https://visualgo.net/en/hashtable"},{label:"CP-Algorithms — string hashing",href:"https://cp-algorithms.com/string/string-hashing.html"}]},{slug:"recursion",step:6,title:"Recursion",phase:"Core structures",minutes:40,summary:"Solve a problem by solving a smaller copy of itself. The skill is defining the base case and trusting the recursive step.",mentalModel:"Every recursive call is a frame on a stack. If you can describe the smaller problem in one sentence, the code is usually short.",ideas:["A base case must stop every path.","The recursive step must move toward the base case.","The call stack costs memory; deep recursion can overflow.","Divide and conquer splits the input, then combines results."],topics:["Base cases","The call stack","Divide and conquer","Recursion trees","Converting to iteration"],complexity:[{operation:"Factorial",time:"O(n)",space:"O(n)"},{operation:"Binary search (recursive)",time:"O(log n)",space:"O(log n)"},{operation:"Merge sort",time:"O(n log n)",space:"O(n)"},{operation:"Naive Fibonacci",time:"O(2ⁿ)",space:"O(n)"}],code:{language:"Python",filename:"factorial.py",code:`def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)`},practice:["generate-subsets"],refs:[{label:"Visualgo — recursion",href:"https://visualgo.net/en/recursion"},{label:"CP-Algorithms",href:"https://cp-algorithms.com/"}]},{slug:"backtracking",step:7,title:"Backtracking",phase:"Core structures",minutes:45,summary:"Recursion with an undo button. Choose a candidate, explore, then remove it and try the next one.",mentalModel:"You are walking a decision tree. The path array is your current choice; popping it is the undo.",ideas:["Build candidates incrementally and prune impossible branches early.","The path must be copied when added to results.","Sorting first makes duplicate-skipping possible.","N-Queens is the canonical pruning exercise."],topics:["Subsets","Permutations","Combination sum","Pruning","N-Queens"],complexity:[{operation:"All subsets",time:"O(2ⁿ)",space:"O(n)"},{operation:"All permutations",time:"O(n!)",space:"O(n)"},{operation:"N-Queens",time:"O(n!)",space:"O(n)"},{operation:"Path copy per result",time:"O(n) each",space:"O(n)"}],code:{language:"Python",filename:"subsets.py",code:`def subsets(nums):
    result = []
    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result`},practice:["generate-subsets"],refs:[{label:"Visualgo — recursion",href:"https://visualgo.net/en/recursion"},{label:"CP-Algorithms",href:"https://cp-algorithms.com/"}]},{slug:"linked-lists",step:8,title:"Linked Lists",phase:"Core structures",minutes:35,summary:"Nodes connected by pointers. You lose random access, but gain O(1) insertion at a known position.",mentalModel:"Follow the next pointer like a treasure hunt. Keep a previous pointer whenever you need to rewire edges.",ideas:["Always draw the pointers before writing the code.","Reversing a list needs three pointers: prev, current, next.","Fast and slow pointers detect cycles and find midpoints.","Dummy heads remove edge cases at the front."],topics:["Singly and doubly linked lists","Traversal","Reversal","Fast and slow pointers","Merge and remove"],complexity:[{operation:"Access by index",time:"O(n)",space:"O(1)"},{operation:"Insert at head",time:"O(1)",space:"O(1)"},{operation:"Search",time:"O(n)",space:"O(1)"},{operation:"Reverse",time:"O(n)",space:"O(1)"}],code:{language:"Python",filename:"reverse_list.py",code:`def reverse_list(head):
    prev = None
    while head:
        nxt = head.next
        head.next = prev
        prev = head
        head = nxt
    return prev`},practice:["reverse-linked-list"],refs:[{label:"Visualgo — linked list",href:"https://visualgo.net/en/list"},{label:"CP-Algorithms",href:"https://cp-algorithms.com/"}]},{slug:"stacks",step:9,title:"Stacks",phase:"Core structures",minutes:30,summary:"Last in, first out. Stacks model nesting, undo, and the call stack itself. Monotonic stacks solve next-greater questions in one pass.",mentalModel:"A stack is a pile of plates: only the top is reachable. If a problem has nested structure, try a stack.",ideas:["Push and pop are O(1).","Balanced parentheses is the hello-world of stacks.","A monotonic stack keeps candidates in sorted order.","The call stack is why recursion depth matters."],topics:["LIFO behaviour","Balanced parentheses","Monotonic stack","Expression evaluation","Stack vs recursion"],complexity:[{operation:"Push / pop",time:"O(1)",space:"O(1)"},{operation:"Balanced parentheses",time:"O(n)",space:"O(n)"},{operation:"Next greater element",time:"O(n)",space:"O(n)"},{operation:"Expression evaluation",time:"O(n)",space:"O(n)"}],code:{language:"Python",filename:"valid_parentheses.py",code:`def is_valid(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack`},practice:[],refs:[{label:"Visualgo — stack",href:"https://visualgo.net/en/list"},{label:"CP-Algorithms",href:"https://cp-algorithms.com/"}]},{slug:"queues",step:10,title:"Queues",phase:"Core structures",minutes:30,summary:"First in, first out. Queues power breadth-first search, scheduling and sliding-window maxima.",mentalModel:"A queue is a line: arrivals join at the back, service happens at the front. Never shift an array; use a deque.",ideas:["Enqueue and dequeue are O(1) with a deque.","BFS uses a queue to process level by level.","A monotonic deque maintains sliding-window maxima.","A circular buffer avoids reallocating memory."],topics:["FIFO behaviour","Circular queue","Deque","BFS queue","Sliding-window maximum"],complexity:[{operation:"Enqueue / dequeue",time:"O(1)",space:"O(1)"},{operation:"BFS",time:"O(V + E)",space:"O(V)"},{operation:"Sliding-window max",time:"O(n)",space:"O(k)"},{operation:"Array shift",time:"O(n)",space:"O(1)"}],code:{language:"Python",filename:"bfs.py",code:`from collections import deque

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
    return order`},practice:[],refs:[{label:"Visualgo — queue",href:"https://visualgo.net/en/list"},{label:"CP-Algorithms — BFS",href:"https://cp-algorithms.com/graph/breadth-first-search.html"}]},{slug:"sorting-and-searching",step:11,title:"Sorting & Searching",phase:"Algorithms",minutes:50,summary:"Sorting unlocks two pointers, binary search and greedy scans. Binary search is the highest-leverage algorithm to know cold.",mentalModel:"Sorting buys order; order buys halving. If a search space is monotonic, binary search can find a boundary.",ideas:["Merge sort is stable and predictable; quicksort is fast in practice.","Binary search works on answers, not only arrays.","Always define the invariant and the boundary update.","Sorting first is often cheaper than a nested loop."],topics:["Merge sort","Quicksort","Binary search","Search on answer","Comparator thinking"],complexity:[{operation:"Merge sort",time:"O(n log n)",space:"O(n)"},{operation:"Quicksort (average)",time:"O(n log n)",space:"O(log n)"},{operation:"Quicksort (worst)",time:"O(n²)",space:"O(log n)"},{operation:"Binary search",time:"O(log n)",space:"O(1)"}],code:{language:"Python",filename:"binary_search.py",code:`def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`},practice:[],refs:[{label:"Visualgo — sorting",href:"https://visualgo.net/en/sorting"},{label:"CP-Algorithms — binary search",href:"https://cp-algorithms.com/"}]},{slug:"trees",step:12,title:"Trees",phase:"Algorithms",minutes:45,summary:"Hierarchies without cycles. Traversals are the vocabulary; depth, diameter and lowest common ancestor are the recurring questions.",mentalModel:"A tree is a recursive structure: every child is the root of a smaller tree. Write the function for one node and trust it.",ideas:["Inorder, preorder and postorder are three orders of the same walk.","Most tree answers are returned upward from children.","Height and diameter differ: diameter may not pass through the root.","BFS is better for level-based questions."],topics:["Traversals","Depth and height","Diameter","Lowest common ancestor","Level-order traversal"],complexity:[{operation:"Traversal",time:"O(n)",space:"O(h)"},{operation:"Height",time:"O(n)",space:"O(h)"},{operation:"Diameter",time:"O(n)",space:"O(h)"},{operation:"Level-order",time:"O(n)",space:"O(w)"}],code:{language:"Python",filename:"inorder.py",code:`def inorder(node, out):
    if not node:
        return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)`},practice:["kth-smallest-bst"],refs:[{label:"Visualgo — BST",href:"https://visualgo.net/en/bst"},{label:"CP-Algorithms",href:"https://cp-algorithms.com/"}]},{slug:"binary-search-tree",step:13,title:"Binary Search Tree",phase:"Algorithms",minutes:40,summary:"An ordered tree: everything left is smaller, everything right is larger. The ordering enables search, floor, ceil and ordered traversal.",mentalModel:"Each comparison discards half the tree — if the tree is balanced. Inorder traversal returns sorted values.",ideas:["Search, insert and delete are O(h).","Validation needs a range, not just a parent comparison.","The kth smallest value is the kth node in inorder.","Unbalanced insertion degenerates into a linked list."],topics:["Insert and delete","Validation","Kth smallest","Floor and ceil","Balanced trees"],complexity:[{operation:"Search",time:"O(h)",space:"O(1)"},{operation:"Insert",time:"O(h)",space:"O(1)"},{operation:"Delete",time:"O(h)",space:"O(1)"},{operation:"Inorder",time:"O(n)",space:"O(h)"}],code:{language:"Python",filename:"validate_bst.py",code:`def is_bst(node, low=float("-inf"), high=float("inf")):
    if not node:
        return True
    if not (low < node.val < high):
        return False
    return (is_bst(node.left, low, node.val)
            and is_bst(node.right, node.val, high))`},practice:["kth-smallest-bst"],refs:[{label:"Visualgo — BST",href:"https://visualgo.net/en/bst"},{label:"CP-Algorithms",href:"https://cp-algorithms.com/"}]},{slug:"heaps",step:14,title:"Heaps / Priority Queue",phase:"Advanced",minutes:40,summary:"A complete tree that always exposes the smallest or largest element. The right tool for top-k, streaming medians and scheduling.",mentalModel:"A heap is a partial order, not a sorted array. It only promises that the root is the extreme value.",ideas:["Push and pop are O(log n); peek is O(1).","Build a heap in O(n) with heapify.","Keep a heap of size k for top-k questions.","Two heaps maintain a running median."],topics:["Heap property","Heapify","Push and pop","Top-k","Merge k lists"],complexity:[{operation:"Peek",time:"O(1)",space:"O(1)"},{operation:"Push / pop",time:"O(log n)",space:"O(1)"},{operation:"Build heap",time:"O(n)",space:"O(n)"},{operation:"Top-k with size-k heap",time:"O(n log k)",space:"O(k)"}],code:{language:"Python",filename:"kth_largest.py",code:`import heapq

def kth_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)
    for n in nums[k:]:
        if n > heap[0]:
            heapq.heapreplace(heap, n)
    return heap[0]`},practice:["top-k-frequent"],refs:[{label:"Visualgo — heap",href:"https://visualgo.net/en/heap"},{label:"CP-Algorithms",href:"https://cp-algorithms.com/"}]},{slug:"tries",step:15,title:"Tries",phase:"Advanced",minutes:35,summary:"A prefix tree for strings. Lookup cost depends on word length, not dictionary size, which makes autocomplete and prefix queries natural.",mentalModel:"Each edge is a character; each path from the root spells a prefix. Shared prefixes share nodes.",ideas:["Insert and search are O(m) for word length m.","Store an end-of-word flag, not just children.","Prefix search returns a subtree, not a single node.","A bitwise trie solves maximum XOR pairs."],topics:["Insert and search","Prefix queries","Autocomplete","Word dictionaries","Bitwise trie"],complexity:[{operation:"Insert",time:"O(m)",space:"O(m)"},{operation:"Search",time:"O(m)",space:"O(1)"},{operation:"Prefix query",time:"O(m + output)",space:"O(output)"},{operation:"Total space",time:"—",space:"O(total characters)"}],code:{language:"Python",filename:"trie.py",code:`class TrieNode:
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
        return node.end`},practice:[],refs:[{label:"Visualgo — trie",href:"https://visualgo.net/en/trie"},{label:"CP-Algorithms",href:"https://cp-algorithms.com/"}]},{slug:"graphs",step:16,title:"Graphs",phase:"Advanced",minutes:60,summary:"Nodes and edges model networks, dependencies and grids. BFS and DFS are the base; topological sort and shortest paths are the extensions.",mentalModel:"A graph is a set of relationships. Choose a representation first, then choose a traversal that matches the question.",ideas:["Adjacency lists are the default representation.","BFS finds shortest paths in unweighted graphs.","DFS powers cycle detection and topological sort.","Union-find handles connectivity and Kruskal's MST."],topics:["Representation","BFS and DFS","Topological sort","Shortest paths","Union-find","Minimum spanning tree"],complexity:[{operation:"BFS / DFS",time:"O(V + E)",space:"O(V)"},{operation:"Dijkstra (binary heap)",time:"O((V + E) log V)",space:"O(V)"},{operation:"Topological sort",time:"O(V + E)",space:"O(V)"},{operation:"Union-find",time:"≈O(1) amortised",space:"O(V)"}],code:{language:"Python",filename:"dfs.py",code:`def dfs(graph, node, seen):
    if node in seen:
        return
    seen.add(node)
    for nxt in graph[node]:
        dfs(graph, nxt, seen)`},practice:["prerequisite-order"],refs:[{label:"Visualgo — graph",href:"https://visualgo.net/en/graphds"},{label:"CP-Algorithms — graph",href:"https://cp-algorithms.com/graph/"}]},{slug:"dynamic-programming",step:17,title:"Dynamic Programming",phase:"Advanced",minutes:60,summary:"Reuse overlapping subproblems instead of recomputing them. Start with a recursive definition, then memoise, then tabulate.",mentalModel:"Write the answer for the last step in terms of smaller steps. Cache it. That is the whole trick.",ideas:["Define the state before choosing a table shape.","Top-down memoisation is easiest to derive.","Bottom-up tabulation can reduce space.","Many 2D tables compress to two rows or two variables."],topics:["State and transition","Memoisation","Tabulation","Knapsack","Longest increasing subsequence","Grid DP"],complexity:[{operation:"Climbing stairs",time:"O(n)",space:"O(1)"},{operation:"0/1 knapsack",time:"O(n·W)",space:"O(n·W)"},{operation:"Longest common subsequence",time:"O(n·m)",space:"O(n·m)"},{operation:"House robber",time:"O(n)",space:"O(1)"}],code:{language:"Python",filename:"house_robber.py",code:`def rob(nums):
    prev, curr = 0, 0
    for n in nums:
        prev, curr = curr, max(curr, prev + n)
    return curr`},practice:["house-robber"],refs:[{label:"Visualgo — recursion",href:"https://visualgo.net/en/recursion"},{label:"CP-Algorithms — intro to DP",href:"https://cp-algorithms.com/dynamic_programming/intro-to-dp.html"}]}];t.reduce((e,t)=>e+t.topics.length,0);let a=["JavaScript","Java","Python","C++"],n={PROGRAMMING_TOPIC_INTRO:[{language:"Java",filename:"Average.java",code:`int[] scores = {72, 88, 91};
int total = 0;

for (int score : scores) {
    total += score;
}

double average = (double) total / scores.length;
System.out.println(average);`},{language:"C++",filename:"average.cpp",code:`std::vector<int> scores = {72, 88, 91};
int total = 0;

for (int score : scores) {
    total += score;
}

double average = static_cast<double>(total) / scores.size();
std::cout << average << std::endl;`}],CONDITIONS_AND_LOOPS:[{language:"Java",filename:"FirstEven.java",code:`int firstEven(int[] nums) {
    for (int n : nums) {
        if (n % 2 == 0) return n;
    }
    return -1;
}`},{language:"C++",filename:"first_even.cpp",code:`int firstEven(const std::vector<int>& nums) {
    for (int n : nums) {
        if (n % 2 == 0) return n;
    }
    return -1;
}`}],CLASSES_AND_OBJECTS:[{language:"Python",filename:"list_node.py",code:`class ListNode:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

node = ListNode(3, ListNode(5))
print(node.value, node.next.value)`},{language:"C++",filename:"list_node.cpp",code:`struct ListNode {
    int value;
    ListNode* next;
    ListNode(int value, ListNode* next = nullptr)
        : value(value), next(next) {}
};

ListNode* node = new ListNode(3, new ListNode(5));
std::cout << node->value << " " << node->next->value << std::endl;
delete node->next;
delete node;`}],OBJECT_REFERENCE:[{language:"Java",filename:"Reference.java",code:`int[] original = {1, 2, 3};
int[] alias = original;
alias[0] = 99; // original[0] is now 99

int[] copy = original.clone();
copy[0] = 7; // original[0] stays 99`},{language:"C++",filename:"reference.cpp",code:`std::vector<int> original = {1, 2, 3};
std::vector<int>& alias = original;
alias[0] = 99; // original[0] is now 99

std::vector<int> copy = original;
copy[0] = 7; // original[0] stays 99`}],STACK_VS_HEAP:[{language:"Python",filename:"stack_heap.py",code:`def sum_to(n):
    if n == 0:
        return 0
    return n + sum_to(n - 1)

print(sum_to(4))  # call stack depth 5

values = [0] * 1_000_000  # heap allocation`},{language:"C++",filename:"stack_heap.cpp",code:`int sumTo(int n) {
    if (n == 0) return 0;
    return n + sumTo(n - 1);
}

int main() {
    std::cout << sumTo(4) << std::endl; // stack depth 5
    std::vector<int> values(1000000);   // heap allocation
}`}],TIME_AND_SPACE_COMPLEXITY:[{language:"JavaScript",filename:"pair_exists.js",code:`function pairExists(nums, target) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(target - n)) return true;
    seen.add(n);
  }
  return false;
}`},{language:"Java",filename:"PairExists.java",code:`boolean pairExists(int[] nums, int target) {
    Set<Integer> seen = new HashSet<>();
    for (int n : nums) {
        if (seen.contains(target - n)) return true;
        seen.add(n);
    }
    return false;
}`},{language:"Python",filename:"pair_exists.py",code:`def pair_exists(nums, target):
    seen = set()
    for n in nums:
        if target - n in seen:
            return True
        seen.add(n)
    return False`},{language:"C++",filename:"pair_exists.cpp",code:`bool pairExists(const std::vector<int>& nums, int target) {
    std::unordered_set<int> seen;
    for (int n : nums) {
        if (seen.count(target - n)) return true;
        seen.insert(n);
    }
    return false;
}`}],ARRAYS:[{language:"JavaScript",filename:"pair_sum.js",code:`function pairSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`},{language:"Java",filename:"PairSum.java",code:`int[] pairSum(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return new int[]{left, right};
        if (sum < target) left++;
        else right--;
    }
    return new int[]{-1, -1};
}`},{language:"Python",filename:"pair_sum.py",code:`def pair_sum(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return [left, right]
        if total < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]`},{language:"C++",filename:"pair_sum.cpp",code:`std::vector<int> pairSum(const std::vector<int>& nums, int target) {
    int left = 0, right = static_cast<int>(nums.size()) - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return {left, right};
        if (sum < target) ++left;
        else --right;
    }
    return {-1, -1};
}`}],STRINGS:[{language:"JavaScript",filename:"palindrome.js",code:`function isPalindrome(text) {
  let left = 0;
  let right = text.length - 1;
  while (left < right) {
    if (text[left] !== text[right]) return false;
    left++;
    right--;
  }
  return true;
}`},{language:"Java",filename:"Palindrome.java",code:`boolean isPalindrome(String text) {
    int left = 0, right = text.length() - 1;
    while (left < right) {
        if (text.charAt(left) != text.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}`},{language:"Python",filename:"palindrome.py",code:`def is_palindrome(text):
    left, right = 0, len(text) - 1
    while left < right:
        if text[left] != text[right]:
            return False
        left += 1
        right -= 1
    return True`},{language:"C++",filename:"palindrome.cpp",code:`bool isPalindrome(const std::string& text) {
    int left = 0, right = static_cast<int>(text.size()) - 1;
    while (left < right) {
        if (text[left] != text[right]) return false;
        ++left;
        --right;
    }
    return true;
}`}],RECURSION:[{language:"JavaScript",filename:"factorial.js",code:`function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`},{language:"Java",filename:"Factorial.java",code:`long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`},{language:"Python",filename:"factorial.py",code:`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`},{language:"C++",filename:"factorial.cpp",code:`long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`}],HASHING:[{language:"JavaScript",filename:"two_sum.js",code:`function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`},{language:"Java",filename:"TwoSum.java",code:`int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}`},{language:"Python",filename:"two_sum.py",code:`def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], i]
        seen[n] = i
    return []`},{language:"C++",filename:"two_sum.cpp",code:`std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;
    for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}`}],BACKTRACKING:[{language:"JavaScript",filename:"subsets.js",code:`function subsets(nums) {
  const result = [];
  const path = [];
  function backtrack(start) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }
  backtrack(0);
  return result;
}`},{language:"Java",filename:"Subsets.java",code:`List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}

void backtrack(int[] nums, int start, List<Integer> path,
               List<List<Integer>> result) {
    result.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(nums, i + 1, path, result);
        path.remove(path.size() - 1);
    }
}`},{language:"Python",filename:"subsets.py",code:`def subsets(nums):
    result, path = [], []

    def backtrack(start):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()

    backtrack(0)
    return result`},{language:"C++",filename:"subsets.cpp",code:`void backtrack(const std::vector<int>& nums, int start,
               std::vector<int>& path,
               std::vector<std::vector<int>>& result) {
    result.push_back(path);
    for (int i = start; i < static_cast<int>(nums.size()); ++i) {
        path.push_back(nums[i]);
        backtrack(nums, i + 1, path, result);
        path.pop_back();
    }
}

std::vector<std::vector<int>> subsets(const std::vector<int>& nums) {
    std::vector<std::vector<int>> result;
    std::vector<int> path;
    backtrack(nums, 0, path, result);
    return result;
}`}],LINKED_LISTS:[{language:"JavaScript",filename:"reverse_list.js",code:`function reverseList(head) {
  let previous = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }
  return previous;
}`},{language:"Java",filename:"ReverseList.java",code:`ListNode reverseList(ListNode head) {
    ListNode previous = null;
    ListNode current = head;
    while (current != null) {
        ListNode next = current.next;
        current.next = previous;
        previous = current;
        current = next;
    }
    return previous;
}`},{language:"Python",filename:"reverse_list.py",code:`def reverse_list(head):
    previous = None
    current = head
    while current:
        next_node = current.next
        current.next = previous
        previous = current
        current = next_node
    return previous`},{language:"C++",filename:"reverse_list.cpp",code:`ListNode* reverseList(ListNode* head) {
    ListNode* previous = nullptr;
    ListNode* current = head;
    while (current != nullptr) {
        ListNode* next = current->next;
        current->next = previous;
        previous = current;
        current = next;
    }
    return previous;
}`}],STACKS:[{language:"JavaScript",filename:"valid_parentheses.js",code:`function isValid(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (stack.pop() !== pairs[ch]) {
      return false;
    }
  }
  return stack.length === 0;
}`},{language:"Java",filename:"ValidParentheses.java",code:`boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char ch : s.toCharArray()) {
        if (ch == '(' || ch == '[' || ch == '{') {
            stack.push(ch);
        } else {
            char open = ch == ')' ? '(' : ch == ']' ? '[' : '{';
            if (stack.isEmpty() || stack.pop() != open) return false;
        }
    }
    return stack.isEmpty();
}`},{language:"Python",filename:"valid_parentheses.py",code:`def is_valid(s):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif not stack or stack.pop() != pairs[ch]:
            return False
    return not stack`},{language:"C++",filename:"valid_parentheses.cpp",code:`bool isValid(const std::string& s) {
    std::stack<char> stack;
    for (char ch : s) {
        if (ch == '(' || ch == '[' || ch == '{') {
            stack.push(ch);
        } else {
            char open = ch == ')' ? '(' : ch == ']' ? '[' : '{';
            if (stack.empty() || stack.top() != open) return false;
            stack.pop();
        }
    }
    return stack.empty();
}`}],QUEUES:[{language:"JavaScript",filename:"bfs.js",code:`function bfs(graph, start) {
  const queue = [start];
  const seen = new Set([start]);
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const next of graph[node]) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}`},{language:"Java",filename:"Bfs.java",code:`List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
    Queue<Integer> queue = new ArrayDeque<>();
    Set<Integer> seen = new HashSet<>();
    List<Integer> order = new ArrayList<>();
    queue.add(start);
    seen.add(start);
    while (!queue.isEmpty()) {
        int node = queue.poll();
        order.add(node);
        for (int next : graph.getOrDefault(node, List.of())) {
            if (seen.add(next)) queue.add(next);
        }
    }
    return order;
}`},{language:"Python",filename:"bfs.py",code:`from collections import deque

def bfs(graph, start):
    queue = deque([start])
    seen = {start}
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for next_node in graph[node]:
            if next_node not in seen:
                seen.add(next_node)
                queue.append(next_node)
    return order`},{language:"C++",filename:"bfs.cpp",code:`std::vector<int> bfs(
    const std::unordered_map<int, std::vector<int>>& graph, int start) {
    std::queue<int> queue;
    std::unordered_set<int> seen{start};
    std::vector<int> order;
    queue.push(start);
    while (!queue.empty()) {
        int node = queue.front();
        queue.pop();
        order.push_back(node);
        for (int next : graph.at(node)) {
            if (seen.insert(next).second) queue.push(next);
        }
    }
    return order;
}`}],SORTING_AND_SEARCHING:[{language:"JavaScript",filename:"binary_search.js",code:`function binarySearch(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`},{language:"Java",filename:"BinarySearch.java",code:`int binarySearch(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`},{language:"Python",filename:"binary_search.py",code:`def binary_search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`},{language:"C++",filename:"binary_search.cpp",code:`int binarySearch(const std::vector<int>& nums, int target) {
    int low = 0, high = static_cast<int>(nums.size()) - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`}],TREES:[{language:"JavaScript",filename:"inorder.js",code:`function inorder(node, visit = []) {
  if (!node) return visit;
  inorder(node.left, visit);
  visit.push(node.value);
  inorder(node.right, visit);
  return visit;
}`},{language:"Java",filename:"Inorder.java",code:`void inorder(TreeNode node, List<Integer> visit) {
    if (node == null) return;
    inorder(node.left, visit);
    visit.add(node.value);
    inorder(node.right, visit);
}`},{language:"Python",filename:"inorder.py",code:`def inorder(node, visit=None):
    if visit is None:
        visit = []
    if node is None:
        return visit
    inorder(node.left, visit)
    visit.append(node.value)
    inorder(node.right, visit)
    return visit`},{language:"C++",filename:"inorder.cpp",code:`void inorder(TreeNode* node, std::vector<int>& visit) {
    if (node == nullptr) return;
    inorder(node->left, visit);
    visit.push_back(node->value);
    inorder(node->right, visit);
}`}],BINARY_SEARCH_TREE:[{language:"JavaScript",filename:"validate_bst.js",code:`function isValidBst(node, low = -Infinity, high = Infinity) {
  if (!node) return true;
  if (node.value <= low || node.value >= high) return false;
  return isValidBst(node.left, low, node.value) &&
    isValidBst(node.right, node.value, high);
}`},{language:"Java",filename:"ValidateBst.java",code:`boolean isValidBst(TreeNode node, long low, long high) {
    if (node == null) return true;
    if (node.value <= low || node.value >= high) return false;
    return isValidBst(node.left, low, node.value)
        && isValidBst(node.right, node.value, high);
}

boolean isValidBst(TreeNode root) {
    return isValidBst(root, Long.MIN_VALUE, Long.MAX_VALUE);
}`},{language:"Python",filename:"validate_bst.py",code:`def is_valid_bst(node, low=float("-inf"), high=float("inf")):
    if node is None:
        return True
    if node.value <= low or node.value >= high:
        return False
    return (
        is_valid_bst(node.left, low, node.value)
        and is_valid_bst(node.right, node.value, high)
    )`},{language:"C++",filename:"validate_bst.cpp",code:`bool isValidBst(TreeNode* node, long long low, long long high) {
    if (node == nullptr) return true;
    if (node->value <= low || node->value >= high) return false;
    return isValidBst(node->left, low, node->value)
        && isValidBst(node->right, node->value, high);
}`}],HEAPS:[{language:"JavaScript",filename:"kth_largest.js",code:`class MinHeap {
  constructor() { this.items = []; }
  push(value) {
    this.items.push(value);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.items[parent] <= this.items[i]) break;
      [this.items[parent], this.items[i]] = [this.items[i], this.items[parent]];
      i = parent;
    }
  }
  pop() {
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length && last !== undefined) {
      this.items[0] = last;
      let i = 0;
      while (true) {
        const left = i * 2 + 1;
        const right = left + 1;
        let smallest = i;
        if (left < this.items.length && this.items[left] < this.items[smallest]) smallest = left;
        if (right < this.items.length && this.items[right] < this.items[smallest]) smallest = right;
        if (smallest === i) break;
        [this.items[i], this.items[smallest]] = [this.items[smallest], this.items[i]];
        i = smallest;
      }
    }
    return top;
  }
  peek() { return this.items[0]; }
}

function kthLargest(nums, k) {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.items.length > k) heap.pop();
  }
  return heap.peek();
}`},{language:"Java",filename:"KthLargest.java",code:`int kthLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int n : nums) {
        heap.add(n);
        if (heap.size() > k) heap.poll();
    }
    return heap.peek();
}`},{language:"Python",filename:"kth_largest.py",code:`import heapq

def kth_largest(nums, k):
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`},{language:"C++",filename:"kth_largest.cpp",code:`int kthLargest(const std::vector<int>& nums, int k) {
    std::priority_queue<int, std::vector<int>, std::greater<int>> heap;
    for (int n : nums) {
        heap.push(n);
        if (static_cast<int>(heap.size()) > k) heap.pop();
    }
    return heap.top();
}`}],TRIES:[{language:"JavaScript",filename:"trie.js",code:`class TrieNode {
  constructor() {
    this.children = new Map();
    this.end = false;
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.end = true;
  }

  search(word) {
    let node = this.root;
    for (const ch of word) {
      node = node.children.get(ch);
      if (!node) return false;
    }
    return node.end;
  }
}`},{language:"Java",filename:"Trie.java",code:`class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean end;
}

class Trie {
    private final TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            node = node.children.computeIfAbsent(ch, key -> new TrieNode());
        }
        node.end = true;
    }

    boolean search(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            node = node.children.get(ch);
            if (node == null) return false;
        }
        return node.end;
    }
}`},{language:"Python",filename:"trie.py",code:`class TrieNode:
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
        return node.end`},{language:"C++",filename:"trie.cpp",code:`struct TrieNode {
    std::unordered_map<char, TrieNode*> children;
    bool end = false;
};

class Trie {
    TrieNode* root = new TrieNode();
public:
    void insert(const std::string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            if (!node->children.count(ch)) node->children[ch] = new TrieNode();
            node = node->children[ch];
        }
        node->end = true;
    }

    bool search(const std::string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            if (!node->children.count(ch)) return false;
            node = node->children[ch];
        }
        return node->end;
    }
};`}],GRAPHS:[{language:"JavaScript",filename:"dfs.js",code:`function dfs(graph, node, seen = new Set()) {
  if (seen.has(node)) return;
  seen.add(node);
  console.log(node);
  for (const next of graph[node]) dfs(graph, next, seen);
}`},{language:"Java",filename:"Dfs.java",code:`void dfs(Map<Integer, List<Integer>> graph, int node, Set<Integer> seen) {
    if (!seen.add(node)) return;
    System.out.println(node);
    for (int next : graph.getOrDefault(node, List.of())) {
        dfs(graph, next, seen);
    }
}`},{language:"Python",filename:"dfs.py",code:`def dfs(graph, node, seen=None):
    if seen is None:
        seen = set()
    if node in seen:
        return
    seen.add(node)
    print(node)
    for next_node in graph[node]:
        dfs(graph, next_node, seen)`},{language:"C++",filename:"dfs.cpp",code:`void dfs(const std::unordered_map<int, std::vector<int>>& graph,
         int node, std::unordered_set<int>& seen) {
    if (!seen.insert(node).second) return;
    std::cout << node << std::endl;
    for (int next : graph.at(node)) dfs(graph, next, seen);
}`}],DYNAMIC_PROGRAMMING:[{language:"JavaScript",filename:"house_robber.js",code:`function houseRobber(nums) {
  let previous = 0;
  let current = 0;
  for (const n of nums) {
    const next = Math.max(current, previous + n);
    previous = current;
    current = next;
  }
  return current;
}`},{language:"Java",filename:"HouseRobber.java",code:`int houseRobber(int[] nums) {
    int previous = 0, current = 0;
    for (int n : nums) {
        int next = Math.max(current, previous + n);
        previous = current;
        current = next;
    }
    return current;
}`},{language:"Python",filename:"house_robber.py",code:`def house_robber(nums):
    previous = current = 0
    for n in nums:
        previous, current = current, max(current, previous + n)
    return current`},{language:"C++",filename:"house_robber.cpp",code:`int houseRobber(const std::vector<int>& nums) {
    int previous = 0, current = 0;
    for (int n : nums) {
        int next = std::max(current, previous + n);
        previous = current;
        current = next;
    }
    return current;
}`}]},s={"programming-foundations":"Programming Foundations","time-and-space-complexity":"Time and Space Complexity",arrays:"Arrays",strings:"Strings",recursion:"Recursion",hashing:"Hashing",backtracking:"Backtracking","linked-lists":"Linked List",stacks:"Stack",queues:"Queue","sorting-and-searching":"Sorting & Searching",trees:"Trees","binary-search-tree":"Binary Search Tree",heaps:"Heap and Priority Queue",tries:"Trie",graphs:"Graphs","dynamic-programming":"Dynamic Programming"},r={"time-and-space-complexity":"Complexity is a way to describe how an algorithm's work grows as the input grows, independent of the machine it runs on.",arrays:"An array is a contiguous block of memory holding values of the same type, addressed by index.",strings:"A string is an ordered sequence of characters, usually stored as an array with an encoding and an immutable or mutable contract.",recursion:"Recursion is a function that solves a problem by calling itself on a smaller instance, with a base case that stops the chain.",hashing:"A hash map stores key-value pairs by turning each key into an array index through a hash function, giving average O(1) lookup.",backtracking:"Backtracking is a depth-first search over a decision tree: choose, explore, then undo the choice when it cannot lead to a valid answer.","linked-lists":"A linked list is a chain of nodes, each holding a value and a reference to the next node, so insertion is cheap but indexing is linear.",stacks:"A stack is a last-in, first-out collection with push, pop and peek operations at one end.",queues:"A queue is a first-in, first-out collection with enqueue at the back and dequeue at the front.","sorting-and-searching":"Sorting arranges data in an order; searching finds a target. The choice of algorithm is a trade between time, space and stability.",trees:"A tree is a connected acyclic graph with a root, where every node except the root has exactly one parent.","binary-search-tree":"A binary search tree is a binary tree where every left descendant is smaller than the node and every right descendant is larger.",heaps:"A heap is a complete binary tree stored in an array that keeps the smallest or largest value at the root.",tries:"A trie is a tree keyed by characters, where each path from the root spells a prefix and shared prefixes share nodes.",graphs:"A graph is a set of vertices connected by edges, used to model relationships, networks and dependencies.","dynamic-programming":"Dynamic programming solves a problem by combining solutions to overlapping subproblems, storing each result once."},i={"time-and-space-complexity":["Counting every line as one unit instead of looking at how the work grows.","Forgetting the space used by the call stack in a recursive solution.","Assuming a hash map is always O(1), even when collisions or resizing dominate."],arrays:["Inserting or deleting in the middle and calling the whole operation O(1).","Off-by-one errors at the last index or in a half-open range.","Assuming a shallow copy duplicates nested objects."],strings:["Building a new string inside a loop when a list or builder would avoid repeated copies.","Comparing strings with == in a language where that compares references.","Forgetting that many languages treat strings as immutable."],recursion:["Missing or unreachable base case, which produces a stack overflow.","Recomputing the same subproblem instead of memoising it.","Mutating shared state across branches without undoing the change."],hashing:["Using a mutable object as a key and changing it after insertion.","Assuming iteration order is guaranteed when the contract does not promise it.","Ignoring the worst case when an adversary can force collisions."],backtracking:["Forgetting to undo a choice before trying the next branch.","Exploring branches that are already known to be invalid.","Copying the whole path on every call instead of adding and removing one item."],"linked-lists":["Losing the rest of the list by reassigning next before saving it.","Forgetting to update the head or tail pointer on insert and delete.","Using a linked list where an array's cache locality would be faster."],stacks:["Popping from an empty stack without a guard.","Using a stack when the problem needs first-in, first-out order.","Forgetting that recursion already uses the call stack."],queues:["Removing from the front of a Python list in a loop, which is O(n) each time.","Letting an unbounded queue absorb a producer that is faster than its consumers.","Confusing a queue with a stack in a breadth-first traversal."],"sorting-and-searching":["Applying binary search to data that is not sorted.","Using a comparison sort when counting sort fits the value range.","Forgetting that an in-place sort may not be stable."],trees:["Confusing depth with height.","Forgetting the null check before reading a child.","Assuming every binary tree is a binary search tree."],"binary-search-tree":["Validating only the immediate children instead of the full allowed range.","Letting duplicate keys go to both sides without a defined rule.","Forgetting that an unbalanced BST degrades to a linked list."],heaps:["Assuming a heap keeps the whole array sorted.","Using a min-heap when the problem needs the largest k values.","Forgetting to sift down after replacing the root."],tries:["Storing the whole string at every node instead of a terminal flag.","Forgetting to free nodes after deletion.","Using a trie when a hash map would answer the same query with less memory."],graphs:["Forgetting the visited set and looping forever on a cycle.","Using BFS when the problem needs depth-first path reconstruction.","Ignoring disconnected components."],"dynamic-programming":["Defining a state that does not contain enough information to make the next decision.","Filling the table in an order that reads values not computed yet.","Using a full table when only the previous row is needed."]},o=(e,a)=>{let n=function(e){let a=t.find(t=>t.slug===e);if(!a)throw Error(`Unknown module: ${e}`);return{slug:a.slug,code:e.toUpperCase().replace(/-/g,"_"),title:a.title,phase:s[e]??a.phase,summary:a.summary,minutes:a.minutes,moduleSlug:a.slug,definition:r[e]??a.mentalModel,blocks:[{title:"Why it matters",paragraphs:[a.summary,a.mentalModel]},{title:"Core ideas",paragraphs:[],bullets:a.ideas},{title:"What to practise",paragraphs:["The checklist is the working list. Tick a point when you can explain it without notes, then solve the mapped problem."],bullets:a.topics}],keyPoints:a.topics,mistakes:i[e]??[],codeSamples:[a.code],complexity:a.complexity,practice:a.practice,refs:a.refs}}(a);return{slug:a,name:e,lessons:[{...n,title:"Time and Space Complexity"===e?"Time & Space Complexity":e,phase:e}]}},l=[{slug:"programming-foundations",name:"Programming Foundations",lessons:[{slug:"programming-foundations",code:"PROGRAMMING_TOPIC_INTRO",title:"Programming Foundations",phase:"Programming Foundations",summary:"The small set of programming ideas every data structure relies on: values, control flow, functions, objects and memory.",minutes:20,moduleSlug:"programming-foundations",definition:"Programming foundations are the primitives you combine to build every algorithm: values, decisions, repetition, functions and references.",blocks:[{title:"Start here",paragraphs:["Data structures are not a separate language. They are built from the same values, conditions, loops and references you already use in a small program.","This phase slows down long enough to make those primitives explicit. If you can trace a loop and predict what a reference change does, the rest of the path will feel much less magical."]},{title:"What this phase covers",paragraphs:[],bullets:["Variables and data types: what a value is and how it is stored.","Conditions and loops: how a program chooses and repeats work.","Classes and objects: how behaviour and state are grouped.","Object references: why two variables can point at the same data.","Stack and heap memory: where values live and what that costs."]},{title:"How to use this phase",paragraphs:["Read one lesson, run the code sample in your head, then change one line and predict the result. The goal is not speed; it is a reliable mental model you can use under pressure."]}],keyPoints:["Variables hold values of a declared or inferred type","Conditions choose a branch","Loops repeat work","Functions isolate behaviour","References can share data"],mistakes:["Skipping the basics because they look too easy, then misreading a reference bug later.","Memorising syntax without tracing what happens to the value."],codeSamples:[{language:"JavaScript",filename:"foundations.js",code:`const scores = [72, 88, 91];
let total = 0;

for (const score of scores) {
  total += score;
}

const average = total / scores.length;
console.log(average); // 83.666...`},{language:"Python",filename:"foundations.py",code:`scores = [72, 88, 91]
total = 0

for score in scores:
    total += score

average = total / len(scores)
print(average)  # 83.666...`}],complexity:[{operation:"Read one value",time:"O(1)",space:"O(1)"},{operation:"Loop over n values",time:"O(n)",space:"O(1)"},{operation:"Store n values",time:"O(n)",space:"O(n)"}],practice:[],refs:[{label:"MDN — JavaScript first steps",href:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting"},{label:"The Python tutorial",href:"https://docs.python.org/3/tutorial/"}]},{slug:"programming-basics",code:"PROGRAMMING_BASICS",title:"Programming Basics (Variables, Data Types)",phase:"Programming Foundations",summary:"Learn variables and data types with clear explanations, visuals and interview-ready examples.",minutes:30,moduleSlug:"programming-foundations",definition:"A variable is a named storage location whose value can change. A data type defines what kind of value it holds and which operations are valid.",blocks:[{title:"What are variables?",kind:"definition",paragraphs:["A variable is a name bound to a value in memory. The name lets you read and update that value without remembering its address.","In data structures, variables hold values, references to objects and sometimes the links between nodes. Understanding which of those a variable contains is the difference between a correct algorithm and a mysterious bug."]},{title:"What are data types?",kind:"definition",paragraphs:["A data type defines the kind of value a variable can hold, how much memory it occupies and which operations are allowed.","Choosing a type is a correctness decision as much as a memory decision. An integer cannot hold a fractional price; a mutable list shared by two variables can surprise you when one of them changes it."],bullets:["Primitive types: numbers, booleans, characters. They store the value directly.","Reference types: arrays, objects and class instances. They store an address to data held elsewhere.","Composite types: records and collections built from the primitive and reference types."]},{title:"Value vs reference",kind:"warning",paragraphs:["Assigning a primitive copies the value. Assigning an object copies the reference, not the object. After that, both variables point at the same data.","This is the single most common source of beginner bugs in arrays, linked lists and trees. If two variables can see the same object, a change through one is visible through the other."]},{title:"Why it matters in data structures",paragraphs:["An array is a block of values. A linked list is a chain of references. A tree is references with a parent-child shape. Every structure is a different arrangement of the same two ideas: values and references.","Once you can answer 'does this assignment copy the value or the reference?', you can reason about aliasing, shallow copies and shared state in an algorithm."]},{title:"Common beginner mistakes",kind:"warning",paragraphs:[],bullets:["Assuming an array assignment copies every element.","Confusing primitive assignment with object reference assignment.","Ignoring how memory is shared between two variables.","Choosing a type that is too small for the values the program will produce."]},{title:"Important note",kind:"note",paragraphs:["A strong understanding of variables, types and references makes linked lists, trees and graphs much easier to learn. If this lesson feels obvious, test yourself by predicting the output of the code sample before running it."]}],keyPoints:["A variable is a named storage location","A data type defines valid values and operations","Primitive assignment copies the value","Object assignment copies the reference","Shared references can mutate the same data"],mistakes:["Assuming arrays are copied by value.","Confusing primitive assignment with object reference assignment.","Ignoring how memory is shared between variables."],codeSamples:[{language:"JavaScript",filename:"variables.js",code:`// Variables and data types in JavaScript
let count = 10;          // Number
let name = "Vishesh";    // String
let isActive = true;     // Boolean
let scores = [10, 20];   // Array (reference type)
let user = { id: 1 };    // Object (reference type)

// Value vs reference
let a = 5;
let b = a;
b = 10;                  // a remains 5

let obj1 = { x: 10 };
let obj2 = obj1;
obj2.x = 20;             // obj1.x also becomes 20`},{language:"Java",filename:"Variables.java",code:`int count = 10;
String name = "Vishesh";
boolean isActive = true;
int[] scores = {10, 20};
User user = new User(1);

int a = 5;
int b = a;
b = 10; // a remains 5

User obj1 = new User(10);
User obj2 = obj1;
obj2.x = 20; // obj1.x also becomes 20`},{language:"C++",filename:"variables.cpp",code:`int count = 10;
std::string name = "Vishesh";
bool isActive = true;
std::vector<int> scores = {10, 20};
User user{1};

int a = 5;
int b = a;
b = 10; // a remains 5

User obj1{10};
User& obj2 = obj1;
obj2.x = 20; // obj1.x also becomes 20`},{language:"Python",filename:"variables.py",code:`count = 10             # int
name = "Vishesh"       # str
is_active = True       # bool
scores = [10, 20]      # list (reference)
user = {"id": 1}       # dict (reference)

a = 5
b = a
b = 10                 # a remains 5

obj1 = {"x": 10}
obj2 = obj1
obj2["x"] = 20         # obj1["x"] also becomes 20`}],complexity:[{operation:"Read or write a variable",time:"O(1)",space:"O(1)"},{operation:"Copy a primitive",time:"O(1)",space:"O(1)"},{operation:"Copy a reference",time:"O(1)",space:"O(1)"},{operation:"Copy an array of n values",time:"O(n)",space:"O(n)"}],practice:[],refs:[{label:"MDN — JavaScript data types",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures"},{label:"Python — built-in types",href:"https://docs.python.org/3/library/stdtypes.html"}]},{slug:"conditions-and-loops",code:"CONDITIONS_AND_LOOPS",title:"Conditions & Loops (if / else, for, while)",phase:"Programming Foundations",summary:"How a program chooses a branch and repeats work, and how those two ideas become the first complexity estimate.",minutes:25,moduleSlug:"programming-foundations",definition:"A condition selects one branch based on a boolean expression. A loop repeats a block while a condition holds or over a sequence of values.",blocks:[{title:"Conditions",paragraphs:["An if statement evaluates a boolean expression and runs one block or another. The important skill is writing the condition so that every possible case is covered, including the empty and boundary cases.","Guard clauses keep deep nesting out of your code: handle the invalid case first, return early, then write the happy path."]},{title:"Loops",paragraphs:["A for loop is best when the number of iterations is known. A while loop is best when the stop condition depends on the work inside the loop.","Every loop needs three things: a starting state, a progress rule that moves toward the stop condition, and a stop condition. Remove any one of them and the loop is either wrong or infinite."]},{title:"Loops and complexity",kind:"note",paragraphs:["One loop over n items is O(n). Two nested loops over the same n items are O(n²). Two loops one after another are O(n + n) = O(n). Counting nested levels is the fastest way to estimate the cost of a brute-force solution."]}],keyPoints:["if / else selects a branch","Guard clauses reduce nesting","for loops suit known iteration counts","while loops suit condition-driven repetition","Nested loops multiply the work"],mistakes:["Writing a loop that never changes the variable in its stop condition.","Forgetting the empty input or the last index.","Using a nested loop when a hash map would remove the inner scan."],codeSamples:[{language:"JavaScript",filename:"loops.js",code:`function firstEven(nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) return nums[i];
  }
  return null;
}

let n = 3;
while (n > 0) {
  console.log(n);
  n--; // progress toward the stop condition
}`},{language:"Python",filename:"loops.py",code:`def first_even(nums):
    for value in nums:
        if value % 2 == 0:
            return value
    return None

n = 3
while n > 0:
    print(n)
    n -= 1  # progress toward the stop condition`}],complexity:[{operation:"One branch",time:"O(1)",space:"O(1)"},{operation:"One loop over n items",time:"O(n)",space:"O(1)"},{operation:"Nested loops over n items",time:"O(n²)",space:"O(1)"}],practice:[],refs:[{label:"MDN — control flow",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling"}]},{slug:"classes-and-objects",code:"CLASSES_AND_OBJECTS",title:"Classes & Objects (OOP Basics)",phase:"Programming Foundations",summary:"Group state and behaviour into a type, then create instances that carry their own data.",minutes:25,moduleSlug:"programming-foundations",definition:"A class is a blueprint for an object. An object is an instance of a class with its own state and access to the class's behaviour.",blocks:[{title:"Why classes appear in DSA",paragraphs:["A linked-list node, a tree node, a graph edge and a heap entry are all small objects. They bundle the data with the links or metadata needed to move through the structure.","You do not need a large object-oriented design to solve algorithm problems. You need to know how to create a small type, initialise its fields and keep its invariants true."]},{title:"State and behaviour",paragraphs:["Fields hold state. Methods describe behaviour. A good object keeps its fields consistent: if a method changes the size, it also updates the pointer to the last node.","In interviews, prefer the smallest type that makes the structure readable. A node with a value and a next pointer is enough for a linked list."]},{title:"Objects and references",kind:"warning",paragraphs:["Creating an object gives you a reference to it. Assigning that reference to another variable does not clone the object. This is exactly the behaviour that makes linked structures possible, and exactly the behaviour that causes aliasing bugs."]}],keyPoints:["A class defines fields and methods","An object is an instance with its own state","Constructors initialise invariants","References connect objects into structures"],mistakes:["Forgetting to initialise a field and relying on a default.","Sharing one mutable object across every instance.","Adding behaviour that breaks the structure's invariant."],codeSamples:[{language:"JavaScript",filename:"node.js",code:`class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

const tail = new ListNode(2);
const head = new ListNode(1, tail);

console.log(head.next.value); // 2`},{language:"Java",filename:"ListNode.java",code:`class ListNode {
    int value;
    ListNode next;

    ListNode(int value) {
        this.value = value;
        this.next = null;
    }
}

ListNode tail = new ListNode(2);
ListNode head = new ListNode(1);
head.next = tail;`}],complexity:[{operation:"Create an object",time:"O(1)",space:"O(1)"},{operation:"Read a field",time:"O(1)",space:"O(1)"},{operation:"Create n nodes",time:"O(n)",space:"O(n)"}],practice:[],refs:[{label:"MDN — classes",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes"}]},{slug:"object-reference",code:"OBJECT_REFERENCE",title:"Object Reference (Value vs Reference)",phase:"Programming Foundations",summary:"Why two variables can point at the same object, and how to predict whether a change is visible through both.",minutes:25,moduleSlug:"programming-foundations",definition:"A reference is a value that points to an object. Copying a reference creates a second way to reach the same object; it does not copy the object.",blocks:[{title:"The core rule",kind:"definition",paragraphs:["Primitive values are copied on assignment. Object references are copied on assignment. The object itself stays in one place.","This means a function can mutate the caller's object without returning anything. It also means a shallow copy still shares every nested object."]},{title:"Predicting the output",paragraphs:["When you see an assignment, ask two questions: what is the type, and does the right-hand side create a new object or reuse an existing one? Then trace every mutation to the object it reaches.","Drawing boxes for objects and arrows for references is faster than reading the code three times. Use that sketch in the interview too."]},{title:"Shallow vs deep copy",kind:"note",paragraphs:["A shallow copy creates a new outer container but keeps the same references to nested objects. A deep copy recursively creates new containers. Most bugs come from assuming a shallow copy is deep."]}],keyPoints:["Primitive assignment copies the value","Reference assignment copies the pointer","Mutation through one reference is visible through another","Shallow copies share nested objects"],mistakes:["Assuming a spread copy duplicates nested arrays and objects.","Comparing objects by value when the language compares references.","Mutating a shared object inside a helper function."],codeSamples:[{language:"JavaScript",filename:"reference.js",code:`const original = { user: { name: "A" } };
const shallow = { ...original };

shallow.user.name = "B";
console.log(original.user.name); // "B" — same nested object

const deep = structuredClone(original);
deep.user.name = "C";
console.log(original.user.name); // "B" — deep copy is independent`},{language:"Python",filename:"reference.py",code:`import copy

original = {"user": {"name": "A"}}
shallow = original.copy()

shallow["user"]["name"] = "B"
print(original["user"]["name"])  # "B" — same nested dict

deep = copy.deepcopy(original)
deep["user"]["name"] = "C"
print(original["user"]["name"])  # "B" — independent`}],complexity:[{operation:"Copy a reference",time:"O(1)",space:"O(1)"},{operation:"Shallow copy of n keys",time:"O(n)",space:"O(n)"},{operation:"Deep copy of a tree",time:"O(nodes)",space:"O(nodes)"}],practice:[],refs:[{label:"MDN — object references",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects"}]},{slug:"stack-vs-heap",code:"STACK_VS_HEAP",title:"Stack vs Heap Memory",phase:"Programming Foundations",summary:"Where local values and objects live, why recursion can overflow the stack, and what allocation costs.",minutes:25,moduleSlug:"programming-foundations",definition:"The call stack stores active function frames and local primitives. The heap stores dynamically allocated objects whose lifetime is not tied to a single call.",blocks:[{title:"Two regions, two lifetimes",paragraphs:["Each function call gets a stack frame. The frame holds parameters, local variables and the return address. When the function returns, the frame is popped automatically.","Objects that must outlive a call are allocated on the heap. A variable on the stack can hold a reference to a heap object. The reference is cleaned up with the frame; the object is cleaned up later by the garbage collector or by an explicit free."]},{title:"Why recursion overflows",paragraphs:["Every recursive call adds a frame. The stack is finite. If the recursion is too deep or the base case never arrives, the process runs out of stack and crashes.","You can often replace deep recursion with an explicit stack on the heap, or with an iterative loop. That trades code complexity for a much larger depth limit."]},{title:"What this means for DSA",kind:"note",paragraphs:["Space complexity includes the call stack. A recursive DFS on a graph with depth n uses O(n) stack space even if it allocates no other arrays. When an interviewer asks for O(1) extra space, recursion is usually not free."]}],keyPoints:["The stack holds active call frames","The heap holds dynamically allocated objects","Stack memory is reclaimed on return","Deep recursion consumes stack space"],mistakes:["Forgetting the call stack when stating space complexity.","Assuming a heap allocation is free because it is automatic in a managed language.","Using recursion on a path that can be millions of calls deep."],codeSamples:[{language:"JavaScript",filename:"memory.js",code:`function sumTo(n) {
  // Each call adds a frame to the call stack.
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}

// Iterative version uses O(1) stack space.
function sumLoop(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  return total;
}`},{language:"Java",filename:"Memory.java",code:`int sumTo(int n) {
    if (n == 0) return 0;
    return n + sumTo(n - 1); // one frame per call
}

int sumLoop(int n) {
    int total = 0;
    for (int i = 1; i <= n; i++) total += i;
    return total;
}`}],complexity:[{operation:"Push a call frame",time:"O(1)",space:"O(1)"},{operation:"Recursion depth n",time:"O(n)",space:"O(n)"},{operation:"Heap allocation",time:"O(1) amortised",space:"O(size)"}],practice:[],refs:[{label:"MDN — memory management",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management"}]}]},o("Time and Space Complexity","time-and-space-complexity"),o("Arrays","arrays"),o("Strings","strings"),o("Recursion","recursion"),o("Hashing","hashing"),o("Backtracking","backtracking"),o("Linked List","linked-lists"),o("Stack","stacks"),o("Queue","queues"),o("Sorting & Searching","sorting-and-searching"),o("Trees","trees"),o("Binary Search Tree","binary-search-tree"),o("Heap and Priority Queue","heaps"),o("Trie","tries"),o("Graphs","graphs"),o("Dynamic Programming","dynamic-programming")].map(e=>({...e,lessons:e.lessons.map(e=>({...e,codeSamples:function(e,t){let s=new Map;for(let a of[...t,...n[e]??[]])s.set(a.language,a);return a.flatMap(e=>{let t=s.get(e);return t?[t]:[]})}(e.code,e.codeSamples)}))})),c=l.flatMap(e=>e.lessons);c[0],e.s(["Q",0,c,"O",0,l,"n",0,function(e){return l.find(t=>t.name===e)?.lessons[0]},"d",0,function(e){return c.find(t=>t.slug===e)},"H",0,function(e){return`/dsa/lessons/${e}/`}],4068)}]);