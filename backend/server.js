require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB with Better Error Handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Stop the server if MongoDB fails to connect
  });

// ✅ Define Movie Schema
const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  poster: { type: String }
});

const Movie = mongoose.model("Movie", MovieSchema);

// ✅ API Endpoint: Fetch All Movies
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ API Endpoint: Add a Movie
app.post("/movies", async (req, res) => {
  try {
    const { title, year, genre, poster } = req.body;
    if (!title || !year || !genre) {
      return res.status(400).json({ error: "Title, year, and genre are required" });
    }
    
    const newMovie = new Movie({ title, year, genre, poster });
    await newMovie.save();
    res.status(201).json({ message: "🎬 Movie added successfully!", movie: newMovie });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie" });
  }
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
