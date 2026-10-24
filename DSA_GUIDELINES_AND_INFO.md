# SMART MUSIC LIBRARY & GRAPH-BASED RECOMMENDATION SYSTEM
## Comprehensive DSA Guidelines, Data Structure Mapping & Viva Voce Reference

**Project Author:** Harsh  
**Frontend Architecture:** Modern Music Dashboard (SPA with Real Audio Synthesis & Live DSA Visualizer)  
**Backend Architecture:** C Architecture (`backend-c/`) + High-Performance Node.js Engine (`dsa/`)  
**Storage:** Persistent JSON / SQLite Data Model  
**Generated PDF Document:** `Smart_Music_Library_DSA_Guidelines_and_Info.pdf`

---

## 1. Executive Summary & Architectural Philosophy

The **Smart Music Library & Graph-Based Recommendation System** is designed to demonstrate how classical Data Structures and Algorithms (DSA) operate in synergy within a production-grade music streaming application. Rather than presenting abstract or isolated algorithmic exercises, every single data structure serves a concrete, practical, and visible purpose in the application.

### Key Differentiators:
1. **DSA-Driven Architecture:** Every data structure has an explicit, measurable job.
2. **Graph-Based Discovery:** Recommendations originate from weighted metadata edges rather than hardcoded heuristics.
3. **Explainable Recommendations:** The user sees exactly *why* each song was recommended (e.g., `Same Genre [+30], Similar Mood [+20]`).
4. **Smart Listening Sessions:** Combines Tree, Hash Table, Graph, Doubly Linked List, Queue, and Stack in one cohesive pipeline.
5. **Dual Implementation:**
   - **ANSI C Backend** (`backend-c/`): C headers and source files implementing all 7 data structures with memory management and terminal verification.
   - **Full-Stack JavaScript Engine** (`dsa/`): Pure custom DSA classes powering the Express REST API and live visualizer.

---

## 2. Master Data Structures Matrix

| # | Data Structure | Application / Role | Key Operations | Time Complexity (Average) | Space Complexity |
|---|----------------|-------------------|----------------|---------------------------|------------------|
| **1** | **Multi-Way Tree** | Hierarchical Music Library (Genre $\to$ Artist $\to$ Album $\to$ Song) | `insertSong()`, `findSongPath()`, `getHierarchy()` | $O(\text{depth}) = O(4) = O(1)$ | $O(N)$ |
| **2** | **Doubly Linked List** | Playlist Management & Song Ordering | `append()`, `removeById()`, `move(up/down)`, `contains()` | Append: $O(1)$, Delete: $O(1)^*$, Reorder: $O(1)^*$ | $O(N)$ |
| **3** | **FIFO Queue** | Playback Queue (Up Next) | `enqueue()`, `dequeue()`, `playNext()`, `peek()` | Enqueue: $O(1)$, Dequeue: $O(1)$, Play Next: $O(1)$ | $O(N)$ |
| **4** | **LIFO Stack** | Playback History & Back Navigation | `push()`, `pop()`, `peek()` | Push: $O(1)$, Pop: $O(1)$ | $O(N)$ |
| **5** | **Undirected Weighted Graph** | Song Recommendation Engine & Discovery | `addVertex()`, `addEdge()`, `getSimilarSongs()`, `getMultiHopRecommendations()` | 1-Hop: $O(\deg V)$, 2-Hop BFS: $O(V + E)$ | $O(V + E)$ |
| **6** | **Hash Table (Separate Chaining)** | Exact Song Retrieval by ID & Normalized Key | `put()`, `get()`, `remove()`, `search()` | Lookup: $O(1)$ avg, Worst: $O(N)$ | $O(M + N)$ |
| **7** | **Auth Hash Table** | User Authentication & 5 Pre-Configured Accounts | `register()`, `authenticate()`, `hashUsername()` | Auth: $O(1)$ avg, Worst: $O(N)$ | $O(17 + N)$ |

---

## 3. The 5 Pre-Configured User Accounts & Auth Hash Table

