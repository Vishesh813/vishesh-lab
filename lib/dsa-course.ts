import {
  modules,
  type CodeSample,
  type ComplexityRow,
  type Reference,
} from "./curriculum";
import { completeCodeSamples } from "./dsa-code-samples";

export type LessonBlock = {
  title: string;
  kind?: "definition" | "note" | "warning" | "steps";
  paragraphs: string[];
  bullets?: string[];
};

export type DsaLesson = {
  slug: string;
  code: string;
  title: string;
  phase: string;
  summary: string;
  minutes: number;
  moduleSlug: string;
  definition: string;
  blocks: LessonBlock[];
  keyPoints: string[];
  mistakes: string[];
  codeSamples: CodeSample[];
  complexity: ComplexityRow[];
  practice: string[];
  refs: Reference[];
};

export type DsaPhase = {
  slug: string;
  name: string;
  lessons: DsaLesson[];
};

const phaseForModule: Record<string, string> = {
  "programming-foundations": "Programming Foundations",
  "time-and-space-complexity": "Time and Space Complexity",
  arrays: "Arrays",
  strings: "Strings",
  recursion: "Recursion",
  hashing: "Hashing",
  backtracking: "Backtracking",
  "linked-lists": "Linked List",
  stacks: "Stack",
  queues: "Queue",
  "sorting-and-searching": "Sorting & Searching",
  trees: "Trees",
  "binary-search-tree": "Binary Search Tree",
  heaps: "Heap and Priority Queue",
  tries: "Trie",
  graphs: "Graphs",
  "dynamic-programming": "Dynamic Programming",
};

const definitions: Record<string, string> = {
  "time-and-space-complexity":
    "Complexity is a way to describe how an algorithm's work grows as the input grows, independent of the machine it runs on.",
  arrays:
    "An array is a contiguous block of memory holding values of the same type, addressed by index.",
  strings:
    "A string is an ordered sequence of characters, usually stored as an array with an encoding and an immutable or mutable contract.",
  recursion:
    "Recursion is a function that solves a problem by calling itself on a smaller instance, with a base case that stops the chain.",
  hashing:
    "A hash map stores key-value pairs by turning each key into an array index through a hash function, giving average O(1) lookup.",
  backtracking:
    "Backtracking is a depth-first search over a decision tree: choose, explore, then undo the choice when it cannot lead to a valid answer.",
  "linked-lists":
    "A linked list is a chain of nodes, each holding a value and a reference to the next node, so insertion is cheap but indexing is linear.",
  stacks:
    "A stack is a last-in, first-out collection with push, pop and peek operations at one end.",
  queues:
    "A queue is a first-in, first-out collection with enqueue at the back and dequeue at the front.",
  "sorting-and-searching":
    "Sorting arranges data in an order; searching finds a target. The choice of algorithm is a trade between time, space and stability.",
  trees:
    "A tree is a connected acyclic graph with a root, where every node except the root has exactly one parent.",
  "binary-search-tree":
    "A binary search tree is a binary tree where every left descendant is smaller than the node and every right descendant is larger.",
  heaps:
    "A heap is a complete binary tree stored in an array that keeps the smallest or largest value at the root.",
  tries:
    "A trie is a tree keyed by characters, where each path from the root spells a prefix and shared prefixes share nodes.",
  graphs:
    "A graph is a set of vertices connected by edges, used to model relationships, networks and dependencies.",
  "dynamic-programming":
    "Dynamic programming solves a problem by combining solutions to overlapping subproblems, storing each result once.",
};

