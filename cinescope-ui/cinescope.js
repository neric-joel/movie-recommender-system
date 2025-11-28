// API Configuration - CHANGE THIS TO YOUR BACKEND URL
const API_BASE = 'http://localhost:5000';

// State
let currentUser = 1;
let watchlist = [];
let searchedMovie = '';
let autocompleteTimeout = null;

// Page Navigation
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(`${pageName}-page`).classList.remove('hidden');

    if (pageName === 'watchlist') {
        loadWatchlist();
    }

    if (pageName === 'home') {
        document.getElementById('search-input').value = '';
        hideAutocomplete();
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') {
        toast.style.background = 'rgba(239, 68, 68, 0.95)';
    }
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
        ${message}
    `;
    document.getElementById('toast-container').appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.4s reverse';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Autocomplete Functions
function handleSearchInput(event) {
    const query = event.target.value.trim();

    if (query.length < 2) {
        hideAutocomplete();
        return;
    }

    // Debounce API calls
    clearTimeout(autocompleteTimeout);
    autocompleteTimeout = setTimeout(() => {
        fetchAutocomplete(query);
    }, 300);
}

function handleSearchFocus() {
    const query = document.getElementById('search-input').value.trim();
    if (query.length >= 2) {
        fetchAutocomplete(query);
    }
}

async function fetchAutocomplete(query) {
    try {
        const response = await fetch(`${API_BASE}/api/autocomplete?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        displayAutocomplete(data.suggestions, query);
    } catch (error) {
        console.error('Autocomplete error:', error);
        hideAutocomplete();
    }
}

function displayAutocomplete(suggestions, query) {
    const dropdown = document.getElementById('autocomplete-dropdown');

    if (!suggestions || suggestions.length === 0) {
        dropdown.innerHTML = '<div class="no-results"><i class="fas fa-film mr-2"></i>No movies found</div>';
        dropdown.classList.remove('hidden');
        return;
    }

    dropdown.innerHTML = '';
    suggestions.forEach(item => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';

        // Highlight matching text
        const title = item.title;
        const highlightedTitle = highlightMatch(title, query);

        div.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <div class="font-semibold">${highlightedTitle}</div>
                    ${item.year ? `<div class="text-xs text-gray-400">${item.year}</div>` : ''}
                </div>
                <i class="fas fa-chevron-right text-gray-600"></i>
            </div>
        `;

        div.onclick = () => selectMovie(item.title);
        dropdown.appendChild(div);
    });

    dropdown.classList.remove('hidden');
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function hideAutocomplete() {
    document.getElementById('autocomplete-dropdown').classList.add('hidden');
}

function selectMovie(title) {
    document.getElementById('search-input').value = title;
    hideAutocomplete();
    searchMovie(new Event('submit'));
}

// Search Movie
async function searchMovie(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value.trim();

    if (!query) {
        showToast('Please enter a movie name', 'error');
        return;
    }

    searchedMovie = query;
    document.getElementById('searched-movie').textContent = query;
    showPage('recommendations');
    showLoadingSkeletons();
    hideAutocomplete();

    try {
        const response = await fetch(`${API_BASE}/api/recommend_by_title?title=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error('Movie not found');
        }

        const data = await response.json();
        displayRecommendations(data.similar_movies);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        showNoResults();
        showToast('Movie not found. Try another title.', 'error');
    }
}

// Quick Search
function quickSearch(movieName) {
    document.getElementById('search-input').value = movieName;
    searchMovie(new Event('submit'));
}

// Display Recommendations
function displayRecommendations(movies) {
    const grid = document.getElementById('recommendations-grid');
    grid.innerHTML = '';

    if (!movies || movies.length === 0) {
        showNoResults();
        return;
    }

    movies.forEach((movie, index) => {
        const card = createMovieCard(movie, index);
        grid.appendChild(card);
    });
}

function showNoResults() {
    const grid = document.getElementById('recommendations-grid');
    grid.innerHTML = `
        <div class="col-span-full text-center py-20">
            <i class="fas fa-search text-6xl text-purple-400/30 mb-4"></i>
            <p class="text-2xl text-gray-400">No similar movies found</p>
            <p class="text-gray-500 mt-2">Try searching for a different movie</p>
        </div>
    `;
}