The user authentication system is backed by a custom Hash Table (`AuthHashTable`) with prime capacity $M = 17$. Passwords are encrypted with SHA-256, and collisions are resolved via Separate Chaining (singly-linked bucket lists).

### Polynomial Rolling Hash Formula:
$$H(\text{username}) = \left(\sum_{i=0}^{n-1} \text{username}[i] \cdot 37^{n-1-i}\right) \pmod{17}$$

### 5 Pre-Configured Accounts:
| # | Username | Password | Full Name | Role | Bucket Index | Description / Preferences |
|---|----------|----------|-----------|------|--------------|---------------------------|
| 1 | `alex_music` | `MusicPass123!` | Alex Rivera | Music Enthusiast | **Bucket #13** | Pop, Acoustic, Ed Sheeran fan |
| 2 | `sarah_rock` | `RockOn2026#` | Sarah Connor | Rock Enthusiast | **Bucket #8** | Imagine Dragons, Coldplay, Rock riffs |
| 3 | `david_jazz` | `JazzSmooth!45` | David Kim | Jazz Curator | **Bucket #4** | Miles Davis, Ambient piano, Late-night jazz |
| 4 | `elena_dsa` | `GraphAlgo99$` | Prof. Elena Rostova | DSA Evaluator | **Bucket #11** | Academic evaluator; checks Big-O & Graph BFS |
| 5 | `harsh_admin`| `SmartMaster77!` | Harsh (Admin) | System Administrator | **Bucket #2** | Administrative controls, debug metrics |

*Note: In the web application, clicking on any user tile logs in instantly with 1-click!*

---

## 4. Deep-Dive on Core Data Structures

### 1. Multi-Way Tree (`dsa/LibraryTree.js` & `backend-c/src/library_tree.c`)
- **Structure:** `Root -> Genre -> Artist -> Album -> Song`
- **Application:** Browsing songs in logical taxonomic categories.
- **Why chosen:** Music inherently exhibits a hierarchical relationship. A multi-way tree allows users to expand/collapse genres, browse albums under artists, and query complete lineage paths (e.g. `Pop -> Ed Sheeran -> Divide -> Perfect`) in $O(1)$ constant depth.

### 2. Doubly Linked List (`dsa/DoublyLinkedList.js` & `backend-c/src/playlist_list.c`)
- **Structure:** `HEAD <-> [Node 1] <-> [Node 2] <-> [Node 3] <-> TAIL`
- **Application:** Playlist song ordering, bidirectional traversal, and moving songs up/down.
- **Why chosen over Arrays:** Reordering a song in an array requires $O(N)$ element shifts. In a Doubly Linked List, relinking pointers is an $O(1)$ operation once the node is identified. Both forward traversal and reverse traversal are supported natively.

### 3. FIFO Playback Queue (`dsa/PlaybackQueue.js` & `backend-c/src/playback_queue.c`)
- **Structure:** `FRONT -> [Song A] -> [Song B] -> [Song C] <- REAR`
- **Application:** Up Next playback queue.
- **Why chosen:** Tracks must play in the exact order enqueued (First In, First Out). Supports "Play Next" priority insertion at the front of the queue in $O(1)$ time.

### 4. LIFO Playback History Stack (`dsa/HistoryStack.js` & `backend-c/src/history_stack.c`)
- **Structure:** `TOP -> [Most Recent Song] -> [Older Song] -> [Oldest Song]`
- **Application:** Playback history and Back navigation.
- **Queue & Stack Synergy:**
  - When **NEXT** is clicked: `CurrentSong` is pushed onto the **History Stack** ($O(1)$); the next track is dequeued from the **Queue** ($O(1)$).
  - When **BACK** is clicked: Top of the **History Stack** is popped ($O(1)$) to become the current song; the old current song is prepended to the front of the **Queue**.

