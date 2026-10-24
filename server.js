/**
 * server.js
 * Express HTTP REST API Server for Smart Music Library & Recommendation System
 *
 * Implements backend endpoints connecting frontend React/JS to classical Data Structures:
 *   - LibraryTree (Multi-way Tree)
 *   - DoublyLinkedList (Playlists)
 *   - PlaybackQueue (FIFO Queue)
 *   - HistoryStack (LIFO Stack)
 *   - SongGraph (Weighted Graph)
 *   - SongHashTable (Song Lookup)
 *   - AuthHashTable (5 User Accounts)
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { LibraryTree } = require("./dsa/LibraryTree");
const { DoublyLinkedList } = require("./dsa/DoublyLinkedList");
const { PlaybackQueue } = require("./dsa/PlaybackQueue");
const { HistoryStack } = require("./dsa/HistoryStack");
const { SongGraph } = require("./dsa/SongGraph");
const { SongHashTable } = require("./dsa/SongHashTable");
const { AuthHashTable } = require("./dsa/AuthHashTable");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve generated PDF if requested
app.use("/docs", express.static(path.join(__dirname)));

/* =========================================================================
 * 1. INITIALIZE DATA STRUCTURES & LOAD SEED DATA
 * ========================================================================= */
const songsData = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "songs.json"), "utf8"));
const accountsData = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "accounts.json"), "utf8"));
const playlistsData = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "playlists.json"), "utf8"));

// 1. Auth Hash Table
const authTable = new AuthHashTable(17);
for (const acc of accountsData) {
  authTable.register(acc);
}
console.log(`[DSA Engine] AuthHashTable initialized with ${authTable.size} accounts.`);

// 2. Song Hash Table
const songHashTable = new SongHashTable(37);
for (const song of songsData) {
  songHashTable.put(String(song.id), song);
  songHashTable.put(song.title.toLowerCase(), song);
}
console.log(`[DSA Engine] SongHashTable initialized with ${songsData.length} tracks.`);

// 3. Hierarchical Library Tree
const libraryTree = new LibraryTree();
for (const song of songsData) {
  libraryTree.insertSong(song);
}
console.log(`[DSA Engine] LibraryTree initialized with depth 4 hierarchy.`);

// 4. Recommendation Graph
const songGraph = new SongGraph(30);
songGraph.buildGraph(songsData);
console.log(`[DSA Engine] SongGraph built with ${songGraph.vertices.size} vertices.`);

// 5. Playback Queue & History Stack
const playbackQueue = new PlaybackQueue();
const historyStack = new HistoryStack(50);
let currentSong = songsData[0]; // Default currently playing track

// 6. Playlists (Map of playlistId -> DoublyLinkedList)
const activePlaylists = new Map();
for (const pl of playlistsData) {
  const list = new DoublyLinkedList();
  list.playlistId = pl.id;
  list.name = pl.name;
  list.description = pl.description;
  list.createdBy = pl.createdBy;
  for (const songId of pl.songs) {
    const s = songHashTable.get(String(songId));
    if (s) list.append(s);
  }
  activePlaylists.set(pl.id, list);
}
console.log(`[DSA Engine] ${activePlaylists.size} Playlists loaded into DoublyLinkedList structures.`);

/* =========================================================================
 * 2. AUTHENTICATION REST API (AuthHashTable)
 * ========================================================================= */
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const user = authTable.authenticate(username, password);
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Include bucket index info to demonstrate data structure
  const bucketIndex = authTable.hashUsername(username);
  res.json({
    success: true,
    user,
    dsaInfo: {
      dataStructure: "AuthHashTable (Separate Chaining)",
      bucketIndex,
      hashAlgorithm: "Polynomial Rolling Hash (base 37, mod 17)"
    }
  });
});