const mistakes: Record<string, string[]> = {
  "time-and-space-complexity": [
    "Counting every line as one unit instead of looking at how the work grows.",
    "Forgetting the space used by the call stack in a recursive solution.",
    "Assuming a hash map is always O(1), even when collisions or resizing dominate.",
  ],
  arrays: [
    "Inserting or deleting in the middle and calling the whole operation O(1).",
    "Off-by-one errors at the last index or in a half-open range.",
    "Assuming a shallow copy duplicates nested objects.",
  ],
  strings: [
    "Building a new string inside a loop when a list or builder would avoid repeated copies.",
    "Comparing strings with == in a language where that compares references.",
    "Forgetting that many languages treat strings as immutable.",
  ],
  recursion: [
    "Missing or unreachable base case, which produces a stack overflow.",
    "Recomputing the same subproblem instead of memoising it.",
    "Mutating shared state across branches without undoing the change.",
  ],
  hashing: [
    "Using a mutable object as a key and changing it after insertion.",
    "Assuming iteration order is guaranteed when the contract does not promise it.",
    "Ignoring the worst case when an adversary can force collisions.",
  ],
  backtracking: [
    "Forgetting to undo a choice before trying the next branch.",
    "Exploring branches that are already known to be invalid.",
    "Copying the whole path on every call instead of adding and removing one item.",
  ],
  "linked-lists": [
    "Losing the rest of the list by reassigning next before saving it.",
    "Forgetting to update the head or tail pointer on insert and delete.",
    "Using a linked list where an array's cache locality would be faster.",
  ],
  stacks: [
    "Popping from an empty stack without a guard.",
    "Using a stack when the problem needs first-in, first-out order.",
    "Forgetting that recursion already uses the call stack.",
  ],
  queues: [
    "Removing from the front of a Python list in a loop, which is O(n) each time.",
    "Letting an unbounded queue absorb a producer that is faster than its consumers.",
    "Confusing a queue with a stack in a breadth-first traversal.",
  ],
  "sorting-and-searching":
    [
      "Applying binary search to data that is not sorted.",
      "Using a comparison sort when counting sort fits the value range.",
      "Forgetting that an in-place sort may not be stable.",
    ],
  trees: [
    "Confusing depth with height.",
    "Forgetting the null check before reading a child.",
    "Assuming every binary tree is a binary search tree.",
  ],
  "binary-search-tree": [
    "Validating only the immediate children instead of the full allowed range.",
    "Letting duplicate keys go to both sides without a defined rule.",
    "Forgetting that an unbalanced BST degrades to a linked list.",
  ],
  heaps: [
    "Assuming a heap keeps the whole array sorted.",
    "Using a min-heap when the problem needs the largest k values.",
    "Forgetting to sift down after replacing the root.",
  ],
  tries: [
    "Storing the whole string at every node instead of a terminal flag.",
    "Forgetting to free nodes after deletion.",
    "Using a trie when a hash map would answer the same query with less memory.",
  ],
  graphs: [
    "Forgetting the visited set and looping forever on a cycle.",
    "Using BFS when the problem needs depth-first path reconstruction.",
    "Ignoring disconnected components.",
  ],
  "dynamic-programming": [
    "Defining a state that does not contain enough information to make the next decision.",
    "Filling the table in an order that reads values not computed yet.",
    "Using a full table when only the previous row is needed.",
  ],
};

function moduleLesson(slug: string): DsaLesson {
  const topicModule = modules.find((entry) => entry.slug === slug);
  if (!topicModule) throw new Error(`Unknown module: ${slug}`);

  return {
    slug: topicModule.slug,
    code: slug.toUpperCase().replace(/-/g, "_"),
    title: topicModule.title,
    phase: phaseForModule[slug] ?? topicModule.phase,
    summary: topicModule.summary,
    minutes: topicModule.minutes,
    moduleSlug: topicModule.slug,
    definition: definitions[slug] ?? topicModule.mentalModel,
    blocks: [
      {
        title: "Why it matters",
        paragraphs: [topicModule.summary, topicModule.mentalModel],
      },
      {
        title: "Core ideas",
        paragraphs: [],
        bullets: topicModule.ideas,
      },
      {
        title: "What to practise",
        paragraphs: [
          "The checklist is the working list. Tick a point when you can explain it without notes, then solve the mapped problem.",
        ],
        bullets: topicModule.topics,
      },
    ],
    keyPoints: topicModule.topics,
    mistakes: mistakes[slug] ?? [],
    codeSamples: [topicModule.code],
    complexity: topicModule.complexity,
    practice: topicModule.practice,
    refs: topicModule.refs,
  };
}