### 5. Undirected Weighted Graph (`dsa/SongGraph.js` & `backend-c/src/song_graph.c`)
- **Structure:** Vertices = Songs; Edges = Similarity score between songs.
- **Similarity Scoring Formula (0 to 100 points):**
  - **Same Genre:** $+30$ points
  - **Same Artist:** $+25$ points
  - **Similar Mood:** $+20$ points (Romantic, Energetic, Relaxing, Sad, Focus)
  - **Harmonious Tempo:** $+15$ points ($|\Delta\text{BPM}| \le 15$); $+8$ points ($|\Delta\text{BPM}| \le 30$)
  - **Same Album:** $+10$ points
- **Multi-Hop 2-Hop Traversal:** Uses BFS with a `visited` set to avoid cyclic loops, exploring related songs through intermediary tracks.

### 6. Song Hash Table (`dsa/SongHashTable.js` & `backend-c/src/song_hash.c`)
- **Structure:** Bucket array of prime capacity $M = 37$ with separate chaining.
- **Application:** $O(1)$ exact lookup by unique Song ID or title.
- **Hybrid Search:** Combines $O(1)$ exact hash lookup with partial substring scanning for fuzzy text queries.

---

## 5. Standout Feature: Smart Listening Session

The Smart Listening Session demonstrates all core structures working in harmony:
1. **Hash Table:** Finds the starting song in $O(1)$ time.
2. **Graph:** Discovers and ranks candidate tracks via weighted similarity and 2-hop BFS.
3. **Filtering:** Filters candidates to match the requested mood and excludes songs currently in the **History Stack**.
4. **Doubly Linked List:** Assembles the session playlist up to the exact target duration (e.g. 30 minutes).
5. **Queue:** Loads the sequence into the upcoming playback queue.
6. **Stack:** Tracks played songs to maintain session history.

---

## 6. Viva Voce / Technical Interview Q&A

### Q1: Why not use a dynamic array instead of a Doubly Linked List for playlists?
**Answer:** Dynamic arrays incur $O(N)$ time complexity whenever a song is inserted, removed, or moved up/down in the playlist because subsequent elements must be shifted in memory. In a Doubly Linked List, unlinking and relinking adjacent nodes takes $O(1)$ pointer operations. Furthermore, the `prev` and `next` pointers allow bidirectional traversal without extra memory overhead.

### Q2: How does the Recommendation Graph prevent infinite loops or cycles?
**Answer:** The recommendation engine maintains a `visited` hash set during Breadth-First Search (BFS) traversal. When exploring 1-hop and 2-hop neighbors, any song ID that has already been visited (including the root song) is skipped. This prevents cyclic traversal and guarantees that duplicate songs never appear in recommendations.

### Q3: What is the load factor of your Hash Table, and why is prime capacity important?
**Answer:** Load factor $\lambda = N / M$, where $N$ is total stored elements and $M$ is bucket capacity. For our `SongHashTable` with $N=24$ and $M=37$, $\lambda \approx 0.65$. Choosing a prime number for $M$ ensures that hash codes generated by polynomial multiplication are evenly distributed across all buckets, minimizing collision clustering.

### Q4: How do the Playback Queue and History Stack cooperate during audio playback?
**Answer:** They model future and past playback state:
- The **Queue** (FIFO) manages upcoming tracks.
- The **Stack** (LIFO) records previously played tracks.
When "Next" is pressed, the current track is pushed to the History Stack and the front of the Queue is dequeued. When "Back" is pressed, the top of the History Stack is popped to become the current track, and the former track is pushed to the front of the Queue ("Play Next").

---

## 7. How to Run the Project

### One-Click Launch (Desktop):
Double-click `start.bat` located inside this directory (`Smart_Music_Library`). It will:
1. Check Node.js runtime.
2. Install dependencies automatically if required.
3. Launch `server.js` on port `5000`.
4. Automatically open `http://localhost:5000` in your default web browser!

### Manual Terminal Launch:
```bash
npm install
node server.js
```

### Compiling and Running the Native C Suite:
```bash
cd backend-c
make
./smart_music_dsa
```
*(On Windows with MinGW: `gcc -Iinclude src/*.c -o smart_music_dsa.exe && smart_music_dsa.exe`)*
