const moviesDiv = document.querySelector('.movies');
const buttonNext = document.querySelector('.btn-next');
const buttonPrev = document.querySelector('.btn-prev');
const searchedMovieInput = document.querySelector('.input');

const body = document.querySelector('body');
const modalDiv = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalGenres = document.querySelector('.modal__genres');
const modalAverage = document.querySelector('.modal__average');

const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightVideoLink = document.querySelector('.highlight__video-link');

let currentPage = 0;
let numberMoviePages;
let currentMovies = [];

searchedMovieInput.addEventListener('keydown', function (e) {

    if (e.key !== 'Enter') {
        return;
    }

    currentPage = 0;

    if (searchedMovieInput.value) {
        loadSearchMovies(searchedMovieInput.value);
    } else {
        loadMovies();
    }

    searchedMovieInput.value = '';
});

buttonNext.addEventListener('click', function () {
    if (currentPage === numberMoviePages) {
        currentPage = 0;
    } else {
        currentPage++;
    }
    loadMovies();
});


buttonPrev.addEventListener('click', function () {
    if (currentPage === 0) {
        currentPage = numberMoviePages;
    } else {
        currentPage--;
    }
    loadMovies();
});

modalDiv.addEventListener('click', closeModal);

modalClose.addEventListener('click', closeModal);

function closeModal() {
    modalDiv.classList.add('hidden');
    body.style.overflow = 'auto';
}

function displayMovies() {
    moviesDiv.textContent = '';

    for (let i = currentPage * 5; i < (currentPage + 1) * 5; i++) {
        const movie = currentMovies[i];

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie');

        movieContainer.addEventListener('click', function () {
            loadMovie(movie.id);
        });

        movieContainer.style.backgroundImage = `url('${movie.poster_path}')`;

        const movieInfoDiv = document.createElement('div');
        movieInfoDiv.classList.add('movie__info');

        const movieTitleSpan = document.createElement('span');
        movieTitleSpan.classList.add('movie__title');
        movieTitleSpan.textContent = movie.title;

        const movieRatingSpan = document.createElement('span');
        movieRatingSpan.classList.add('movie__rating');

        const starImg = document.createElement('img');
        starImg.src = './assets/estrela.svg';
        starImg.alt = 'Estrela';

        movieRatingSpan.append(starImg, movie.vote_average);
        movieInfoDiv.append(movieTitleSpan, movieRatingSpan);
        movieContainer.append(movieInfoDiv);
        moviesDiv.append(movieContainer);
    }
}

function loadSearchMovies(search) {
    const responsePromise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${search}`);

    responsePromise.then(answer => {
        const promiseBody = answer.json();

        promiseBody.then(body => {
            currentMovies = body.results;
            numberMoviePages = (Math.ceil(body.results.length / 5) - 1);
            displayMovies();
        });
    });
}

function loadMovies() {
    const responsePromise = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');

    responsePromise.then(answer => {
        const promiseBody = answer.json();

        promiseBody.then(body => {
            currentMovies = body.results;
            numberMoviePages = (Math.ceil(body.results.length / 5) - 1);
            displayMovies();
        });
    });
}

function loadHighlightMovie() {
    const basePromise = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');

    basePromise.then(answer => {
        const promiseBody = answer.json();

        promiseBody.then(body => {
            highlightVideo.style.background = `linear-gradient(rgba(0, 0, 0, 0.6) 100%, rgba(0, 0, 0, 0.6) 100%),
            url(${body.backdrop_path}) no-repeat center/cover`;
            highlightTitle.textContent = body.title;
            highlightRating.textContent = body.vote_average.toFixed(1);
            highlightGenres.textContent = body.genres.map((genre) => {
                return genre.name;
            }).join(', ');
            highlightLaunch.textContent = (new Date(body.release_date)).toLocaleDateString
                ('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
            highlightDescription.textContent = body.overview;
        });
    });

    const linkPromise = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');

    linkPromise.then(answer => {
        const promiseBody = answer.json();

        promiseBody.then(body => {
            const highlightMovie = body.results[0].key;
            highlightVideoLink.href = `https://www.youtube.com/watch?v=${highlightMovie}`;
        });
    });
}

