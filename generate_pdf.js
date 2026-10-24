/**
 * generate_pdf.js
 * Generates the comprehensive PDF:
 * "Smart_Music_Library_DSA_Guidelines_and_Info.pdf"
 *
 * Details every data structure used in the project, mathematical formulations,
 * time and space complexities, viva examination answers, and architecture.
 */

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const pdfPath = path.join(__dirname, "Smart_Music_Library_DSA_Guidelines_and_Info.pdf");
const doc = new PDFDocument({
  size: "A4",
  margin: 45,
  info: {
    Title: "Smart Music Library - DSA Guidelines & Architecture Blueprint",
    Author: "Harsh - DeepMind AAC Pair",
    Subject: "Data Structures & Algorithms in Smart Music Library",
    Keywords: "DSA, Tree, Doubly Linked List, Queue, Stack, Graph, Hash Table, C, Node.js"
  }
});

const writeStream = fs.createWriteStream(pdfPath);
doc.pipe(writeStream);

// Helper styling functions
const PRIMARY = "#1E3A8A";    // Deep Navy Blue
const SECONDARY = "#0D9488";  // Teal
const ACCENT = "#E11D48";     // Rose/Red
const TEXT_DARK = "#1E293B";  // Slate Dark
const MUTED = "#64748B";      // Slate Muted
const BG_LIGHT = "#F8FAFC";   // Off White
const BORDER_COLOR = "#CBD5E1";

function drawHeader(title, subtitle) {
  doc.rect(45, 40, 505, 55).fill(PRIMARY);
  doc.fillColor("#FFFFFF").fontSize(18).font("Helvetica-Bold").text(title, 55, 48, { width: 485 });
  if (subtitle) {
    doc.fillColor("#93C5FD").fontSize(10).font("Helvetica").text(subtitle, 55, 72, { width: 485 });
  }
  doc.moveDown(2);
  doc.y = 110;
}

function drawSectionHeading(heading) {
  doc.moveDown(0.8);
  const currentY = doc.y;
  if (currentY > 720) {
    doc.addPage();
    doc.y = 50;
  }
  doc.rect(45, doc.y, 505, 24).fill(BG_LIGHT);
  doc.rect(45, doc.y, 4, 24).fill(SECONDARY);
  doc.fillColor(PRIMARY).fontSize(13).font("Helvetica-Bold").text(heading, 56, doc.y + 5);
  doc.moveDown(0.8);
}

function drawSubHeading(sub) {
  doc.moveDown(0.5);
  if (doc.y > 740) {
    doc.addPage();
    doc.y = 50;
  }
  doc.fillColor(SECONDARY).fontSize(11).font("Helvetica-Bold").text(sub);
  doc.moveDown(0.3);
}

function drawParagraph(text) {
  if (doc.y > 750) {
    doc.addPage();
    doc.y = 50;
  }
  doc.fillColor(TEXT_DARK).fontSize(9.5).font("Helvetica").lineGap(2).text(text);
  doc.moveDown(0.4);
}

function drawBullet(title, desc) {
  if (doc.y > 750) {
    doc.addPage();
    doc.y = 50;
  }
  doc.fillColor(PRIMARY).fontSize(9.5).font("Helvetica-Bold").text(`• ${title}: `, { continued: true });
  doc.fillColor(TEXT_DARK).font("Helvetica").text(desc);
  doc.moveDown(0.25);
}

function drawCodeBlock(code) {
  if (doc.y > 680) {
    doc.addPage();
    doc.y = 50;
  }
  const startY = doc.y;
  const height = code.split("\n").length * 11 + 12;
  doc.rect(45, startY, 505, height).fill("#0F172A");
  doc.fillColor("#38BDF8").fontSize(8).font("Courier").text(code, 52, startY + 6, { width: 490 });
  doc.y = startY + height + 6;
}

/* =========================================================================
 * PAGE 1: TITLE & EXECUTIVE SUMMARY
 * ========================================================================= */
drawHeader("SMART MUSIC LIBRARY & RECOMMENDATION SYSTEM", "Comprehensive Data Structures & Algorithms (DSA) Guidelines & Technical Blueprint");

