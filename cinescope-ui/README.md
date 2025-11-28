# CineScope - Real Dataset Integration

A premium movie similarity finder with **REAL DATASET** integration, autocomplete search, and TF-IDF-based recommendations.

## ✨ Features

### 🎯 Real Dataset Integration
- Uses your actual MovieLens dataset from `DATA/movies_metadata.csv`
- TF-IDF similarity model for accurate recommendations
- No mock data - all recommendations are real

### 🔍 Google-Style Autocomplete
- Dynamic suggestions as you type
- Fuzzy matching with partial text
- Case-insensitive search
- Top 10 matches displayed
- Highlighted matching text
- Click outside to dismiss

### 🎬 Full Functionality
- Search for any movie in the dataset
- Get 10 similar movies based on TF-IDF
- View detailed movie information
- Add movies to watchlist
- Premium glassmorphism UI

## 📁 Project Structure

```
cinescope-ui/
├── backend.py              # Flask API with real dataset
├── index.html              # Frontend with autocomplete
├── cinescope.js            # JavaScript with API integration
├── requirements.txt        # Python dependencies
└── README.md               # This file
```

## 🚀 Setup Instructions

### Step 1: Install Python Dependencies

```bash
cd cinescope-ui
pip install -r requirements.txt
```

**Dependencies:**
- Flask - Web framework
- Flask-CORS - Cross-origin requests
- Pandas - Data manipulation
- NumPy - Numerical operations
- Scikit-learn - TF-IDF and cosine similarity

### Step 2: Verify Dataset

Make sure your dataset is in the correct location:
```
movie-recommender-system/
├── DATA/
│   ├── movies_metadata.csv  ← REQUIRED
│   ├── ratings.csv
│   ├── links.csv
│   ├── credits.csv
│   └── keywords.csv
└── cinescope-ui/
    ├── backend.py
    └── ...
```

### Step 3: Start the Backend

```bash
python backend.py
```

**Expected output:**
```
Loading dataset...
Building TF-IDF model...
Computing similarity matrix...
Loaded 45466 movies
Dataset ready!

Starting Flask server on http://localhost:5000
```

**Note:** First startup takes 30-60 seconds to load dataset and build TF-IDF model.

### Step 4: Open the Frontend

Open `index.html` in your browser:
```
file:///path/to/cinescope-ui/index.html
```

Or serve it with Python:
```bash
python -m http.server 8000
# Then open: http://localhost:8000
```

## 🎯 How to Use

### 1. Search with Autocomplete
- Type at least 2 characters in the search bar
- Suggestions appear automatically
- Click a suggestion or press Enter

### 2. View Similar Movies
- After searching, see 10 similar movies
- Based on TF-IDF similarity of:
  - Movie overview
  - Genres
  - Title

### 3. Movie Details
- Click any movie card
- View full information
- Add to watchlist
- Find more similar movies

### 4. Watchlist
- Click "Add to Watchlist" on any movie
- View all saved movies in Watchlist page
- Remove movies anytime

## 🔌 API Endpoints

### GET `/api/autocomplete?query=<text>`
Returns movie suggestions for autocomplete.

**Example:**
```bash
curl "http://localhost:5000/api/autocomplete?query=ava"
```

**Response:**
```json
{
  "suggestions": [
    {"title": "Avatar", "id": 19995, "year": "2009", "score": 0.9},
    {"title": "Avengers", "id": 24428, "year": "2012", "score": 0.85}
  ]
}
```

### GET `/api/recommend_by_title?title=<movie>`
Returns 10 similar movies.

**Example:**
```bash
curl "http://localhost:5000/api/recommend_by_title?title=Avatar"
```

**Response:**
```json
{
  "similar_movies": [
    {
      "id": 76600,
      "title": "Avatar: The Way of Water",
      "rating": 3.8,
      "genres": ["Sci-Fi", "Adventure"],
      "poster": "https://image.tmdb.org/t/p/w500/...",
      "year": "2022",
      "overview": "...",
      "runtime": "192min"
    }
  ]
}
```

### Other Endpoints
- `GET /api/movie/<movie_id>` - Movie details
- `GET /api/watchlist/<user_id>` - User's watchlist
- `POST /api/watchlist/add` - Add to watchlist
- `DELETE /api/watchlist/remove` - Remove from watchlist

## 🎨 Design Features

- **Dark Gradient**: #0B0F1A → #1B2735
- **Glassmorphism**: Frosted glass effects
- **Neon Accents**: Purple (#8B5CF6) and Emerald (#10B981)
- **Smooth Animations**: 300ms transitions
- **Hover Effects**: Scale 1.07, glow, lift shadow
- **Loading States**: Skeleton placeholders
- **Toast Notifications**: Success/error messages

## 🔧 Customization

### Change API URL
Edit `cinescope.js` line 2:
```javascript
const API_BASE = 'http://localhost:5000';  // Change this
```

### Adjust Similarity Model
Edit `backend.py`:
```python
# Line 37: Adjust TF-IDF features
tfidf_vectorizer = TfidfVectorizer(
    stop_words='english', 
    max_features=5000  # Increase for more features
)

# Line 46: Change number of similar movies
sim_scores = sim_scores[1:11]  # Change 11 to show more/less
```

### Modify Autocomplete Threshold
Edit `backend.py` line 76:
```python
if score > 0.3:  # Lower = more results, Higher = fewer results
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if dataset exists
ls ../DATA/movies_metadata.csv

# Install dependencies
pip install -r requirements.txt
```

### Autocomplete not working
- Make sure backend is running on port 5000
- Check browser console for errors
- Verify CORS is enabled (Flask-CORS installed)

### Movies not found
- Dataset must have `movies_metadata.csv`
- Search for exact titles from the dataset
- Try autocomplete suggestions

### Posters not loading
- Posters use TMDB URLs from dataset
- Some movies may not have poster_path
- Fallback placeholder is shown automatically

## 📊 Dataset Information

**Source:** MovieLens / TMDB
**Movies:** ~45,000
**Fields Used:**
- `id` - Movie ID
- `title` - Movie title
- `overview` - Plot description
- `genres` - JSON array of genres
- `vote_average` - Rating (0-10)
- `poster_path` - TMDB poster URL
- `backdrop_path` - TMDB backdrop URL
- `release_date` - Release date
- `runtime` - Duration in minutes

## 🚀 Performance

- **Dataset Load:** 30-60 seconds (first time)
- **TF-IDF Build:** 10-20 seconds
- **Autocomplete:** <100ms
- **Recommendations:** <200ms
- **Total Memory:** ~500MB (with similarity matrix)

## 📝 Notes

- Watchlist is stored in-memory (resets on server restart)
- For production, use a database for watchlists
- TF-IDF model is built once at startup
- Similarity matrix is precomputed for speed

## 🎬 Example Searches

Try these movies:
- Avatar
- The Dark Knight
- Inception
- Toy Story
- The Matrix
- Interstellar
- Pulp Fiction
- The Shawshank Redemption

## 📄 License

Part of CSE 573 - Hybrid Movie Recommendation System project.
