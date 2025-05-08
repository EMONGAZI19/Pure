document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  // Toggle menu on menu icon click
  menuToggle.addEventListener('click', (event) => {
    navMenu.classList.toggle('active');
    event.stopPropagation(); // Prevent event from bubbling up
  });

  // Close menu if clicked outside
  document.addEventListener('mousedown', (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      navMenu.classList.remove('active');
    }
  });

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

  window.searchMovie = function () {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const movieSections = document.querySelectorAll('.movie-section');
    const oldResults = document.getElementById('searchResults');
    const oldMessage = document.getElementById('noResultMessage');

    // Remove previous search results or message
    oldResults?.remove();
    oldMessage?.remove();

    if (searchQuery.trim() === '') {
      movieSections.forEach(section => section.style.display = '');
      return;
    }

    // Hide all sections for search view
    movieSections.forEach(section => section.style.display = 'none');

    let found = false;
    const resultSection = document.createElement('div');
    resultSection.classList.add('movie-section');
    resultSection.id = 'searchResults';

    const heading = document.createElement('h2');
    heading.textContent = `Search Results for "${searchQuery}"`;
    resultSection.appendChild(heading);

    const resultGrid = document.createElement('div');
    resultGrid.classList.add('movie-grid');

    for (const category in movies) {
      movies[category].forEach(movie => {
        if (movie.title.toLowerCase().includes(searchQuery)) {
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
      const noResultMessage = document.createElement('div');
      noResultMessage.id = 'noResultMessage';
      noResultMessage.style.textAlign = 'center';
      noResultMessage.style.color = '#ff4444';
      noResultMessage.style.margin = '20px';
      noResultMessage.textContent = 'এই মুভি টি নেই, রিকুয়েস্ট বাটন থেকে রিকুয়েস্ট করুন';
      document.body.appendChild(noResultMessage);
    }
  }

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