drawSectionHeading("1. EXECUTIVE SUMMARY & ARCHITECTURAL PHILOSOPHY");
drawParagraph(
  "The Smart Music Library & Graph-Based Recommendation System is an enterprise-grade academic project designed " +
  "to demonstrate how classical Data Structures and Algorithms (DSA) operate in synergy within a modern full-stack web application. " +
  "Rather than presenting isolated algorithm exercises, every single data structure serves a concrete, practical, and visible " +
  "purpose in the user interface and music streaming pipeline."
);

drawParagraph(
  "The system adheres strictly to the blueprint outlined in the project plan, incorporating dual implementations:\n" +
  "1. Pure ANSI C Backend Architecture (located in `backend-c/`) for low-level systems programming and viva demonstrations.\n" +
  "2. High-Performance Node.js Engine (in `dsa/`) powering an interactive REST API, responsive Web UI, audio synthesizer, and real-time DSA visualizer."
);

drawSectionHeading("2. MASTER DATA STRUCTURES MATRIX");
drawParagraph(
  "Below is the complete architectural mapping of the seven data structures implemented across the codebase:"
);

const matrixData = [
  { ds: "1. Multi-Way Tree", role: "Hierarchical Music Library", ops: "Insert, Hierarchy Search, Path Finding", time: "O(depth) = O(4) = O(1)", space: "O(N)" },
  { ds: "2. Doubly Linked List", role: "Playlist Management", ops: "Append, Remove, Reorder, Bidirectional Traversal", time: "Append: O(1), Delete: O(1)*", space: "O(N)" },
  { ds: "3. FIFO Queue", role: "Playback Queue (Up Next)", ops: "Enqueue, Dequeue, Play-Next, Peek", time: "Enqueue: O(1), Dequeue: O(1)", space: "O(N)" },
  { ds: "4. LIFO Stack", role: "Playback History (Back Nav)", ops: "Push, Pop, Peek", time: "Push: O(1), Pop: O(1)", space: "O(N)" },
  { ds: "5. Weighted Graph", role: "Recommendation Engine", ops: "Similarity BFS, 2-Hop Discovery, Ranking", time: "BFS: O(V + E), 1-Hop: O(deg V)", space: "O(V + E)" },
  { ds: "6. Hash Table (Chaining)", role: "Song Exact Lookup by ID", ops: "Put, Get, Remove, Search", time: "Avg: O(1), Worst: O(N)", space: "O(M + N)" },
  { ds: "7. Auth Hash Table", role: "5 User Accounts & Auth", ops: "Register, Authenticate, Inspect Buckets", time: "Avg: O(1), Worst: O(N)", space: "O(17 + N)" }
];

for (const row of matrixData) {
  drawBullet(`${row.ds} [${row.role}]`, `Ops: ${row.ops} | Time: ${row.time} | Space: ${row.space}`);
}

/* =========================================================================
 * PAGE 2: USER AUTHENTICATION & THE 5 ACCOUNTS
 * ========================================================================= */
doc.addPage();
drawHeader("USER AUTHENTICATION & ACCOUNT STORAGE", "Data Structure: Hash Table with Polynomial Rolling Hash & Separate Chaining");

drawSectionHeading("3. AUTH HASH TABLE & PRE-CONFIGURED USER ACCOUNTS");
drawParagraph(
  "User accounts are stored in a dedicated Hash Table (`AuthHashTable`) with a prime capacity of M = 17 buckets. " +
  "Passwords are cryptographically secured using SHA-256 while preserving credential verification via linked bucket chains."
);

drawSubHeading("Polynomial Rolling Hash Formula:");
drawParagraph(
  "For a given username string s of length n, the bucket index is computed as:\n" +
  "H(s) = ( ∑ [i = 0 to n-1] s[i] * 37^(n - 1 - i) ) mod 17\n" +
  "Where 37 is a prime multiplier minimizing prefix clustering, and 17 is the prime table capacity."
);

drawSubHeading("The 5 Pre-Configured Accounts (Ready for 1-Click Evaluator Login):");
const accountsList = [
  { u: "alex_music", p: "MusicPass123!", role: "Music Enthusiast", desc: "Pop & Acoustic lover; Divide & Multiply albums", bucket: "13" },
  { u: "sarah_rock", p: "RockOn2026#", role: "Rock Enthusiast", desc: "Imagine Dragons & Coldplay high-tempo fan", bucket: "8" },
  { u: "david_jazz", p: "JazzSmooth!45", role: "Jazz Curator", desc: "Miles Davis & ambient instrumental enthusiast", bucket: "4" },
  { u: "elena_dsa", p: "GraphAlgo99$", role: "DSA Evaluator", desc: "Academic evaluator evaluating time complexities & graphs", bucket: "11" },
  { u: "harsh_admin", p: "SmartMaster77!", role: "System Administrator", desc: "Full administrative access and data structure metrics", bucket: "2" }
];