const programmingFoundations: DsaPhase = {
  slug: "programming-foundations",
  name: "Programming Foundations",
  lessons: [
    {
      slug: "programming-foundations",
      code: "PROGRAMMING_TOPIC_INTRO",
      title: "Programming Foundations",
      phase: "Programming Foundations",
      summary:
        "The small set of programming ideas every data structure relies on: values, control flow, functions, objects and memory.",
      minutes: 20,
      moduleSlug: "programming-foundations",
      definition:
        "Programming foundations are the primitives you combine to build every algorithm: values, decisions, repetition, functions and references.",
      blocks: [
        {
          title: "Start here",
          paragraphs: [
            "Data structures are not a separate language. They are built from the same values, conditions, loops and references you already use in a small program.",
            "This phase slows down long enough to make those primitives explicit. If you can trace a loop and predict what a reference change does, the rest of the path will feel much less magical.",
          ],
        },
        {
          title: "What this phase covers",
          paragraphs: [],
          bullets: [
            "Variables and data types: what a value is and how it is stored.",
            "Conditions and loops: how a program chooses and repeats work.",
            "Classes and objects: how behaviour and state are grouped.",
            "Object references: why two variables can point at the same data.",
            "Stack and heap memory: where values live and what that costs.",
          ],
        },
        {
          title: "How to use this phase",
          paragraphs: [
            "Read one lesson, run the code sample in your head, then change one line and predict the result. The goal is not speed; it is a reliable mental model you can use under pressure.",
          ],
        },
      ],
      keyPoints: [
        "Variables hold values of a declared or inferred type",
        "Conditions choose a branch",
        "Loops repeat work",
        "Functions isolate behaviour",
        "References can share data",
      ],
      mistakes: [
        "Skipping the basics because they look too easy, then misreading a reference bug later.",
        "Memorising syntax without tracing what happens to the value.",
      ],
      codeSamples: [
        {
          language: "JavaScript",
          filename: "foundations.js",
          code: `const scores = [72, 88, 91];
let total = 0;

for (const score of scores) {
  total += score;
}

const average = total / scores.length;
console.log(average); // 83.666...`,
        },
        {
          language: "Python",
          filename: "foundations.py",
          code: `scores = [72, 88, 91]
total = 0

for score in scores:
    total += score

average = total / len(scores)
print(average)  # 83.666...`,
        },
      ],
      complexity: [
        { operation: "Read one value", time: "O(1)", space: "O(1)" },
        { operation: "Loop over n values", time: "O(n)", space: "O(1)" },
        { operation: "Store n values", time: "O(n)", space: "O(n)" },
      ],
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
      slug: "programming-basics",
      code: "PROGRAMMING_BASICS",
      title: "Programming Basics (Variables, Data Types)",
      phase: "Programming Foundations",
      summary:
        "Learn variables and data types with clear explanations, visuals and interview-ready examples.",
      minutes: 30,
      moduleSlug: "programming-foundations",
      definition:
        "A variable is a named storage location whose value can change. A data type defines what kind of value it holds and which operations are valid.",
      blocks: [
        {
          title: "What are variables?",
          kind: "definition",
          paragraphs: [
            "A variable is a name bound to a value in memory. The name lets you read and update that value without remembering its address.",
            "In data structures, variables hold values, references to objects and sometimes the links between nodes. Understanding which of those a variable contains is the difference between a correct algorithm and a mysterious bug.",
          ],
        },
        {
          title: "What are data types?",
          kind: "definition",
          paragraphs: [
            "A data type defines the kind of value a variable can hold, how much memory it occupies and which operations are allowed.",
            "Choosing a type is a correctness decision as much as a memory decision. An integer cannot hold a fractional price; a mutable list shared by two variables can surprise you when one of them changes it.",
          ],
          bullets: [
            "Primitive types: numbers, booleans, characters. They store the value directly.",
            "Reference types: arrays, objects and class instances. They store an address to data held elsewhere.",
            "Composite types: records and collections built from the primitive and reference types.",
          ],
        },
        {
          title: "Value vs reference",
          kind: "warning",
          paragraphs: [
            "Assigning a primitive copies the value. Assigning an object copies the reference, not the object. After that, both variables point at the same data.",
            "This is the single most common source of beginner bugs in arrays, linked lists and trees. If two variables can see the same object, a change through one is visible through the other.",
          ],
        },
        {
          title: "Why it matters in data structures",
          paragraphs: [
            "An array is a block of values. A linked list is a chain of references. A tree is references with a parent-child shape. Every structure is a different arrangement of the same two ideas: values and references.",
            "Once you can answer 'does this assignment copy the value or the reference?', you can reason about aliasing, shallow copies and shared state in an algorithm.",
          ],
        },
        {
          title: "Common beginner mistakes",
          kind: "warning",
          paragraphs: [],
          bullets: [
            "Assuming an array assignment copies every element.",
            "Confusing primitive assignment with object reference assignment.",
            "Ignoring how memory is shared between two variables.",
            "Choosing a type that is too small for the values the program will produce.",
          ],
        },
        {
          title: "Important note",
          kind: "note",
          paragraphs: [
            "A strong understanding of variables, types and references makes linked lists, trees and graphs much easier to learn. If this lesson feels obvious, test yourself by predicting the output of the code sample before running it.",
          ],
        },
      ],
      keyPoints: [
        "A variable is a named storage location",
        "A data type defines valid values and operations",
        "Primitive assignment copies the value",
        "Object assignment copies the reference",
        "Shared references can mutate the same data",
      ],
      mistakes: [
        "Assuming arrays are copied by value.",
        "Confusing primitive assignment with object reference assignment.",
        "Ignoring how memory is shared between variables.",
      ],
      codeSamples: [
        {
          language: "JavaScript",
          filename: "variables.js",
          code: `// Variables and data types in JavaScript
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
obj2.x = 20;             // obj1.x also becomes 20`,
        },
        {
          language: "Java",
          filename: "Variables.java",
          code: `int count = 10;
String name = "Vishesh";
boolean isActive = true;
int[] scores = {10, 20};
User user = new User(1);

int a = 5;
int b = a;
b = 10; // a remains 5

User obj1 = new User(10);
User obj2 = obj1;
obj2.x = 20; // obj1.x also becomes 20`,
        },
        {
          language: "C++",
          filename: "variables.cpp",
          code: `int count = 10;
std::string name = "Vishesh";
bool isActive = true;
std::vector<int> scores = {10, 20};
User user{1};

int a = 5;
int b = a;
b = 10; // a remains 5

User obj1{10};
User& obj2 = obj1;
obj2.x = 20; // obj1.x also becomes 20`,
        },
        {
          language: "Python",
          filename: "variables.py",
          code: `count = 10             # int
name = "Vishesh"       # str
is_active = True       # bool
scores = [10, 20]      # list (reference)
user = {"id": 1}       # dict (reference)

a = 5
b = a
b = 10                 # a remains 5

obj1 = {"x": 10}
obj2 = obj1
obj2["x"] = 20         # obj1["x"] also becomes 20`,
        },
      ],
      complexity: [
        { operation: "Read or write a variable", time: "O(1)", space: "O(1)" },
        { operation: "Copy a primitive", time: "O(1)", space: "O(1)" },
        { operation: "Copy a reference", time: "O(1)", space: "O(1)" },
        { operation: "Copy an array of n values", time: "O(n)", space: "O(n)" },
      ],
      practice: [],
      refs: [
        {
          label: "MDN — JavaScript data types",
          href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
        },
        {
          label: "Python — built-in types",
          href: "https://docs.python.org/3/library/stdtypes.html",
        },
      ],
    },
    {
      slug: "conditions-and-loops",
      code: "CONDITIONS_AND_LOOPS",
      title: "Conditions & Loops (if / else, for, while)",
      phase: "Programming Foundations",
      summary:
        "How a program chooses a branch and repeats work, and how those two ideas become the first complexity estimate.",
      minutes: 25,
      moduleSlug: "programming-foundations",
      definition:
        "A condition selects one branch based on a boolean expression. A loop repeats a block while a condition holds or over a sequence of values.",
      blocks: [
        {
          title: "Conditions",
          paragraphs: [
            "An if statement evaluates a boolean expression and runs one block or another. The important skill is writing the condition so that every possible case is covered, including the empty and boundary cases.",
            "Guard clauses keep deep nesting out of your code: handle the invalid case first, return early, then write the happy path.",
          ],
        },
        {
          title: "Loops",
          paragraphs: [
            "A for loop is best when the number of iterations is known. A while loop is best when the stop condition depends on the work inside the loop.",
            "Every loop needs three things: a starting state, a progress rule that moves toward the stop condition, and a stop condition. Remove any one of them and the loop is either wrong or infinite.",
          ],
        },
        {
          title: "Loops and complexity",
          kind: "note",
          paragraphs: [
            "One loop over n items is O(n). Two nested loops over the same n items are O(n²). Two loops one after another are O(n + n) = O(n). Counting nested levels is the fastest way to estimate the cost of a brute-force solution.",
          ],
        },
      ],
      keyPoints: [
        "if / else selects a branch",
        "Guard clauses reduce nesting",
        "for loops suit known iteration counts",
        "while loops suit condition-driven repetition",
        "Nested loops multiply the work",
      ],
      mistakes: [
        "Writing a loop that never changes the variable in its stop condition.",
        "Forgetting the empty input or the last index.",
        "Using a nested loop when a hash map would remove the inner scan.",
      ],
      codeSamples: [
        {
          language: "JavaScript",
          filename: "loops.js",
          code: `function firstEven(nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) return nums[i];
  }
  return null;
}

let n = 3;
while (n > 0) {
  console.log(n);
  n--; // progress toward the stop condition
}`,
        },
        {
          language: "Python",
          filename: "loops.py",
          code: `def first_even(nums):
    for value in nums:
        if value % 2 == 0:
            return value
    return None

n = 3
while n > 0:
    print(n)
    n -= 1  # progress toward the stop condition`,
        },
      ],
      complexity: [
        { operation: "One branch", time: "O(1)", space: "O(1)" },
        { operation: "One loop over n items", time: "O(n)", space: "O(1)" },
        { operation: "Nested loops over n items", time: "O(n²)", space: "O(1)" },
      ],
      practice: [],
      refs: [
        {
          label: "MDN — control flow",
          href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling",
        },
      ],
    },
    {
      slug: "classes-and-objects",
      code: "CLASSES_AND_OBJECTS",
      title: "Classes & Objects (OOP Basics)",
      phase: "Programming Foundations",
      summary:
        "Group state and behaviour into a type, then create instances that carry their own data.",
      minutes: 25,
      moduleSlug: "programming-foundations",
      definition:
        "A class is a blueprint for an object. An object is an instance of a class with its own state and access to the class's behaviour.",
      blocks: [
        {
          title: "Why classes appear in DSA",
          paragraphs: [
            "A linked-list node, a tree node, a graph edge and a heap entry are all small objects. They bundle the data with the links or metadata needed to move through the structure.",
            "You do not need a large object-oriented design to solve algorithm problems. You need to know how to create a small type, initialise its fields and keep its invariants true.",
          ],
        },
        {
          title: "State and behaviour",
          paragraphs: [
            "Fields hold state. Methods describe behaviour. A good object keeps its fields consistent: if a method changes the size, it also updates the pointer to the last node.",
            "In interviews, prefer the smallest type that makes the structure readable. A node with a value and a next pointer is enough for a linked list.",
          ],
        },
        {
          title: "Objects and references",
          kind: "warning",
          paragraphs: [
            "Creating an object gives you a reference to it. Assigning that reference to another variable does not clone the object. This is exactly the behaviour that makes linked structures possible, and exactly the behaviour that causes aliasing bugs.",
          ],
        },
      ],
      keyPoints: [
        "A class defines fields and methods",
        "An object is an instance with its own state",
        "Constructors initialise invariants",
        "References connect objects into structures",
      ],
      mistakes: [
        "Forgetting to initialise a field and relying on a default.",
        "Sharing one mutable object across every instance.",
        "Adding behaviour that breaks the structure's invariant.",
      ],
      codeSamples: [
        {
          language: "JavaScript",
          filename: "node.js",
          code: `class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

const tail = new ListNode(2);
const head = new ListNode(1, tail);

console.log(head.next.value); // 2`,
        },
        {
          language: "Java",
          filename: "ListNode.java",
          code: `class ListNode {
    int value;
    ListNode next;

    ListNode(int value) {
        this.value = value;
        this.next = null;
    }
}

ListNode tail = new ListNode(2);
ListNode head = new ListNode(1);
head.next = tail;`,
        },
      ],
      complexity: [
        { operation: "Create an object", time: "O(1)", space: "O(1)" },
        { operation: "Read a field", time: "O(1)", space: "O(1)" },
        { operation: "Create n nodes", time: "O(n)", space: "O(n)" },
      ],
      practice: [],
      refs: [
        {
          label: "MDN — classes",
          href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes",
        },
      ],
    },
    {
      slug: "object-reference",
      code: "OBJECT_REFERENCE",
      title: "Object Reference (Value vs Reference)",
      phase: "Programming Foundations",
      summary:
        "Why two variables can point at the same object, and how to predict whether a change is visible through both.",
      minutes: 25,
      moduleSlug: "programming-foundations",
      definition:
        "A reference is a value that points to an object. Copying a reference creates a second way to reach the same object; it does not copy the object.",
      blocks: [
        {
          title: "The core rule",
          kind: "definition",
          paragraphs: [
            "Primitive values are copied on assignment. Object references are copied on assignment. The object itself stays in one place.",
            "This means a function can mutate the caller's object without returning anything. It also means a shallow copy still shares every nested object.",
          ],
        },
        {
          title: "Predicting the output",
          paragraphs: [
            "When you see an assignment, ask two questions: what is the type, and does the right-hand side create a new object or reuse an existing one? Then trace every mutation to the object it reaches.",
            "Drawing boxes for objects and arrows for references is faster than reading the code three times. Use that sketch in the interview too.",
          ],
        },
        {
          title: "Shallow vs deep copy",
          kind: "note",
          paragraphs: [
            "A shallow copy creates a new outer container but keeps the same references to nested objects. A deep copy recursively creates new containers. Most bugs come from assuming a shallow copy is deep.",
          ],
        },
      ],
      keyPoints: [
        "Primitive assignment copies the value",
        "Reference assignment copies the pointer",
        "Mutation through one reference is visible through another",
        "Shallow copies share nested objects",
      ],
      mistakes: [
        "Assuming a spread copy duplicates nested arrays and objects.",
        "Comparing objects by value when the language compares references.",
        "Mutating a shared object inside a helper function.",
      ],
      codeSamples: [
        {
          language: "JavaScript",
          filename: "reference.js",
          code: `const original = { user: { name: "A" } };
const shallow = { ...original };

shallow.user.name = "B";
console.log(original.user.name); // "B" — same nested object

const deep = structuredClone(original);
deep.user.name = "C";
console.log(original.user.name); // "B" — deep copy is independent`,
        },
        {
          language: "Python",
          filename: "reference.py",
          code: `import copy

original = {"user": {"name": "A"}}
shallow = original.copy()

shallow["user"]["name"] = "B"
print(original["user"]["name"])  # "B" — same nested dict

deep = copy.deepcopy(original)
deep["user"]["name"] = "C"
print(original["user"]["name"])  # "B" — independent`,
        },
      ],
      complexity: [
        { operation: "Copy a reference", time: "O(1)", space: "O(1)" },
        { operation: "Shallow copy of n keys", time: "O(n)", space: "O(n)" },
        { operation: "Deep copy of a tree", time: "O(nodes)", space: "O(nodes)" },
      ],
      practice: [],
      refs: [
        {
          label: "MDN — object references",
          href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects",
        },
      ],
    },
    {
      slug: "stack-vs-heap",
      code: "STACK_VS_HEAP",
      title: "Stack vs Heap Memory",
      phase: "Programming Foundations",
      summary:
        "Where local values and objects live, why recursion can overflow the stack, and what allocation costs.",
      minutes: 25,
      moduleSlug: "programming-foundations",
      definition:
        "The call stack stores active function frames and local primitives. The heap stores dynamically allocated objects whose lifetime is not tied to a single call.",
      blocks: [
        {
          title: "Two regions, two lifetimes",
          paragraphs: [
            "Each function call gets a stack frame. The frame holds parameters, local variables and the return address. When the function returns, the frame is popped automatically.",
            "Objects that must outlive a call are allocated on the heap. A variable on the stack can hold a reference to a heap object. The reference is cleaned up with the frame; the object is cleaned up later by the garbage collector or by an explicit free.",
          ],
        },
        {
          title: "Why recursion overflows",
          paragraphs: [
            "Every recursive call adds a frame. The stack is finite. If the recursion is too deep or the base case never arrives, the process runs out of stack and crashes.",
            "You can often replace deep recursion with an explicit stack on the heap, or with an iterative loop. That trades code complexity for a much larger depth limit.",
          ],
        },
        {
          title: "What this means for DSA",
          kind: "note",
          paragraphs: [
            "Space complexity includes the call stack. A recursive DFS on a graph with depth n uses O(n) stack space even if it allocates no other arrays. When an interviewer asks for O(1) extra space, recursion is usually not free.",
          ],
        },
      ],
      keyPoints: [
        "The stack holds active call frames",
        "The heap holds dynamically allocated objects",
        "Stack memory is reclaimed on return",
        "Deep recursion consumes stack space",
      ],
      mistakes: [
        "Forgetting the call stack when stating space complexity.",
        "Assuming a heap allocation is free because it is automatic in a managed language.",
        "Using recursion on a path that can be millions of calls deep.",
      ],
      codeSamples: [
        {
          language: "JavaScript",
          filename: "memory.js",
          code: `function sumTo(n) {
  // Each call adds a frame to the call stack.
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}

// Iterative version uses O(1) stack space.
function sumLoop(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  return total;
}`,
        },
        {
          language: "Java",
          filename: "Memory.java",
          code: `int sumTo(int n) {
    if (n == 0) return 0;
    return n + sumTo(n - 1); // one frame per call
}

int sumLoop(int n) {
    int total = 0;
    for (int i = 1; i <= n; i++) total += i;
    return total;
}`,
        },
      ],
      complexity: [
        { operation: "Push a call frame", time: "O(1)", space: "O(1)" },
        { operation: "Recursion depth n", time: "O(n)", space: "O(n)" },
        { operation: "Heap allocation", time: "O(1) amortised", space: "O(size)" },
      ],
      practice: [],
      refs: [
        {
          label: "MDN — memory management",
          href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management",
        },
      ],
    },
  ],
};