app.post("/api/auth/register", (req, res) => {
  try {
    const newUser = authTable.register(req.body);
    // Persist new user
    const updatedAccounts = authTable.getAllUsers();
    fs.writeFileSync(path.join(__dirname, "data", "accounts.json"), JSON.stringify(updatedAccounts, null, 2));

    res.status(201).json({
      success: true,
      user: newUser,
      message: "Account registered successfully via AuthHashTable"
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/auth/users", (req, res) => {
  const users = authTable.getAllUsers().map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    bio: u.bio,
    plainPassword: u.plainPassword,
    favoriteGenres: u.favoriteGenres
  }));
  res.json(users);
});

/* =========================================================================
 * 3. SONGS & SEARCH REST API (SongHashTable)
 * ========================================================================= */
app.get("/api/songs", (req, res) => {
  res.json(songsData);
});

app.get("/api/songs/:id", (req, res) => {
  const song = songHashTable.get(String(req.params.id));
  if (!song) {
    return res.status(404).json({ error: "Song not found" });
  }
  res.json(song);
});

app.get("/api/search", (req, res) => {
  const query = req.query.q || "";
  const results = songHashTable.search(query);
  res.json({
    query,
    count: results.length,
    results
  });
});

/* =========================================================================
 * 4. HIERARCHICAL LIBRARY EXPLORER (LibraryTree)
 * ========================================================================= */
app.get("/api/library/tree", (req, res) => {
  res.json(libraryTree.getHierarchy());
});

app.get("/api/library/path/:id", (req, res) => {
  const pathInfo = libraryTree.findSongPath(req.params.id);
  if (!pathInfo) {
    return res.status(404).json({ error: "Song not found in hierarchy" });
  }
  res.json(pathInfo);
});

app.get("/api/library/stats", (req, res) => {
  res.json(libraryTree.getStats());
});

/* =========================================================================
 * 5. PLAYLIST MANAGEMENT (DoublyLinkedList)
 * ========================================================================= */
app.get("/api/playlists", (req, res) => {
  const list = [];
  for (const [id, pl] of activePlaylists.entries()) {
    list.push({
      id: pl.playlistId,
      name: pl.name,
      description: pl.description,
      createdBy: pl.createdBy,
      songCount: pl.size,
      totalDurationSeconds: pl.getTotalDuration(),
      songs: pl.toArray()
    });
  }
  res.json(list);
});

app.get("/api/playlists/:id", (req, res) => {
  const pl = activePlaylists.get(Number(req.params.id));
  if (!pl) return res.status(404).json({ error: "Playlist not found" });

  res.json({
    id: pl.playlistId,
    name: pl.name,
    description: pl.description,
    createdBy: pl.createdBy,
    songCount: pl.size,
    totalDurationSeconds: pl.getTotalDuration(),
    songs: pl.toArray(),
    songsReverse: pl.toArrayReverse(), // Traversal in reverse
    inspection: pl.getInspectionData()
  });
});

app.post("/api/playlists", (req, res) => {
  const { name, description, createdBy } = req.body;
  if (!name) return res.status(400).json({ error: "Playlist name is required" });

  const newId = Date.now();
  const list = new DoublyLinkedList();
  list.playlistId = newId;
  list.name = name;
  list.description = description || "Custom playlist";
  list.createdBy = createdBy || "anonymous";

  activePlaylists.set(newId, list);
  res.status(201).json({
    success: true,
    playlist: {
      id: list.playlistId,
      name: list.name,
      description: list.description,
      createdBy: list.createdBy,
      songCount: 0
    }
  });
});

app.post("/api/playlists/:id/songs", (req, res) => {
  const pl = activePlaylists.get(Number(req.params.id));
  if (!pl) return res.status(404).json({ error: "Playlist not found" });

  const { songId } = req.body;
  const song = songHashTable.get(String(songId));
  if (!song) return res.status(404).json({ error: "Song not found" });

  // Duplicate check
  const isDuplicate = pl.contains(songId);
  pl.append(song);

  res.json({
    success: true,
    isDuplicate,
    message: isDuplicate ? "Added (Note: Song was already in playlist)" : "Song added to playlist",
    playlistSize: pl.size,
    songs: pl.toArray()
  });
});