// Create Movie Card
function createMovieCard(movie, index) {
    const card = document.createElement('div');
    card.className = 'movie-card glass rounded-xl overflow-hidden cursor-pointer glow-hover fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    card.onclick = () => showMovieDetails(movie);

    const posterUrl = movie.poster || `https://via.placeholder.com/300x450/1B2735/8B5CF6?text=${encodeURIComponent(movie.title)}`;

    card.innerHTML = `
        <div class="relative">
            <div class="poster-overlay"></div>
            <img src="${posterUrl}" 
                 alt="${movie.title}" 
                 class="w-full h-80 object-cover"
                 onerror="this.src='https://via.placeholder.com/300x450/1B2735/8B5CF6?text=${encodeURIComponent(movie.title)}'">
            <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                <span class="text-yellow-400 text-sm font-semibold">
                    <i class="fas fa-star mr-1"></i>${movie.rating.toFixed(1)}
                </span>
            </div>
        </div>
        <div class="p-4">
            <h3 class="font-bold text-lg mb-2 truncate movie-title transition-all">${movie.title}</h3>
            <div class="flex flex-wrap gap-1 mb-3">
                ${movie.genres.slice(0, 2).map(g => `
                    <span class="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">${g}</span>
                `).join('')}
            </div>
            <button onclick="addToWatchlist(event, ${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${posterUrl}')" 
                    class="w-full btn-primary py-2 rounded-lg text-sm font-semibold flex items-center justify-center">
                <i class="fas fa-bookmark mr-2"></i>
                Add to Watchlist
            </button>
        </div>
    `;

    return card;
}

