// API Base URL - Update this to match your backend
const API_BASE = 'http://localhost:5000';

// State Management
let currentUser = 1;
let watchlist = [];
let currentMovie = null;

// Page Navigation
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(`${pageName}-page`).classList.remove('hidden');
    
    if (pageName === 'watchlist') {
        loadWatchlist();
    }
}

// Show Toast Notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        ${message}
    `;
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, duration);
}

// Get Recommendations
async function getRecommendations() {
    currentUser = document.getElementById('user-select').value;
    showPage('recommendations');
    
    // Show loading skeletons
    showLoadingSkeletons();
    
    try {
        // API Call - Replace with actual endpoint
        const response = await fetch(`${API_BASE}/api/recommend?user_id=${currentUser}`);
        const data = await response.json();
        
        // For demo purposes, use mock data if API fails
        const movies = data.recommendations || getMockMovies();
        displayRecommendations(movies);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        // Use mock data for demo
        displayRecommendations(getMockMovies());
    }
}

// Display Recommendations
function displayRecommendations(movies) {
    const grid = document.getElementById('recommendations-grid');
    grid.innerHTML = '';
    
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        grid.appendChild(card);
    });
}

// Create Movie Card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card bg-gray-900 rounded-lg overflow-hidden cursor-pointer';
    card.onclick = () => showMovieDetails(movie);
    
    card.innerHTML = `
        <div class="relative">
            <img src="${movie.poster || 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(movie.title)}" 
                 alt="${movie.title}" 
                 class="w-full h-72 object-cover">
            <div class="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded">
                <span class="text-yellow-400">⭐ ${movie.rating.toFixed(1)}</span>
            </div>
        </div>
        <div class="p-4">
            <h3 class="font-bold text-lg mb-2 truncate">${movie.title}</h3>
            <p class="text-sm text-gray-400 mb-3">${movie.genres.join(', ')}</p>
            <div class="flex justify-between items-center">
                <button onclick="handleLike(event, ${movie.id})" class="text-gray-400 hover:text-red-500 transition">
                    <i class="fas fa-heart"></i>
                </button>
                <button onclick="handleDislike(event, ${movie.id})" class="text-gray-400 hover:text-gray-200 transition">
                    <i class="fas fa-thumbs-down"></i>
                </button>
                <button onclick="addToWatchlist(event, ${movie.id}, '${movie.title}')" class="text-gray-400 hover:text-yellow-500 transition">
                    <i class="fas fa-bookmark"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Show Movie Details
