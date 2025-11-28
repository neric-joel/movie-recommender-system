# MovieFlix - Netflix-Style UI for Hybrid Movie Recommendation System

A modern, responsive web interface for the Hybrid Movie Recommendation System built with vanilla JavaScript and Tailwind CSS.

## Features

### 🏠 Home Page
- Hero banner with call-to-action
- User selection dropdown
- "Get Recommendations" button

### 🎬 Recommendations Page
- Grid layout of recommended movies
- Movie cards with:
  - Poster image
  - Title and genres
  - Rating
  - Like/Dislike/Watchlist buttons
- Click any movie to view details

### 📽️ Movie Details Page
- Netflix-style banner
- Full movie information
- Play button (placeholder)
- Add to watchlist
- Like/Dislike actions

### ⭐ Watchlist Page
- Personal watchlist management
- Remove movies from watchlist
- Click to view movie details

### 🎨 Design Features
- Dark Netflix-style theme (#141414 background, #E50914 red accent)
- Responsive grid layouts
- Smooth hover animations
- Loading skeletons
- Toast notifications
- Mobile-friendly

## Installation

### Option 1: Standalone (No Backend)
Simply open `index.html` in your browser. The UI will use mock data for demonstration.

### Option 2: With Backend Integration

1. **Update API Base URL**
   Edit `app.js` line 2:
   ```javascript
   const API_BASE = 'http://localhost:5000'; // Change to your backend URL
   ```

2. **Serve the UI**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. **Access the UI**
   Open browser to: `http://localhost:8000`

## Backend API Endpoints Required

The UI expects the following endpoints:

### GET `/api/recommend?user_id=<id>`
Returns recommended movies for a user.

**Response Format:**
```json
{
  "recommendations": [
    {
      "id": 1,
      "title": "Movie Title",
      "rating": 4.5,
      "genres": ["Action", "Sci-Fi"],
      "poster": "url",
      "backdrop": "url",
      "year": "2024",
      "runtime": "2h 15m",
      "description": "Movie description",
      "releaseDate": "Jan 1, 2024"
    }
  ]
}
```

### POST `/api/feedback`
Records user feedback (like/dislike).

**Request Body:**
```json
{
  "user_id": 1,
  "movie_id": 123,
  "action": "like" // or "dislike"
}
```

### POST `/api/watchlist/add`
Adds a movie to user's watchlist.

**Request Body:**
```json
{
  "user_id": 1,
  "movie_id": 123
}
```

### GET `/api/watchlist/<user_id>`
Returns user's watchlist.

**Response Format:**
```json
{
  "watchlist": [
    {
      "id": 1,
      "title": "Movie Title",
      "poster": "url",
      "genres": ["Action"]
    }
  ]
}
```

### DELETE `/api/watchlist/remove`
Removes a movie from watchlist.

**Request Body:**
```json
{
  "user_id": 1,
  "movie_id": 123
}
```

### GET `/api/movie/<movie_id>`
Returns detailed movie information.

**Response Format:**
```json
{
  "id": 1,
  "title": "Movie Title",
  "rating": 4.5,
  "genres": ["Action"],
  "poster": "url",
  "backdrop": "url",
  "year": "2024",
  "runtime": "2h 15m",
  "description": "Full description",
  "cast": "Actor 1, Actor 2",
  "releaseDate": "Jan 1, 2024"
}
```

## File Structure

```
UI/
├── index.html          # Main HTML file
├── app.js              # JavaScript logic
└── README.md           # This file
```

## Technologies Used

- **HTML5** - Structure
- **Tailwind CSS** (CDN) - Styling
- **Font Awesome** (CDN) - Icons
- **Vanilla JavaScript** - Interactivity
- **Fetch API** - Backend communication

## Customization

### Change Theme Colors
Edit the CSS variables in `index.html`:
```css
.netflix-red {
    background-color: #E50914; /* Change this */
}
```

### Add More Users
Edit the user dropdown in `index.html`:
```html
<select id="user-select">
    <option value="1">User 1</option>
    <option value="2">User 2</option>
    <!-- Add more -->
</select>
```

### Modify Mock Data
Edit `getMockMovies()` function in `app.js` to change demo data.

## Features Implemented

✅ Home page with user selection  
✅ Get recommendations button  
✅ Recommendations grid  
✅ Movie cards with actions  
✅ Like/Dislike functionality  
✅ Watchlist management  
✅ Movie details page  
✅ Netflix-style navigation  
✅ Responsive design  
✅ Loading skeletons  
✅ Toast notifications  
✅ Hover animations  

## Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Mobile browsers

## Notes

- The UI works standalone with mock data
- For production, implement the backend API endpoints
- Update `API_BASE` in `app.js` to connect to your backend
- CORS must be enabled on your backend for cross-origin requests

## Integration with Python Backend

Example Flask backend setup:

```python
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/api/recommend')
def recommend():
    user_id = request.args.get('user_id')
    # Your recommendation logic here
    return jsonify({'recommendations': movies})

# Add other endpoints...
```

## License

Part of CSE 573 - Hybrid Movie Recommendation System project.