const singlePhase = (name: string, moduleSlug: string): DsaPhase => {
  const lesson = moduleLesson(moduleSlug);
  return {
    slug: moduleSlug,
    name,
    lessons: [
      {
        ...lesson,
        title: name === "Time and Space Complexity" ? "Time & Space Complexity" : name,
        phase: name,
      },
    ],
  };
};

const rawPhases: DsaPhase[] = [
  programmingFoundations,
  singlePhase("Time and Space Complexity", "time-and-space-complexity"),
  singlePhase("Arrays", "arrays"),
  singlePhase("Strings", "strings"),
  singlePhase("Recursion", "recursion"),
  singlePhase("Hashing", "hashing"),
  singlePhase("Backtracking", "backtracking"),
  singlePhase("Linked List", "linked-lists"),
  singlePhase("Stack", "stacks"),
  singlePhase("Queue", "queues"),
  singlePhase("Sorting & Searching", "sorting-and-searching"),
  singlePhase("Trees", "trees"),
  singlePhase("Binary Search Tree", "binary-search-tree"),
  singlePhase("Heap and Priority Queue", "heaps"),
  singlePhase("Trie", "tries"),
  singlePhase("Graphs", "graphs"),
  singlePhase("Dynamic Programming", "dynamic-programming"),
];