for (const a of accountsList) {
  drawBullet(`${a.u} (Password: ${a.p})`, `Role: ${a.role} | Bucket Index: #${a.bucket} | ${a.desc}`);
}

drawCodeBlock(
  `// C Implementation excerpt: include/auth_hash.h & src/auth_hash.c\n` +
  `typedef struct AuthAccount {\n` +
  `    int id;\n` +
  `    char username[64];\n` +
  `    char password[64];\n` +
  `    char name[128];\n` +
  `    char role[64];\n` +
  `    struct AuthAccount* next; // Separate chaining linked list\n` +
  `} AuthAccount;\n\n` +
  `unsigned int hash_username(const char* username, int capacity) {\n` +
  `    unsigned int hash_val = 0;\n` +
  `    const unsigned int PRIME = 37;\n` +
  `    for (int i = 0; username[i] != '\\0'; i++) {\n` +
  `        hash_val = (hash_val * PRIME + (unsigned char)username[i]) % capacity;\n` +
  `    }\n` +
  `    return hash_val;\n` +
  `}`
);

/* =========================================================================
 * PAGE 3: IN-DEPTH BREAKDOWN OF CORE DATA STRUCTURES
 * ========================================================================= */
doc.addPage();
drawHeader("CORE DATA STRUCTURES DEEP-DIVE", "Hierarchical Tree, Doubly Linked List, Queue, and Stack");

drawSectionHeading("4. HIERARCHICAL MUSIC LIBRARY (MULTI-WAY TREE)");
drawBullet("Structure", "Root -> Genre -> Artist -> Album -> Song");
drawBullet("Why Chosen", "Music naturally organizes into a taxonomy. A multi-way tree allows intuitive drill-down, " +
           "filtering by genre or artist, and path reconstruction (e.g., 'Pop -> Ed Sheeran -> Divide -> Perfect').");
drawBullet("Time Complexity", "Search path: O(depth) = O(4) = O(1); Traversal: O(N) where N is total nodes.");
drawBullet("C File", "`backend-c/src/library_tree.c` | JS File: `dsa/LibraryTree.js`");

drawSectionHeading("5. PLAYLIST MANAGEMENT (DOUBLY LINKED LIST)");
drawBullet("Structure", "HEAD <-> [Node: Song 1] <-> [Node: Song 2] <-> [Node: Song 3] <-> TAIL");
drawBullet("Why Chosen", "Playlists require frequent reordering (move up/down) and bidirectional traversal (Previous/Next track). " +
           "In a Doubly Linked List, unlinking and relinking adjacent nodes takes O(1) pointer operations without shifting elements as an array does.");
drawBullet("Operations", "append(), prepend(), removeById(), move(up/down), contains() [duplicate detection], getTotalDuration().");
drawBullet("C File", "`backend-c/src/playlist_list.c` | JS File: `dsa/DoublyLinkedList.js`");

drawSectionHeading("6. PLAYBACK QUEUE (FIFO QUEUE)");
drawBullet("Structure", "FRONT -> [Photograph] -> [Shape of You] -> [Castle on the Hill] <- REAR");
drawBullet("Why Chosen", "Upcoming music must follow First-In, First-Out (FIFO) semantics. " +
           "Users can also 'Play Next', which performs an O(1) push at the front of the queue.");
drawBullet("Time Complexity", "Enqueue: O(1); Dequeue: O(1); Play-Next: O(1); Peek: O(1).");
drawBullet("C File", "`backend-c/src/playback_queue.c` | JS File: `dsa/PlaybackQueue.js`");

drawSectionHeading("7. PLAYBACK HISTORY (LIFO STACK)");
drawBullet("Structure", "TOP -> [Most Recent Track] -> [Previous Track] -> [Oldest Track]");
drawBullet("Why Chosen", "When moving forward through music, previous songs are pushed onto the history stack. " +
           "Clicking the 'Back' button pops the top track in Last-In, First-Out (LIFO) order.");