app.delete("/api/playlists/:id/songs/:songId", (req, res) => {
  const pl = activePlaylists.get(Number(req.params.id));
  if (!pl) return res.status(404).json({ error: "Playlist not found" });

  const removed = pl.removeById(req.params.songId);
  if (!removed) return res.status(404).json({ error: "Song not in playlist" });

  res.json({
    success: true,
    removedSong: removed,
    playlistSize: pl.size,
    songs: pl.toArray()
  });
});

app.put("/api/playlists/:id/move", (req, res) => {
  const pl = activePlaylists.get(Number(req.params.id));
  if (!pl) return res.status(404).json({ error: "Playlist not found" });

  const { songId, direction } = req.body; // 'up' or 'down'
  const moved = pl.move(songId, direction);

  res.json({
    success: moved,
    message: moved ? `Song moved ${direction}` : "Cannot move further in that direction",
    songs: pl.toArray()
  });
});

/* =========================================================================
 * 6. PLAYBACK CONTROLS (PlaybackQueue & HistoryStack)
 * ========================================================================= */
app.get("/api/player/current", (req, res) => {
  res.json({
    currentSong,
    nextSong: playbackQueue.peek(),
    queueSize: playbackQueue.size,
    historySize: historyStack.size
  });
});

app.get("/api/player/queue", (req, res) => {
  res.json({
    size: playbackQueue.size,
    songs: playbackQueue.toArray()
  });
});

app.post("/api/player/queue", (req, res) => {
  const { songId } = req.body;
  const song = songHashTable.get(String(songId));
  if (!song) return res.status(404).json({ error: "Song not found" });

  playbackQueue.enqueue(song);
  res.json({
    success: true,
    message: "Enqueued track",
    queueSize: playbackQueue.size,
    queue: playbackQueue.toArray()
  });
});

app.post("/api/player/play-next", (req, res) => {
  const { songId } = req.body;
  const song = songHashTable.get(String(songId));
  if (!song) return res.status(404).json({ error: "Song not found" });

  playbackQueue.playNext(song);
  res.json({
    success: true,
    message: "Track set to play next",
    queueSize: playbackQueue.size,
    queue: playbackQueue.toArray()
  });
});

app.delete("/api/player/queue/:index", (req, res) => {
  const removed = playbackQueue.removeAt(Number(req.params.index));
  res.json({
    success: removed !== null,
    removed,
    queue: playbackQueue.toArray()
  });
});

app.post("/api/player/queue/clear", (req, res) => {
  playbackQueue.clear();
  res.json({ success: true, message: "Queue cleared" });
});

app.get("/api/player/history", (req, res) => {
  res.json({
    size: historyStack.size,
    songs: historyStack.toArray()
  });
});

app.post("/api/player/play", (req, res) => {
  const { songId } = req.body;
  const song = songHashTable.get(String(songId));
  if (!song) return res.status(404).json({ error: "Song not found" });

  // Push existing current song to history stack
  if (currentSong && currentSong.id !== song.id) {
    historyStack.push(currentSong);
  }
  currentSong = song;

  res.json({
    success: true,
    currentSong,
    historySize: historyStack.size,
    queueSize: playbackQueue.size
  });
});

app.post("/api/player/next", (req, res) => {
  // Push current song to history stack
  if (currentSong) {
    historyStack.push(currentSong);
  }

  // Dequeue next track
  const nextTrack = playbackQueue.dequeue();
  if (nextTrack) {
    currentSong = nextTrack;
  } else {
    // If queue empty, loop or pick recommendation
    const recs = songGraph.getSimilarSongs(currentSong ? currentSong.id : 101, 1);
    if (recs.length > 0) {
      currentSong = recs[0].song;
    }
  }

  res.json({
    currentSong,
    queueSize: playbackQueue.size,
    historySize: historyStack.size
  });
});