function loadMovie(id) {
    modalDiv.classList.remove('hidden');
    body.style.overflow = 'hidden';
    modalTitle.textContent = '';
    modalImg.src = '';
    modalDescription.textContent = '';
    modalAverage.textContent = '';

    const responsePromise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);

    responsePromise.then(answer => {
        const promiseBody = answer.json();

        promiseBody.then(body => {
            modalTitle.textContent = body.title;
            modalImg.src = body.backdrop_path;
            modalImg.alt = body.title;
            modalDescription.textContent = body.overview;
            modalAverage.textContent = body.vote_average;

            modalGenres.textContent = '';

            body.genres.forEach(genre => {
                const spanGenre = document.createElement('span');
                spanGenre.classList.add('modal__genre');
                spanGenre.textContent = genre.name;

                modalGenres.append(spanGenre);
            });
        });
    });
}

loadMovies();
loadHighlightMovie();



const buttonTheme = document.querySelector('.btn-theme');

const initialTheme = localStorage.getItem('theme');

buttonTheme.src = initialTheme === 'light' ? './assets/light-mode.svg' : './assets/dark-mode.svg';

buttonNext.src = initialTheme === 'light' ? './assets/seta-direita-preta.svg' : './assets/seta-direita-branca.svg';
buttonPrev.src = initialTheme === 'light' ? './assets/seta-esquerda-preta.svg' : './assets/seta-esquerda-branca.svg';

const backgroundColor = initialTheme === 'light' ? '#FFF' : '#242424';
body.style.setProperty('--background-color', backgroundColor);

const inputBorderColor = initialTheme === 'light' ? '#979797' : '#FFFFFF';
body.style.setProperty('--input-border-color', inputBorderColor);

const color = initialTheme === 'light' ? '#000' : '#FFFFFF';
body.style.setProperty('--color', color);

const shadowColor = initialTheme === 'light' ? '0px 4px 8px rgba(0, 0, 0, 0.15)' : '0px 4px 8px rgba(255, 255, 255, 0.15)';
body.style.setProperty('--shadow-color', shadowColor);

const highlightBackground = initialTheme === 'light' ? '#FFF' : '#454545';
body.style.setProperty('--highlight-background', highlightBackground);

const highlightColor = initialTheme === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
body.style.setProperty('--highlight-color', highlightColor);

const highlightDescriptionColor = initialTheme === 'light' ? '#000' : '#FFF';
body.style.setProperty('--highlight-description', highlightDescriptionColor);

buttonTheme.addEventListener('click', function () {
    const theme = initialTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);

    const newBackgroundColor =
        body.style.getPropertyValue('--background-color') === '#242424' ? '#FFF' : '#242424';
    body.style.setProperty('--background-color', newBackgroundColor);

    buttonTheme.src = body.style.getPropertyValue('--background-color') === '#FFF'
        ? './assets/light-mode.svg' : './assets/dark-mode.svg';

    buttonNext.src = body.style.getPropertyValue('--background-color') === '#FFF'
        ? './assets/seta-direita-preta.svg' : './assets/seta-direita-branca.svg';

    buttonPrev.src = body.style.getPropertyValue('--background-color') === '#FFF'
        ? './assets/seta-esquerda-preta.svg' : './assets/seta-esquerda-branca.svg';

    const newInputBorderColor =
        body.style.getPropertyValue('--input-border-color') === '#979797' ? '#FFF' : '#979797';
    body.style.setProperty('--input-border-color', newInputBorderColor);

    const newColor =
        body.style.getPropertyValue('--color') === '#000' ? '#FFF' : '#000';
    body.style.setProperty('--color', newColor);

    const newShadowColor =
        body.style.getPropertyValue('--shadow-color') === '0px 4px 8px rgba(255, 255, 255, 0.15)'
            ? '0px 4px 8px rgba(0, 0, 0, 0.15)'
            : '0px 4px 8px rgba(255, 255, 255, 0.15)';
    body.style.setProperty('--shadow-color', newShadowColor);

    const newHighlightBackground =
        body.style.getPropertyValue('--highlight-background') === '#454545' ? '#FFF' : '#454545';
    body.style.setProperty('--highlight-background', newHighlightBackground);

    const newHighlightColor =
        body.style.getPropertyValue('--highlight-color') === 'rgba(255, 255, 255, 0.7)'
            ? 'rgba(0, 0, 0, 0.7)'
            : 'rgba(255, 255, 255, 0.7)';
    body.style.setProperty('--highlight-color', newHighlightColor);

    const newHighlightDescriptionColor =
        body.style.getPropertyValue('--highlight-description') === '#FFF' ? '#000' : '#FFF';
    body.style.setProperty('--highlight-description', newHighlightDescriptionColor);
});