export const dsaPhases: DsaPhase[] = rawPhases.map((phase) => ({
  ...phase,
  lessons: phase.lessons.map((lesson) => ({
    ...lesson,
    codeSamples: completeCodeSamples(lesson.code, lesson.codeSamples),
  })),
}));

export const dsaLessons: DsaLesson[] = dsaPhases.flatMap((phase) => phase.lessons);

export const firstLesson = dsaLessons[0];

export function lessonHref(slug: string) {
  return `/dsa/lessons/${slug}/`;
}

export function getDsaLesson(code: string) {
  return dsaLessons.find((lesson) => lesson.code === code);
}

export function getDsaLessonBySlug(slug: string) {
  return dsaLessons.find((lesson) => lesson.slug === slug);
}

export function lessonForModuleSlug(moduleSlug: string) {
  return dsaLessons.find((lesson) => lesson.moduleSlug === moduleSlug);
}

export function getDsaPhase(name: string) {
  return dsaPhases.find((phase) => phase.name === name);
}

export function getNextDsaLesson(code: string) {
  const index = dsaLessons.findIndex((lesson) => lesson.code === code);
  return index >= 0 ? dsaLessons[index + 1] : undefined;
}

export function getPreviousDsaLesson(code: string) {
  const index = dsaLessons.findIndex((lesson) => lesson.code === code);
  return index > 0 ? dsaLessons[index - 1] : undefined;
}

export function phaseForLesson(code: string) {
  return dsaPhases.find((phase) =>
    phase.lessons.some((lesson) => lesson.code === code),
  );
}

export function firstLessonOfPhase(phase: string) {
  return getDsaPhase(phase)?.lessons[0];
}