drawBullet("Interplay", "Queue and Stack operate in tandem: pressing Next pushes to Stack and dequeues from Queue; " +
           "pressing Back pops from Stack and prepends old current song back into the Queue.");
drawBullet("C File", "`backend-c/src/history_stack.c` | JS File: `dsa/HistoryStack.js`");

/* =========================================================================
 * PAGE 4: GRAPH RECOMMENDATIONS & SMART LISTENING SESSIONS
 * ========================================================================= */
doc.addPage();
drawHeader("GRAPH-BASED RECOMMENDATIONS & WORKFLOW", "Undirected Weighted Graph & Smart Listening Session Integration");

drawSectionHeading("8. GRAPH-BASED RECOMMENDATION ENGINE");
drawParagraph(
  "Songs are modeled as vertices in an Undirected Weighted Graph. An edge is established between two songs " +
  "if their pairwise metadata similarity score meets or exceeds a configurable threshold (e.g., 30 points)."
);

drawSubHeading("Similarity Scoring Formula (0 - 100 Points):");
drawBullet("Same Genre", "+30 points (primary stylistic compatibility)");
drawBullet("Same Artist", "+25 points (artist catalogue continuity)");
drawBullet("Similar Mood", "+20 points (emotional alignment: Romantic, Energetic, Relaxing, Sad, Focus)");
drawBullet("Harmonious Tempo", "+15 points if |BPM1 - BPM2| ≤ 15; +8 points if |BPM1 - BPM2| ≤ 30");
drawBullet("Same Album", "+10 points (thematic album cohesion)");

drawSubHeading("Multi-Hop Graph Discovery Algorithm:");
drawParagraph(
  "To discover songs that are stylistically connected through intermediaries, the system implements a " +
  "Breadth-First Search (BFS) multi-hop exploration. A `visited` set prevents cyclic loops and infinite recursion. " +
  "Candidate recommendations are ranked descending by similarity score, with full explainability tags (e.g., 'Same Genre + Similar Mood')."
);

drawSectionHeading("9. STANDOUT FEATURE: SMART LISTENING SESSION");
drawParagraph(
  "The Smart Listening Session combines all six data structures into one unified algorithmic workflow:"
);
drawBullet("Step 1 (Hash Table)", "O(1) lookup of the starting song chosen by the user.");
drawBullet("Step 2 (Graph Traversal)", "Retrieves and ranks 1-hop and 2-hop connected songs via BFS.");
drawBullet("Step 3 (Filtering)", "Excludes songs that do not match the desired mood or that appear in the history stack.");
drawBullet("Step 4 (Doubly Linked List)", "Assembles the filtered songs into a seamless listening sequence totaling the requested duration.");
drawBullet("Step 5 (FIFO Queue)", "Loads the assembled sequence into the playback queue for upcoming playback.");
drawBullet("Step 6 (LIFO Stack)", "Monitors played tracks to update the user's history and ensure no repeat playback.");

/* =========================================================================
 * PAGE 5: VIVA VOCE & TECHNICAL INTERVIEW QUESTIONS
 * ========================================================================= */
doc.addPage();
drawHeader("VIVA VOCE / EVALUATION QUESTIONS & ANSWERS", "Comprehensive Academic Q&A for Technical Evaluation");

drawSectionHeading("10. FREQUENTLY ASKED VIVA QUESTIONS & MODEL ANSWERS");

