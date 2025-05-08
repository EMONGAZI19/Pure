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

  // Create a movie card
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

  // Load movies per category
  function loadMovies(category, showAll = false) {
    const movieContainer = document.getElementById(category);
    movieContainer.innerHTML = '';

    const moviesCategory = movies[category];
    const limit = showAll ? moviesCategory.length : 12;

    for (let i = 0; i < limit && i < moviesCategory.length; i++) {
      const movie = moviesCategory[i];
      const movieCard = createMovieCard(movie);
      movieContainer.appendChild(movieCard);
    }

    const button = document.querySelector(`button[data-category="${category}"]`);
    if (button) {
      button.textContent = showAll ? 'Show Less' : 'See All';
      button.setAttribute('data-showing-all', showAll);
    }
  }

  window.toggleShow = function (category) {
    const button = document.querySelector(`button[data-category="${category}"]`);
    const isShowingAll = button.getAttribute('data-showing-all') === 'true';
    loadMovies(category, !isShowingAll);
  }

  // LIVE SEARCH
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
    const resultSection = document.createElement('div');
    resultSection.classList.add('movie-section');
    resultSection.id = 'searchResults';

    const heading = document.createElement('h2');
    heading.textContent = `Search Results for "${query}"`;
    resultSection.appendChild(heading);

    const resultGrid = document.createElement('div');
    resultGrid.classList.add('movie-grid');

    for (const category in movies) {
      movies[category].forEach(movie => {
        if (movie.title.toLowerCase().includes(query)) {
          const movieCard = createMovieCard(movie);
          resultGrid.appendChild(movieCard);
          found = true;
        }
      });
    }

    if (found) {
      resultSection.appendChild(resultGrid);
      document.body.insertBefore(resultSection, document.querySelector('footer'));
    } else {
      const noResult = document.createElement('div');
      noResult.id = 'noResultMessage';
      noResult.style.textAlign = 'center';
      noResult.style.color = '#ff4444';
      noResult.style.margin = '20px';
      noResult.textContent = 'এই মুভি টি নেই, রিকুয়েস্ট বাটন থেকে রিকুয়েস্ট করুন';
      document.body.appendChild(noResult);
    }
  });

  // Initial Load for All Categories
  const categories = [
    'latestMovies',
    'banglaMovies',
    'hindiDubbedMovies',
    'hollywoodMovies',
    'banglaDubbedMovies',
    'animeMovies'
  ];
  categories.forEach(category => loadMovies(category));
});
