document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const searchInput = document.getElementById('searchInput');

  // Toggle menu
  menuToggle.addEventListener('click', (event) => {
    navMenu.classList.toggle('active');
    event.stopPropagation();
  });

  // Close menu if clicked outside
  document.addEventListener('mousedown', (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      navMenu.classList.remove('active');
    }
  });

  // Create movie card
  function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const link = document.createElement('a');
    link.href = movie.link || "#";
    link.target = "_blank";

    const movieImage = document.createElement('img');
    movieImage.src = movie.image;
    movieImage.alt = movie.title;

    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.title;

    link.appendChild(movieImage);
    link.appendChild(movieTitle);
    movieCard.appendChild(link);

    return movieCard;
  }

  // Load movies by category tag
  function loadMovies(categoryTag, showAll = false) {
    const container = document.getElementById(categoryTag);
    container.innerHTML = '';

    const filtered = movies.filter(movie => movie.categories.includes(categoryTag));
    if (filtered.length === 0) {
  const noMovie = document.createElement('div');
  noMovie.classList.add('no-movie-message-wrapper');
  noMovie.innerHTML = `<p class="no-movie-message">এই ক্যাটাগরিতে কোনো মুভি নেই।</p>`;
  container.appendChild(noMovie);
  return;
}

    const limit = showAll ? filtered.length : 12;
    for (let i = 0; i < Math.min(limit, filtered.length); i++) {
      const movieCard = createMovieCard(filtered[i]);
      container.appendChild(movieCard);
    }

    const button = document.querySelector(`button[data-category="${categoryTag}"]`);
    if (button) {
      button.textContent = showAll ? 'Show Less' : 'See All';
      button.setAttribute('data-showing-all', showAll);
    }
  }

  // Toggle Show All / Show Less
  window.toggleShow = function (category) {
    const button = document.querySelector(`button[data-category="${category}"]`);
    const isShowingAll = button.getAttribute('data-showing-all') === 'true';
    loadMovies(category, !isShowingAll);
  }

  // Live Search
  searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase().trim();
    const oldResults = document.getElementById('searchResults');
    const oldMessage = document.getElementById('noResultMessage');
    oldResults?.remove();
    oldMessage?.remove();

    const allSections = document.querySelectorAll('.movie-section');
    if (query === "") {
      allSections.forEach(section => section.style.display = '');
      return;
    } else {
      allSections.forEach(section => section.style.display = 'none');
    }

    let found = false;
    const shownTitles = new Set();

    const resultSection = document.createElement('div');
    resultSection.classList.add('movie-section');
    resultSection.id = 'searchResults';

    const heading = document.createElement('h2');
    heading.textContent = `Search Results for "${query}"`;
    resultSection.appendChild(heading);

    const resultGrid = document.createElement('div');
    resultGrid.classList.add('movie-grid');

    movies.forEach(movie => {
      if (movie.title.toLowerCase().includes(query) && !shownTitles.has(movie.title)) {
        const movieCard = createMovieCard(movie);
        resultGrid.appendChild(movieCard);
        shownTitles.add(movie.title);
        found = true;
      }
    });

    if (found) {
      resultSection.appendChild(resultGrid);
      document.body.insertBefore(resultSection, document.querySelector('footer'));
    } else {
      const noResult = document.createElement('a');
      noResult.id = 'noResultMessage';
      noResult.href = 'movie-request.html';
      noResult.textContent = 'এই মুভি টি নেই, এখানে ক্লিক করে রিকুয়েস্ট করুন';
      noResult.style.display = 'block';
      noResult.style.textAlign = 'center';
      noResult.style.margin = '20px';
      noResult.style.color = '#fff';
      document.body.insertBefore(noResult, document.querySelector('footer'));
    }
  });

  // Initial category load
  const categories = [
    'latestMovies',
    'banglaMovies',
    'hindiDubbedMovies',
    'hollywoodMovies',
    'banglaDubbedMovies',
    'tvwebseries',
    'animeMovies'
  ];
  categories.forEach(category => loadMovies(category));
});