async function showMovieDetails(movie) {
    showPage('movie-details');
    currentMovie = movie;
    
    const content = document.getElementById('movie-details-content');
    content.innerHTML = `
        <div class="relative">
            <!-- Banner -->
            <div class="h-96 bg-cover bg-center relative" style="background-image: linear-gradient(to bottom, rgba(20,20,20,0.3), rgba(20,20,20,1)), url('${movie.backdrop || movie.poster || 'https://via.placeholder.com/1200x400'}');">
                <div class="absolute bottom-0 left-0 p-12 max-w-3xl">
                    <h1 class="text-5xl font-bold mb-4">${movie.title}</h1>
                    <div class="flex items-center space-x-4 mb-4">
                        <span class="text-green-500 font-bold">${Math.round(movie.rating * 20)}% Match</span>
                        <span>${movie.year || '2024'}</span>
                        <span>${movie.runtime || '2h 15m'}</span>
                        <span class="border border-gray-500 px-2">HD</span>
                    </div>
                    <div class="flex space-x-4">
                        <button class="netflix-red netflix-red-hover px-8 py-3 rounded font-semibold flex items-center">
                            <i class="fas fa-play mr-2"></i> Play
                        </button>
                        <button onclick="addToWatchlist(event, ${movie.id}, '${movie.title}')" class="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded font-semibold flex items-center transition">
                            <i class="fas fa-plus mr-2"></i> My List
                        </button>
                        <button onclick="handleLike(event, ${movie.id})" class="bg-gray-700 hover:bg-gray-600 w-12 h-12 rounded-full flex items-center justify-center transition">
                            <i class="fas fa-thumbs-up"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Details Section -->
            <div class="max-w-7xl mx-auto px-12 py-8">
                <div class="grid grid-cols-3 gap-8">
                    <div class="col-span-2">
                        <div class="mb-6">
                            <h3 class="text-xl font-bold mb-2">Synopsis</h3>
                            <p class="text-gray-300">${movie.description || 'An exciting movie that will keep you on the edge of your seat with stunning visuals and compelling storytelling.'}</p>
                        </div>
                        
                        <div class="mb-6">
                            <h3 class="text-xl font-bold mb-2">Cast</h3>
                            <p class="text-gray-400">${movie.cast || 'Cast information coming soon'}</p>
                        </div>
                    </div>
                    
                    <div>
                        <div class="mb-4">
                            <span class="text-gray-400">Genres:</span>
                            <p class="text-white">${movie.genres.join(', ')}</p>
                        </div>
                        <div class="mb-4">
                            <span class="text-gray-400">Rating:</span>
                            <p class="text-white">⭐ ${movie.rating.toFixed(1)}/5.0</p>
                        </div>
                        <div class="mb-4">
                            <span class="text-gray-400">Release Date:</span>
                            <p class="text-white">${movie.releaseDate || 'TBA'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Handle Like
async function handleLike(event, movieId) {
    event.stopPropagation();
    
    try {
        await fetch(`${API_BASE}/api/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser,
                movie_id: movieId,
                action: 'like'
            })
        });
        
        showToast('Added to your liked movies!');
    } catch (error) {
        console.error('Error sending feedback:', error);
        showToast('Liked!');
    }
}

// Handle Dislike
async function handleDislike(event, movieId) {
    event.stopPropagation();
    
    try {
        await fetch(`${API_BASE}/api/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser,
                movie_id: movieId,
                action: 'dislike'
            })
        });
        
        showToast('We\'ll show you fewer movies like this');
    } catch (error) {
        console.error('Error sending feedback:', error);
        showToast('Disliked');
    }
}

// Add to Watchlist
async function addToWatchlist(event, movieId, movieTitle) {
    event.stopPropagation();
    
    try {
        await fetch(`${API_BASE}/api/watchlist/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser,
                movie_id: movieId
            })
        });
        
        watchlist.push({ id: movieId, title: movieTitle });
        showToast(`Added "${movieTitle}" to your watchlist!`);
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        watchlist.push({ id: movieId, title: movieTitle });
        showToast(`Added to watchlist!`);
    }
}

// Load Watchlist
async function loadWatchlist() {
    const grid = document.getElementById('watchlist-grid');
    grid.innerHTML = '<div class="col-span-full text-center py-12"><i class="fas fa-spinner fa-spin text-4xl"></i></div>';
    
    try {
        const response = await fetch(`${API_BASE}/api/watchlist/${currentUser}`);
        const data = await response.json();
        
        const movies = data.watchlist || getMockWatchlist();
        displayWatchlist(movies);
    } catch (error) {
        console.error('Error loading watchlist:', error);
        displayWatchlist(getMockWatchlist());
    }
}

// Display Watchlist
function displayWatchlist(movies) {
    const grid = document.getElementById('watchlist-grid');
    
    if (movies.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-bookmark text-6xl text-gray-700 mb-4"></i>
                <p class="text-xl text-gray-400">Your watchlist is empty</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    movies.forEach(movie => {
        const card = createWatchlistCard(movie);
        grid.appendChild(card);
    });
}

// Create Watchlist Card
function createWatchlistCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card bg-gray-900 rounded-lg overflow-hidden cursor-pointer relative';
    card.onclick = () => showMovieDetails(movie);
    
    card.innerHTML = `
        <button onclick="removeFromWatchlist(event, ${movie.id})" class="absolute top-2 right-2 z-10 bg-black bg-opacity-75 hover:bg-opacity-100 w-8 h-8 rounded-full flex items-center justify-center transition">
            <i class="fas fa-times"></i>
        </button>
        <img src="${movie.poster || 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(movie.title)}" 
             alt="${movie.title}" 
             class="w-full h-72 object-cover">
        <div class="p-4">
            <h3 class="font-bold text-lg truncate">${movie.title}</h3>
            <p class="text-sm text-gray-400">${movie.genres.join(', ')}</p>
        </div>
    `;
    
    return card;
}