// Show Movie Details
async function showMovieDetails(movie) {
    showPage('movie-details');

    const backdropUrl = movie.backdrop || movie.poster || 'https://via.placeholder.com/1200x400/1B2735/8B5CF6';

    const content = document.getElementById('movie-details-content');
    content.innerHTML = `
        <div class="relative">
            <div class="h-96 bg-cover bg-center relative" 
                 style="background: linear-gradient(to bottom, rgba(11,15,26,0.3), rgba(11,15,26,1)), 
                        url('${backdropUrl}');">
                <div class="absolute bottom-0 left-0 p-12 max-w-4xl">
                    <h1 class="text-6xl font-bold mb-4 fade-in">${movie.title}</h1>
                    <div class="flex items-center space-x-4 mb-6 fade-in" style="animation-delay: 0.2s;">
                        <span class="text-emerald-400 font-bold text-lg">
                            <i class="fas fa-star mr-1"></i>${movie.rating.toFixed(1)}/5.0
                        </span>
                        <span class="text-gray-300">${movie.year || '2024'}</span>
                        <span class="text-gray-300">${movie.runtime || 'N/A'}</span>
                        <span class="glass px-3 py-1 rounded-lg text-sm">HD</span>
                    </div>
                    <div class="flex space-x-4 fade-in" style="animation-delay: 0.4s;">
                        <button class="btn-primary px-8 py-3 rounded-xl font-semibold flex items-center">
                            <i class="fas fa-play mr-2"></i> Play Trailer
                        </button>
                        <button onclick="addToWatchlist(event, ${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${movie.poster}')" 
                                class="glass hover:bg-white/10 px-8 py-3 rounded-xl font-semibold flex items-center transition">
                            <i class="fas fa-plus mr-2"></i> My List
                        </button>
                        <button onclick="findSimilar('${movie.title.replace(/'/g, "\\'")}', event)" 
                                class="glass hover:bg-white/10 px-6 py-3 rounded-xl flex items-center transition">
                            <i class="fas fa-sync-alt mr-2"></i> Find Similar
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="max-w-7xl mx-auto px-12 py-12">
                <div class="grid grid-cols-3 gap-12">
                    <div class="col-span-2">
                        <div class="mb-8">
                            <h3 class="text-2xl font-bold mb-3 gradient-text">Synopsis</h3>
                            <p class="text-gray-300 text-lg leading-relaxed">
                                ${movie.overview || 'No overview available.'}
                            </p>
                        </div>
                    </div>
                    
                    <div class="glass rounded-xl p-6">
                        <div class="mb-6">
                            <span class="text-gray-400 text-sm">Genres</span>
                            <div class="flex flex-wrap gap-2 mt-2">
                                ${movie.genres.map(g => `
                                    <span class="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">${g}</span>
                                `).join('')}
                            </div>
                        </div>
                        <div class="mb-6">
                            <span class="text-gray-400 text-sm">Rating</span>
                            <p class="text-white text-xl font-bold mt-1">
                                <i class="fas fa-star text-yellow-400 mr-1"></i>${movie.rating.toFixed(1)}/5.0
                            </p>
                        </div>
                        <div class="mb-6">
                            <span class="text-gray-400 text-sm">Release Date</span>
                            <p class="text-white mt-1">${movie.releaseDate || 'TBA'}</p>
                        </div>
                        <div>
                            <span class="text-gray-400 text-sm">Runtime</span>
                            <p class="text-white mt-1">${movie.runtime || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Find Similar Movies
function findSimilar(movieTitle, event) {
    event.stopPropagation();
    document.getElementById('search-input').value = movieTitle;
    searchMovie(new Event('submit'));
}

// Add to Watchlist
async function addToWatchlist(event, movieId, movieTitle, poster) {
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

        showToast(`Added "${movieTitle}" to your watchlist!`);
    } catch (error) {
        console.error('Error:', error);
        showToast(`Added to watchlist!`);
    }
}

// Load Watchlist
async function loadWatchlist() {
    const grid = document.getElementById('watchlist-grid');
    grid.innerHTML = '<div class="col-span-full text-center py-12"><i class="fas fa-spinner fa-spin text-4xl text-purple-400"></i></div>';

    try {
        const response = await fetch(`${API_BASE}/api/watchlist/${currentUser}`);
        const data = await response.json();

        displayWatchlist(data.watchlist);
    } catch (error) {
        console.error('Error:', error);
        displayWatchlist([]);
    }
}

// Display Watchlist
function displayWatchlist(movies) {
    const grid = document.getElementById('watchlist-grid');

    if (movies.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-20">
                <i class="fas fa-bookmark text-6xl text-purple-400/30 mb-4"></i>
                <p class="text-2xl text-gray-400">Your watchlist is empty</p>
                <p class="text-gray-500 mt-2">Start adding movies to watch later</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';
    movies.forEach((movie, index) => {
        const card = createWatchlistCard(movie, index);
        grid.appendChild(card);
    });
}

// Create Watchlist Card
function createWatchlistCard(movie, index) {
    const card = document.createElement('div');
    card.className = 'movie-card glass rounded-xl overflow-hidden cursor-pointer glow-hover relative fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    card.onclick = () => showMovieDetails(movie);

    const posterUrl = movie.poster || `https://via.placeholder.com/300x450/1B2735/8B5CF6?text=${encodeURIComponent(movie.title)}`;

    card.innerHTML = `
        <button onclick="removeFromWatchlist(event, ${movie.id})" 
                class="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-sm hover:bg-red-500/70 w-10 h-10 rounded-full flex items-center justify-center transition">
            <i class="fas fa-times"></i>
        </button>
        <div class="poster-overlay"></div>
        <img src="${posterUrl}" 
             alt="${movie.title}" 
             class="w-full h-80 object-cover"
             onerror="this.src='https://via.placeholder.com/300x450/1B2735/8B5CF6?text=${encodeURIComponent(movie.title)}'">
        <div class="p-4">
            <h3 class="font-bold text-lg truncate movie-title transition-all">${movie.title}</h3>
            <div class="flex flex-wrap gap-1 mt-2">
                ${movie.genres.slice(0, 2).map(g => `
                    <span class="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">${g}</span>
                `).join('')}
            </div>
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
        console.error('Error:', error);
        showToast('Removed');
        loadWatchlist();
    }
}

// Loading Skeletons
function showLoadingSkeletons() {
    const grid = document.getElementById('recommendations-grid');
    grid.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'glass rounded-xl overflow-hidden';
        skeleton.innerHTML = `
            <div class="skeleton h-80"></div>
            <div class="p-4">
                <div class="skeleton h-6 rounded mb-2"></div>
                <div class="skeleton h-4 rounded w-3/4"></div>
            </div>
        `;
        grid.appendChild(skeleton);
    }
}

// Close autocomplete when clicking outside
document.addEventListener('click', (e) => {
    const searchInput = document.getElementById('search-input');
    const dropdown = document.getElementById('autocomplete-dropdown');

    if (e.target !== searchInput && !dropdown.contains(e.target)) {
        hideAutocomplete();
    }
});

// Initialize
console.log('CineScope initialized with real dataset integration');
console.log('API Base:', API_BASE);
console.log('Make sure backend is running: python backend.py');
