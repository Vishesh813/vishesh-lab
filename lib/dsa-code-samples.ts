import type { CodeSample } from "./curriculum";

const LANGUAGE_ORDER = ["JavaScript", "Java", "Python", "C++"] as const;

/**
 * Four-language samples for every DSA lesson. The existing curriculum samples
 * are kept as the source of truth for one language; this map fills the rest so
 * the lesson code switch always exposes JavaScript, Java, Python and C++.
 */
export const extraCodeSamples: Record<string, CodeSample[]> = {
  PROGRAMMING_TOPIC_INTRO: [
    {
      language: "Java",
      filename: "Average.java",
      code: `int[] scores = {72, 88, 91};
int total = 0;

for (int score : scores) {
    total += score;
}

double average = (double) total / scores.length;
System.out.println(average);`,
    },
    {
      language: "C++",
      filename: "average.cpp",
      code: `std::vector<int> scores = {72, 88, 91};
int total = 0;

for (int score : scores) {
    total += score;
}

double average = static_cast<double>(total) / scores.size();
std::cout << average << std::endl;`,
    },
  ],
  CONDITIONS_AND_LOOPS: [
    {
      language: "Java",
      filename: "FirstEven.java",
      code: `int firstEven(int[] nums) {
    for (int n : nums) {
        if (n % 2 == 0) return n;
    }
    return -1;
}`,
    },
    {
      language: "C++",
      filename: "first_even.cpp",
      code: `int firstEven(const std::vector<int>& nums) {
    for (int n : nums) {
        if (n % 2 == 0) return n;
    }
    return -1;
}`,
    },
  ],
  CLASSES_AND_OBJECTS: [
    {
      language: "Python",
      filename: "list_node.py",
      code: `class ListNode:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

node = ListNode(3, ListNode(5))
print(node.value, node.next.value)`,
    },
    {
      language: "C++",
      filename: "list_node.cpp",
      code: `struct ListNode {
    int value;
    ListNode* next;
    ListNode(int value, ListNode* next = nullptr)
        : value(value), next(next) {}
};

ListNode* node = new ListNode(3, new ListNode(5));
std::cout << node->value << " " << node->next->value << std::endl;
delete node->next;
delete node;`,
    },
  ],
  OBJECT_REFERENCE: [
    {
      language: "Java",
      filename: "Reference.java",
      code: `int[] original = {1, 2, 3};
int[] alias = original;
alias[0] = 99; // original[0] is now 99

int[] copy = original.clone();
copy[0] = 7; // original[0] stays 99`,
    },
    {
      language: "C++",
      filename: "reference.cpp",
      code: `std::vector<int> original = {1, 2, 3};
std::vector<int>& alias = original;
alias[0] = 99; // original[0] is now 99

std::vector<int> copy = original;
copy[0] = 7; // original[0] stays 99`,
    },
  ],
  STACK_VS_HEAP: [
    {
      language: "Python",
      filename: "stack_heap.py",
      code: `def sum_to(n):
    if n == 0:
        return 0
    return n + sum_to(n - 1)

print(sum_to(4))  # call stack depth 5

values = [0] * 1_000_000  # heap allocation`,
    },
    {
      language: "C++",
      filename: "stack_heap.cpp",
      code: `int sumTo(int n) {
    if (n == 0) return 0;
    return n + sumTo(n - 1);
}

int main() {
    std::cout << sumTo(4) << std::endl; // stack depth 5
    std::vector<int> values(1000000);   // heap allocation
}`,
    },
  ],
  TIME_AND_SPACE_COMPLEXITY: [
    {
      language: "JavaScript",
      filename: "pair_exists.js",
      code: `function pairExists(nums, target) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(target - n)) return true;
    seen.add(n);
  }
  return false;
}`,
    },
    {
      language: "Java",
      filename: "PairExists.java",
      code: `boolean pairExists(int[] nums, int target) {
    Set<Integer> seen = new HashSet<>();
    for (int n : nums) {
        if (seen.contains(target - n)) return true;
        seen.add(n);
    }
    return false;
}`,
    },
    {
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
    {
      language: "C++",
      filename: "pair_exists.cpp",
      code: `bool pairExists(const std::vector<int>& nums, int target) {
    std::unordered_set<int> seen;
    for (int n : nums) {
        if (seen.count(target - n)) return true;
        seen.insert(n);
    }
    return false;
}`,
    },
  ],
  ARRAYS: [
    {
      language: "JavaScript",
      filename: "pair_sum.js",
      code: `function pairSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
    },
    {
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
    {
      language: "Python",
      filename: "pair_sum.py",
      code: `def pair_sum(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return [left, right]
        if total < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]`,
    },
    {
      language: "C++",
      filename: "pair_sum.cpp",
      code: `std::vector<int> pairSum(const std::vector<int>& nums, int target) {
    int left = 0, right = static_cast<int>(nums.size()) - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return {left, right};
        if (sum < target) ++left;
        else --right;
    }
    return {-1, -1};
}`,
    },
  ],
  STRINGS: [
    {
      language: "JavaScript",
      filename: "palindrome.js",
      code: `function isPalindrome(text) {
  let left = 0;
  let right = text.length - 1;
  while (left < right) {
    if (text[left] !== text[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    },
    {
      language: "Java",
      filename: "Palindrome.java",
      code: `boolean isPalindrome(String text) {
    int left = 0, right = text.length() - 1;
    while (left < right) {
        if (text.charAt(left) != text.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}`,
    },
    {
      language: "Python",
      filename: "palindrome.py",
      code: `def is_palindrome(text):
    left, right = 0, len(text) - 1
    while left < right:
        if text[left] != text[right]:
            return False
        left += 1
        right -= 1
    return True`,
    },
    {
      language: "C++",
      filename: "palindrome.cpp",
      code: `bool isPalindrome(const std::string& text) {
    int left = 0, right = static_cast<int>(text.size()) - 1;
    while (left < right) {
        if (text[left] != text[right]) return false;
        ++left;
        --right;
    }
    return true;
}`,
    },
  ],
  RECURSION: [
    {
      language: "JavaScript",
      filename: "factorial.js",
      code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
    },
    {
      language: "Java",
      filename: "Factorial.java",
      code: `long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
    },
    {
      language: "Python",
      filename: "factorial.py",
      code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    },
    {
      language: "C++",
      filename: "factorial.cpp",
      code: `long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
    },
  ],
  HASHING: [
    {
      language: "JavaScript",
      filename: "two_sum.js",
      code: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    },
    {
      language: "Java",
      filename: "TwoSum.java",
      code: `int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
    },
    {
      language: "Python",
      filename: "two_sum.py",
      code: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], i]
        seen[n] = i
    return []`,
    },
    {
      language: "C++",
      filename: "two_sum.cpp",
      code: `std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;
    for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
    },
  ],
  BACKTRACKING: [
    {
      language: "JavaScript",
      filename: "subsets.js",
      code: `function subsets(nums) {
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
}`,
    },
    {
      language: "Java",
      filename: "Subsets.java",
      code: `List<List<Integer>> subsets(int[] nums) {
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
}`,
    },
    {
      language: "Python",
      filename: "subsets.py",
      code: `def subsets(nums):
    result, path = [], []

    def backtrack(start):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()

    backtrack(0)
    return result`,
    },
    {
      language: "C++",
      filename: "subsets.cpp",
      code: `void backtrack(const std::vector<int>& nums, int start,
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
}`,
    },
  ],
  LINKED_LISTS: [
    {
      language: "JavaScript",
      filename: "reverse_list.js",
      code: `function reverseList(head) {
  let previous = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }
  return previous;
}`,
    },
    {
      language: "Java",
      filename: "ReverseList.java",
      code: `ListNode reverseList(ListNode head) {
    ListNode previous = null;
    ListNode current = head;
    while (current != null) {
        ListNode next = current.next;
        current.next = previous;
        previous = current;
        current = next;
    }
    return previous;
}`,
    },
    {
      language: "Python",
      filename: "reverse_list.py",
      code: `def reverse_list(head):
    previous = None
    current = head
    while current:
        next_node = current.next
        current.next = previous
        previous = current
        current = next_node
    return previous`,
    },
    {
      language: "C++",
      filename: "reverse_list.cpp",
      code: `ListNode* reverseList(ListNode* head) {
    ListNode* previous = nullptr;
    ListNode* current = head;
    while (current != nullptr) {
        ListNode* next = current->next;
        current->next = previous;
        previous = current;
        current = next;
    }
    return previous;
}`,
    },
  ],
  STACKS: [
    {
      language: "JavaScript",
      filename: "valid_parentheses.js",
      code: `function isValid(s) {
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
}`,
    },
    {
      language: "Java",
      filename: "ValidParentheses.java",
      code: `boolean isValid(String s) {
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
}`,
    },
    {
      language: "Python",
      filename: "valid_parentheses.py",
      code: `def is_valid(s):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif not stack or stack.pop() != pairs[ch]:
            return False
    return not stack`,
    },
    {
      language: "C++",
      filename: "valid_parentheses.cpp",
      code: `bool isValid(const std::string& s) {
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
}`,
    },
  ],
  QUEUES: [
    {
      language: "JavaScript",
      filename: "bfs.js",
      code: `function bfs(graph, start) {
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
}`,
    },
    {
      language: "Java",
      filename: "Bfs.java",
      code: `List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
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
}`,
    },
    {
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
        for next_node in graph[node]:
            if next_node not in seen:
                seen.add(next_node)
                queue.append(next_node)
    return order`,
    },
    {
      language: "C++",
      filename: "bfs.cpp",
      code: `std::vector<int> bfs(
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
}`,
    },
  ],
  SORTING_AND_SEARCHING: [
    {
      language: "JavaScript",
      filename: "binary_search.js",
      code: `function binarySearch(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    },
    {
      language: "Java",
      filename: "BinarySearch.java",
      code: `int binarySearch(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    },
    {
      language: "Python",
      filename: "binary_search.py",
      code: `def binary_search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    },
    {
      language: "C++",
      filename: "binary_search.cpp",
      code: `int binarySearch(const std::vector<int>& nums, int target) {
    int low = 0, high = static_cast<int>(nums.size()) - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    },
  ],
  TREES: [
    {
      language: "JavaScript",
      filename: "inorder.js",
      code: `function inorder(node, visit = []) {
  if (!node) return visit;
  inorder(node.left, visit);
  visit.push(node.value);
  inorder(node.right, visit);
  return visit;
}`,
    },
    {
      language: "Java",
      filename: "Inorder.java",
      code: `void inorder(TreeNode node, List<Integer> visit) {
    if (node == null) return;
    inorder(node.left, visit);
    visit.add(node.value);
    inorder(node.right, visit);
}`,
    },
    {
      language: "Python",
      filename: "inorder.py",
      code: `def inorder(node, visit=None):
    if visit is None:
        visit = []
    if node is None:
        return visit
    inorder(node.left, visit)
    visit.append(node.value)
    inorder(node.right, visit)
    return visit`,
    },
    {
      language: "C++",
      filename: "inorder.cpp",
      code: `void inorder(TreeNode* node, std::vector<int>& visit) {
    if (node == nullptr) return;
    inorder(node->left, visit);
    visit.push_back(node->value);
    inorder(node->right, visit);
}`,
    },
  ],
  BINARY_SEARCH_TREE: [
    {
      language: "JavaScript",
      filename: "validate_bst.js",
      code: `function isValidBst(node, low = -Infinity, high = Infinity) {
  if (!node) return true;
  if (node.value <= low || node.value >= high) return false;
  return isValidBst(node.left, low, node.value) &&
    isValidBst(node.right, node.value, high);
}`,
    },
    {
      language: "Java",
      filename: "ValidateBst.java",
      code: `boolean isValidBst(TreeNode node, long low, long high) {
    if (node == null) return true;
    if (node.value <= low || node.value >= high) return false;
    return isValidBst(node.left, low, node.value)
        && isValidBst(node.right, node.value, high);
}

boolean isValidBst(TreeNode root) {
    return isValidBst(root, Long.MIN_VALUE, Long.MAX_VALUE);
}`,
    },
    {
      language: "Python",
      filename: "validate_bst.py",
      code: `def is_valid_bst(node, low=float("-inf"), high=float("inf")):
    if node is None:
        return True
    if node.value <= low or node.value >= high:
        return False
    return (
        is_valid_bst(node.left, low, node.value)
        and is_valid_bst(node.right, node.value, high)
    )`,
    },
    {
      language: "C++",
      filename: "validate_bst.cpp",
      code: `bool isValidBst(TreeNode* node, long long low, long long high) {
    if (node == nullptr) return true;
    if (node->value <= low || node->value >= high) return false;
    return isValidBst(node->left, low, node->value)
        && isValidBst(node->right, node->value, high);
}`,
    },
  ],
  HEAPS: [
    {
      language: "JavaScript",
      filename: "kth_largest.js",
      code: `class MinHeap {
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
}`,
    },
    {
      language: "Java",
      filename: "KthLargest.java",
      code: `int kthLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int n : nums) {
        heap.add(n);
        if (heap.size() > k) heap.poll();
    }
    return heap.peek();
}`,
    },
    {
      language: "Python",
      filename: "kth_largest.py",
      code: `import heapq

def kth_largest(nums, k):
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
    },
    {
      language: "C++",
      filename: "kth_largest.cpp",
      code: `int kthLargest(const std::vector<int>& nums, int k) {
    std::priority_queue<int, std::vector<int>, std::greater<int>> heap;
    for (int n : nums) {
        heap.push(n);
        if (static_cast<int>(heap.size()) > k) heap.pop();
    }
    return heap.top();
}`,
    },
  ],
  TRIES: [
    {
      language: "JavaScript",
      filename: "trie.js",
      code: `class TrieNode {
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
}`,
    },
    {
      language: "Java",
      filename: "Trie.java",
      code: `class TrieNode {
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
}`,
    },
    {
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
    {
      language: "C++",
      filename: "trie.cpp",
      code: `struct TrieNode {
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
};`,
    },
  ],
  GRAPHS: [
    {
      language: "JavaScript",
      filename: "dfs.js",
      code: `function dfs(graph, node, seen = new Set()) {
  if (seen.has(node)) return;
  seen.add(node);
  console.log(node);
  for (const next of graph[node]) dfs(graph, next, seen);
}`,
    },
    {
      language: "Java",
      filename: "Dfs.java",
      code: `void dfs(Map<Integer, List<Integer>> graph, int node, Set<Integer> seen) {
    if (!seen.add(node)) return;
    System.out.println(node);
    for (int next : graph.getOrDefault(node, List.of())) {
        dfs(graph, next, seen);
    }
}`,
    },
    {
      language: "Python",
      filename: "dfs.py",
      code: `def dfs(graph, node, seen=None):
    if seen is None:
        seen = set()
    if node in seen:
        return
    seen.add(node)
    print(node)
    for next_node in graph[node]:
        dfs(graph, next_node, seen)`,
    },
    {
      language: "C++",
      filename: "dfs.cpp",
      code: `void dfs(const std::unordered_map<int, std::vector<int>>& graph,
         int node, std::unordered_set<int>& seen) {
    if (!seen.insert(node).second) return;
    std::cout << node << std::endl;
    for (int next : graph.at(node)) dfs(graph, next, seen);
}`,
    },
  ],
  DYNAMIC_PROGRAMMING: [
    {
      language: "JavaScript",
      filename: "house_robber.js",
      code: `function houseRobber(nums) {
  let previous = 0;
  let current = 0;
  for (const n of nums) {
    const next = Math.max(current, previous + n);
    previous = current;
    current = next;
  }
  return current;
}`,
    },
    {
      language: "Java",
      filename: "HouseRobber.java",
      code: `int houseRobber(int[] nums) {
    int previous = 0, current = 0;
    for (int n : nums) {
        int next = Math.max(current, previous + n);
        previous = current;
        current = next;
    }
    return current;
}`,
    },
    {
      language: "Python",
      filename: "house_robber.py",
      code: `def house_robber(nums):
    previous = current = 0
    for n in nums:
        previous, current = current, max(current, previous + n)
    return current`,
    },
    {
      language: "C++",
      filename: "house_robber.cpp",
      code: `int houseRobber(const std::vector<int>& nums) {
    int previous = 0, current = 0;
    for (int n : nums) {
        int next = std::max(current, previous + n);
        previous = current;
        current = next;
    }
    return current;
}`,
    },
  ],
};

export function completeCodeSamples(code: string, existing: CodeSample[]): CodeSample[] {
  const merged = new Map<string, CodeSample>();
  for (const sample of [...existing, ...(extraCodeSamples[code] ?? [])]) {
    merged.set(sample.language, sample);
  }
  return LANGUAGE_ORDER.flatMap((language) => {
    const sample = merged.get(language);
    return sample ? [sample] : [];
  });
}