// Remove from Watchlist
async function removeFromWatchlist(event, movieId) {
    event.stopPropagation();
    
    try {
        await fetch(`${API_BASE}/api/watchlist/remove`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser,
                movie_id: movieId
            })
        });
        
        showToast('Removed from watchlist');
        loadWatchlist();
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        showToast('Removed');
        loadWatchlist();
    }
}

// Show Loading Skeletons
function showLoadingSkeletons() {
    const grid = document.getElementById('recommendations-grid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'bg-gray-800 rounded-lg overflow-hidden';
        skeleton.innerHTML = `
            <div class="skeleton h-72 bg-gray-700"></div>
            <div class="p-4">
                <div class="skeleton h-6 bg-gray-700 rounded mb-2"></div>
                <div class="skeleton h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
        `;
        grid.appendChild(skeleton);
    }
}

// Mock Data for Demo
function getMockMovies() {
    return [
        {
            id: 1,
            title: "The Matrix",
            rating: 4.5,
            genres: ["Sci-Fi", "Action"],
            poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            backdrop: "https://image.tmdb.org/t/p/original/icmmSD4vTTDKOq2vvdulafOGw93.jpg",
            year: "1999",
            runtime: "2h 16m",
            description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
            releaseDate: "March 31, 1999"
        },
        {
            id: 2,
            title: "Inception",
            rating: 4.8,
            genres: ["Sci-Fi", "Thriller"],
            poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            year: "2010",
            runtime: "2h 28m",
            description: "A thief who steals corporate secrets through the use of dream-sharing technology.",
            releaseDate: "July 16, 2010"
        },
        {
            id: 3,
            title: "Interstellar",
            rating: 4.7,
            genres: ["Sci-Fi", "Drama"],
            poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            year: "2014",
            runtime: "2h 49m",
            description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            releaseDate: "November 7, 2014"
        },
        {
            id: 4,
            title: "The Dark Knight",
            rating: 4.9,
            genres: ["Action", "Crime", "Drama"],
            poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            year: "2008",
            runtime: "2h 32m",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
            releaseDate: "July 18, 2008"
        },
        {
            id: 5,
            title: "Pulp Fiction",
            rating: 4.6,
            genres: ["Crime", "Drama"],
            poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
            year: "1994",
            runtime: "2h 34m",
            description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
            releaseDate: "October 14, 1994"
        },
        {
            id: 6,
            title: "Fight Club",
            rating: 4.7,
            genres: ["Drama"],
            poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            year: "1999",
            runtime: "2h 19m",
            description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club.",
            releaseDate: "October 15, 1999"
        },
        {
            id: 7,
            title: "Forrest Gump",
            rating: 4.8,
            genres: ["Drama", "Romance"],
            poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
            year: "1994",
            runtime: "2h 22m",
            description: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.",
            releaseDate: "July 6, 1994"
        },
        {
            id: 8,
            title: "The Shawshank Redemption",
            rating: 4.9,
            genres: ["Drama"],
            poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            year: "1994",
            runtime: "2h 22m",
            description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption.",
            releaseDate: "September 23, 1994"
        }
    ];
}

function getMockWatchlist() {
    return getMockMovies().slice(0, 3);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('MovieFlix UI Loaded');
    console.log('API Base URL:', API_BASE);
    console.log('Update API_BASE in app.js to match your backend server');
});