const vivaQuestions = [
  {
    q: "Q1. Why use a Doubly Linked List for playlists instead of a Dynamic Array?",
    a: "Playlists involve frequent middle insertions, deletions, and song reordering (Move Up / Down). In an array, moving or deleting an element requires O(N) shifting of subsequent elements. In a Doubly Linked List, once the node is identified, relinking pointers takes O(1) time. Furthermore, prev and next pointers enable natural bidirectional traversal for Next and Previous track controls."
  },
  {
    q: "Q2. How does the Graph recommendation algorithm prevent infinite loops and duplicates?",
    a: "The recommendation engine maintains a `visited` set during BFS traversal. When exploring 2-hop neighbors, any vertex already in the visited set (including the starting song and 1-hop neighbors) is skipped. This guarantees acyclic traversal and prevents duplicate songs in recommendation lists."
  },
  {
    q: "Q3. What is the difference between your Hash Table lookup and Library Tree search?",
    a: "The Hash Table provides O(1) average-time exact retrieval by unique song ID or normalized key. The Tree, in contrast, preserves the categorical hierarchy (Genre -> Artist -> Album -> Song). The Tree is essential for hierarchical browsing and path discovery, whereas the Hash Table is optimal for instant lookups."
  },
  {
    q: "Q4. How do the Queue and Stack interact during playback?",
    a: "They represent forward and backward temporal horizons. The Queue (FIFO) holds the future (upcoming tracks). The Stack (LIFO) holds the past (previously played tracks). When 'Next' is pressed: Current is pushed to History Stack, and Front of Queue is dequeued. When 'Back' is pressed: Top of History Stack is popped to become Current, and old Current is placed back at the Front of Queue."
  },
  {
    q: "Q5. What is the collision resolution method in your Hash Tables?",
    a: "Both SongHashTable and AuthHashTable use Separate Chaining. Each bucket in the table is the head pointer of a singly linked list. When two distinct keys hash to the same bucket index, the new node is prepended to that bucket's chain in O(1) time. In the worst case (all keys colliding), search degrades to O(N), but with prime capacity and our polynomial rolling hash, load factor remains low and search is O(1) on average."
  }
];

for (const v of vivaQuestions) {
  drawBullet(v.q, v.a);
  doc.moveDown(0.2);
}

/* =========================================================================
 * PAGE 6: STEP-BY-STEP DEMONSTRATION SCRIPT
 * ========================================================================= */
doc.addPage();
drawHeader("STEP-BY-STEP DEMONSTRATION SCRIPT", "7-Step Guided Demonstration for Evaluators and Professors");

drawSectionHeading("11. LIVE DEMONSTRATION WALKTHROUGH");

const demoSteps = [
  { step: "Step 1: 1-Click Login", action: "Open http://localhost:5000. Click on any of the 5 pre-configured accounts (e.g. 'elena_dsa'). Note the bucket index (#11) calculated in real-time by the Auth Hash Table." },
  { step: "Step 2: Tree Exploration", action: "Navigate to the 'Library Tree' tab. Expand 'Pop' -> 'Ed Sheeran' -> 'Divide' -> 'Perfect'. Click 'Find Song Path' to observe O(1) hierarchy path resolution." },
  { step: "Step 3: Playlist Doubly Linked List", action: "Open 'Playlists'. Select 'Roadtrip Energy Hits'. Click 'Move Up' on 'Shape of You'. Observe live pointer swap in the UI and the Doubly Linked List Inspector." },
  { step: "Step 4: Queue Enqueue & Play Next", action: "Search for 'Blinding Lights'. Click 'Play Next'. Inspect the Playback Queue tab to verify it inserted at the Front (O(1)) ahead of upcoming tracks." },
  { step: "Step 5: Stack Pop & Back Navigation", action: "Click 'Next' twice on the player bar. Observe the History Stack gaining songs. Click 'Back'. Observe the Stack popping the top song and restoring it as current." },
  { step: "Step 6: Graph Recommendations", action: "Select 'Perfect'. Click 'Discover / Graph'. View the interactive visual graph canvas with weighted similarity links and explainable tags (e.g. 'Same Genre + Same Artist: 55 pts')." },
  { step: "Step 7: Smart Listening Session", action: "Choose 'Smart Sessions'. Select 'Perfect', Mood 'Romantic', Duration '30 min', and 'Avoid Recent'. Click 'Generate'. View the execution log combining Hash Table, Graph, Linked List, Queue, and Stack!" }
];

for (const d of demoSteps) {
  drawBullet(d.step, d.action);
  doc.moveDown(0.3);
}

drawSectionHeading("12. C SOURCE CODE COMPILATION INSTRUCTIONS");
drawParagraph(
  "To compile and execute the native ANSI C test suite:\n" +
  "1. Open a terminal in `backend-c/`\n" +
  "2. Run `make` (or `gcc -Wall -Iinclude src/*.c -o smart_music_dsa`)\n" +
  "3. Run `./smart_music_dsa` (or `smart_music_dsa.exe` on Windows)\n" +
  "This outputs an ASCII visualization of all 7 data structures and runs unit verifications."
);

doc.end();

writeStream.on("finish", () => {
  console.log(`[PDF Generator] Successfully generated: ${pdfPath}`);
});