app.post("/api/player/back", (req, res) => {
  const prev = historyStack.pop();
  if (!prev) {
    return res.status(400).json({ error: "No history to go back to" });
  }

  // Preserve playback: put existing current song back to front of queue
  if (currentSong) {
    playbackQueue.playNext(currentSong);
  }
  currentSong = prev;

  res.json({
    currentSong,
    queueSize: playbackQueue.size,
    historySize: historyStack.size
  });
});

/* =========================================================================
 * 7. RECOMMENDATION GRAPH REST API (SongGraph)
 * ========================================================================= */
app.get("/api/songs/:id/similar", (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const recs = songGraph.getSimilarSongs(req.params.id, limit);
  res.json({
    songId: Number(req.params.id),
    recommendations: recs
  });
});

app.get("/api/songs/:id/multihop", (req, res) => {
  const limit = Number(req.query.limit) || 6;
  const recs = songGraph.getMultiHopRecommendations(req.params.id, limit);
  res.json({
    songId: Number(req.params.id),
    recommendations: recs
  });
});

app.post("/api/recommendations/smart-session", (req, res) => {
  const { startSongId, mood, durationMinutes, avoidRecent } = req.body;
  const avoidSongIds = avoidRecent ? historyStack.toArray().map(s => s.id) : [];

  const session = songGraph.generateListeningSession({
    startSongId: startSongId || currentSong.id,
    mood: mood || "Any",
    targetDurationMinutes: Number(durationMinutes) || 30,
    avoidSongIds
  });

  res.json(session);
});

app.post("/api/recommendations/generate-playlist", (req, res) => {
  const { startSongId, playlistName, createdBy } = req.body;
  const recs = songGraph.getSimilarSongs(startSongId, 8);
  const startSong = songHashTable.get(String(startSongId));

  const newId = Date.now();
  const list = new DoublyLinkedList();
  list.playlistId = newId;
  list.name = playlistName || `Related to ${startSong ? startSong.title : "Track"}`;
  list.description = "Auto-generated from Graph similarity recommendations";
  list.createdBy = createdBy || "graph_engine";

  if (startSong) list.append(startSong);
  for (const r of recs) {
    list.append(r.song);
  }

  activePlaylists.set(newId, list);
  res.json({
    success: true,
    playlistId: newId,
    name: list.name,
    songCount: list.size,
    songs: list.toArray()
  });
});

/* =========================================================================
 * 8. LIVE DSA INSPECTION API (FOR LIVE VISUALIZER & VIVA DEMONSTRATION)
 * ========================================================================= */
app.get("/api/dsa/all-inspection", (req, res) => {
  res.json({
    tree: libraryTree.getStats(),
    queue: playbackQueue.getInspectionData(),
    stack: historyStack.getInspectionData(),
    songHash: songHashTable.getInspectionData(),
    authHash: authTable.getInspectionData(),
    graph: songGraph.getVisualizationData()
  });
});

app.get("/api/dsa/tree-data", (req, res) => {
  res.json(libraryTree.getHierarchy());
});

app.get("/api/dsa/queue-data", (req, res) => {
  res.json(playbackQueue.getInspectionData());
});

app.get("/api/dsa/stack-data", (req, res) => {
  res.json(historyStack.getInspectionData());
});

app.get("/api/dsa/hash-data", (req, res) => {
  res.json(songHashTable.getInspectionData());
});

app.get("/api/dsa/auth-data", (req, res) => {
  res.json(authTable.getInspectionData());
});

app.get("/api/dsa/graph-data", (req, res) => {
  res.json(songGraph.getVisualizationData());
});

// Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(`🎵 SMART MUSIC LIBRARY & RECOMMENDATION SYSTEM IS RUNNING!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📘 Guidelines PDF: http://localhost:${PORT}/docs/Smart_Music_Library_DSA_Guidelines_and_Info.pdf`);
  console.log(`===========================================================`);
});
