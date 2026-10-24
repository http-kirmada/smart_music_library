# Smart Music Library & Graph-Based Recommendation System

> **A Full-Stack Music Platform powered by classical Data Structures and Algorithms (DSA)**  
> Developed per the technical blueprint and requirements in `Smart_Music_library_Project_Plan.pdf`.

---

## 🚀 Quick Start (One-Click)

Simply **double-click** the `start.bat` file in this directory! It will automatically:
1. Verify the Node.js runtime
2. Install dependencies (`npm install`) if needed
3. Launch the server
4. Open `http://localhost:5000` in your default browser

Or run manually from terminal:
```bash
npm install
node server.js
```

---

## 🔐 5 Pre-Configured Accounts for Evaluators

The application includes an **Auth Hash Table** (`AuthHashTable`) with prime capacity $M = 17$ and separate chaining collision resolution, pre-seeded with 5 unique accounts. In the web UI, you can click on any user tile for instant **1-Click Login**:

| Username | Password | Role | Hash Bucket | Focus Area |
|---|---|---|---|---|
| `alex_music` | `MusicPass123!` | Music Enthusiast | **Bucket #13** | Pop, Acoustic, Ed Sheeran tracks |
| `sarah_rock` | `RockOn2026#` | Rock Enthusiast | **Bucket #8** | Imagine Dragons, Rock beats |
| `david_jazz` | `JazzSmooth!45` | Jazz Curator | **Bucket #4** | Miles Davis, Ambient piano |
| `elena_dsa` | `GraphAlgo99$` | DSA Evaluator *(Default)* | **Bucket #11** | Evaluates Time Complexities & BFS |
| `harsh_admin` | `SmartMaster77!` | System Administrator | **Bucket #2** | Administrative controls & metrics |

---

## 📘 Comprehensive Technical Guidelines PDF

The requested technical guide detailing every data structure is included as:
- **`Smart_Music_Library_DSA_Guidelines_and_Info.pdf`** (Ready for submission, printing, and reading)
- **`DSA_GUIDELINES_AND_INFO.md`** (Markdown companion)
- Direct in-browser download button on the top-right of the web app!

---

## 🏛️ Data Structures Architecture Matrix

| # | Data Structure | Application in Project | File Locations | Time Complexity (Avg) |
|---|---|---|---|---|
| **1** | **Multi-Way Tree** | Hierarchical Music Library (Genre $\to$ Artist $\to$ Album $\to$ Song) | `dsa/LibraryTree.js`<br>`backend-c/src/library_tree.c` | $O(\text{depth}) = O(1)$ |
| **2** | **Doubly Linked List** | Playlists & Song Ordering (Move Up/Down) | `dsa/DoublyLinkedList.js`<br>`backend-c/src/playlist_list.c` | Append: $O(1)$<br>Reorder: $O(1)$ |
| **3** | **FIFO Queue** | Playback Queue ("Up Next" tracks) | `dsa/PlaybackQueue.js`<br>`backend-c/src/playback_queue.c` | Enqueue: $O(1)$<br>Dequeue: $O(1)$ |
| **4** | **LIFO Stack** | Playback History & "Back" Navigation | `dsa/HistoryStack.js`<br>`backend-c/src/history_stack.c` | Push: $O(1)$<br>Pop: $O(1)$ |
| **5** | **Weighted Graph** | Music Recommendation Engine (Similarity BFS) | `dsa/SongGraph.js`<br>`backend-c/src/song_graph.c` | BFS: $O(V + E)$<br>1-Hop: $O(\deg V)$ |
| **6** | **Hash Table** | Exact Song Lookup by ID & Normalized Key | `dsa/SongHashTable.js`<br>`backend-c/src/song_hash.c` | Lookup: $O(1)$ |
| **7** | **Auth Hash Table** | 5 User Accounts & Authentication | `dsa/AuthHashTable.js`<br>`backend-c/src/auth_hash.c` | Auth: $O(1)$ |

---

## 💻 Native C Implementation (`backend-c/`)

The C source code specified on Page 6 of the PDF is organized in `backend-c/`:
- `include/`: Header files for all data structures
- `src/`: Modular C implementations
- `src/main.c`: Complete CLI test suite demonstrating all 7 data structures
- `Makefile`: Build script (`make` to compile)

---

## 🌟 Standout Highlights
- **Audible Web Audio Synthesizer:** Real melodies, chords, and rhythmic pulses play dynamically based on the current song's BPM, key, and mood!
- **Interactive Live DSA Visualizer:** Real-time visual canvas with clickable nodes, pointer diagrams, and hash bucket distributions.
- **Explainable Recommendations:** Shows exact point breakdown (e.g. `Same Genre [+30], Similar Mood [+20]`).
