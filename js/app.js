const PLAYER_PARAMS = "?autoplay=true&poster=true&title=true&download=true&watchparty=true&chromecast=true&servericon=true&setting=true&pip=true&icons=netflix&primarycolor=6C63FF&secondarycolor=9F9BFF&iconcolor=FFFFFF&logourl=https%3A%2F%2Fi.ibb.co%2F67wTJd9R%2Fpngimg-com-netflix-PNG11.png&font=Roboto&fontcolor=FFFFFF&fontsize=20&opacity=0.5";

let myLibrary = JSON.parse(localStorage.getItem('autoflixLibrary')) || [];
let currentTheme = 'dark';

const moviesData = [
    {id: "693134", title: "Dune: Part Two", poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9jR3Y4b0P8k4z.jpg", type: "movie"},
    {id: "872585", title: "Oppenheimer", poster: "https://image.tmdb.org/t/p/w500/8G2hG5QhKq.jpg", type: "movie"},
    {id: "1029575", title: "The Holdovers", poster: "https://image.tmdb.org/t/p/w500/5fS5q4YkYh.jpg", type: "movie"}
];

const tvData = [
    {id: "1399", title: "Game of Thrones", poster: "https://image.tmdb.org/t/p/w500/1X4kKz6zq3z.jpg", type: "tv"},
    {id: "94997", title: "House of the Dragon", poster: "https://image.tmdb.org/t/p/w500/7Q1v2QvYkYh.jpg", type: "tv"},
    {id: "1396", title: "Breaking Bad", poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGtP.jpg", type: "tv"}
];

function getEmbedUrl(id, type) {
    const base = type === "movie" 
        ? `https://player.vidplus.to/embed/movie/${id}` 
        : `https://player.vidplus.to/embed/tv/${id}/1/1`;
    return base + PLAYER_PARAMS;
}

function createCard(item) {
    const div = document.createElement('div');
    div.className = "card flex-shrink-0 w-40 md:w-52 cursor-pointer snap-start";
    div.innerHTML = `
        <img src="${item.poster}" alt="${item.title}" class="rounded-2xl w-full aspect-[2/3] object-cover shadow-2xl">
        <p class="text-center mt-3 text-sm font-medium">${item.title}</p>
    `;
    div.onclick = () => openPlayer(item.id, item.title, item.type);
    return div;
}

function openPlayer(id, title, type) {
    const modal = document.getElementById('player-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('modal-title').textContent = title;

    const container = document.getElementById('embed-container');
    container.innerHTML = `<iframe src="${getEmbedUrl(id, type)}" allowfullscreen allow="autoplay; fullscreen" class="w-full h-full"></iframe>`;
}

function closePlayer() {
    const modal = document.getElementById('player-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <nav class="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div class="max-w-screen-2xl mx-auto px-6 py-5 flex justify-between items-center">
            <div class="flex items-center gap-8">
                <div class="text-4xl font-black text-red-600 tracking-tighter">AutoFlix</div>
                <div class="hidden md:flex gap-6 text-sm font-medium">
                    <a onclick="navigate('home')" class="hover:text-white cursor-pointer">Home</a>
                    <a onclick="navigate('movies')" class="hover:text-white cursor-pointer">Movies</a>
                    <a onclick="navigate('tv')" class="hover:text-white cursor-pointer">TV Shows</a>
                    <a onclick="navigate('library')" class="hover:text-white cursor-pointer">My List</a>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <button onclick="toggleTheme()" class="p-3 rounded-full hover:bg-white/10">
                    <i id="theme-icon" class="fas fa-moon text-xl"></i>
                </button>
                <button onclick="showAddModal()" class="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2">
                    <i class="fas fa-plus"></i> Add
                </button>
            </div>
        </div>
    </nav>

    <div id="home" class="hero-bg h-screen flex items-end pb-20 relative">
        <div class="max-w-screen-2xl mx-auto px-6 md:px-12 z-10">
            <h1 class="text-5xl md:text-7xl font-bold tracking-tighter mb-4">DUNE: PART TWO</h1>
            <button onclick="playFeatured()" class="bg-white text-black px-8 py-4 rounded-full text-xl font-bold flex items-center gap-3">▶ PLAY NOW</button>
        </div>
    </div>

    <div class="max-w-screen-2xl mx-auto px-6 md:px-8 pt-8">
        <h2 class="text-3xl font-semibold mb-4">Popular Movies</h2>
        <div id="movies-row" class="flex gap-4 overflow-x-auto row pb-8"></div>

        <h2 class="text-3xl font-semibold mb-4 mt-8">Popular TV Shows</h2>
        <div id="tv-row" class="flex gap-4 overflow-x-auto row pb-8"></div>

        <h2 class="text-3xl font-semibold mb-4 mt-8">My List</h2>
        <div id="library-row" class="flex gap-4 overflow-x-auto row pb-8"></div>
    </div>

    <!-- Player Modal -->
    <div id="player-modal" onclick="if(event.target.id==='player-modal')closePlayer()" class="hidden fixed inset-0 bg-black/95 z-[9999] items-center justify-center">
        <div class="w-full max-w-7xl mx-4 bg-zinc-950 rounded-3xl overflow-hidden">
            <div class="px-8 py-5 border-b flex justify-between">
                <h2 id="modal-title" class="text-3xl font-bold"></h2>
                <button onclick="closePlayer()" class="text-4xl">✕</button>
            </div>
            <div class="p-8">
                <div id="embed-container" class="aspect-video bg-black rounded-2xl overflow-hidden"></div>
            </div>
        </div>
    </div>

    <!-- Add Modal -->
    <div id="add-modal" onclick="if(event.target.id==='add-modal')hideAddModal()" class="hidden fixed inset-0 bg-black/90 z-[10000] items-center justify-center">
        <div class="bg-zinc-900 p-8 rounded-3xl w-full max-w-md mx-4">
            <h3 class="text-2xl font-bold mb-6">Add Title</h3>
            <input id="add-id" placeholder="TMDB ID" class="w-full bg-zinc-800 p-4 rounded-2xl mb-4">
            <input id="add-title" placeholder="Title" class="w-full bg-zinc-800 p-4 rounded-2xl mb-4">
            <button onclick="addToLibrary()" class="w-full bg-red-600 py-4 rounded-3xl font-bold">Add to My List</button>
        </div>
    </div>`;
    
    renderRows();
}

function renderRows() {
    document.getElementById('movies-row').innerHTML = moviesData.map(m => createCard(m).outerHTML).join('');
    document.getElementById('tv-row').innerHTML = tvData.map(t => createCard(t).outerHTML).join('');
    const libRow = document.getElementById('library-row');
    libRow.innerHTML = myLibrary.length ? myLibrary.map(item => createCard(item).outerHTML).join('') : '<p class="text-gray-400 py-12">Your list is empty</p>';
}

function playFeatured() {
    openPlayer(693134, "Dune: Part Two", "movie");
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.getElementById('theme-icon').classList.toggle('fa-moon', currentTheme === 'dark');
    document.getElementById('theme-icon').classList.toggle('fa-sun', currentTheme !== 'dark');
}

function showAddModal() {
    document.getElementById('add-modal').classList.remove('hidden');
    document.getElementById('add-modal').classList.add('flex');
}

function hideAddModal() {
    const m = document.getElementById('add-modal');
    m.classList.add('hidden');
    m.classList.remove('flex');
}

function addToLibrary() {
    const id = document.getElementById('add-id').value.trim();
    const title = document.getElementById('add-title').value.trim() || "Custom Title";
    if (!id) return alert("Enter TMDB ID");
    myLibrary.unshift({id, title, poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9jR3Y4b0P8k4z.jpg", type: "movie"});
    localStorage.setItem('autoflixLibrary', JSON.stringify(myLibrary));
    hideAddModal();
    renderRows();
}

function navigate(page) {
    if (page === 'library') document.getElementById('library-row').scrollIntoView({behavior: "smooth"});
}

window.onload = renderApp;