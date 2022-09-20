const moviesDiv = document.querySelector('.movies');
const modalDiv = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalMovie = document.querySelector('.modal__movie');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalGenres = document.querySelector('.modal__genres');
const modalAverage = document.querySelector('.modal__average');
const buttonNext = document.querySelector('.btn-next');
const buttonPrev = document.querySelector('.btn-prev');


let carousel;
let carouselPageNumber;
let carouselPages = 0;

const paginationMovies = () => {
    let start = carouselPages * 5;
    let end = (carouselPages + 1) * 5;
    return carousel.slice(start, end);
}

/*  for (let i = 0; i < carouselPageNumber; i++) {
      carouselPages.push(i);
  }*/

const buildCarousel = (movieList) => {
    carousel = movieList;

    carouselPageNumber = Math.ceil(carousel.length / 5);

    let currentPageMovies = paginationMovies();

    const featureFilmDiv = document.createElement('div');
    featureFilmDiv.classList.add('movie');

    currentPageMovies.forEach(movie => {
        const featureFilmDiv = document.createElement('div');
        featureFilmDiv.classList.add('movie');
        featureFilmDiv.id = movie.id;
        featureFilmDiv.style.backgroundImage = `url(${movie.poster_path})`;

        const movieInfoDiv = document.createElement('div');
        movieInfoDiv.classList.add('movie_info');

        const movieTitleSpan = document.createElement('span');
        movieTitleSpan.classList.add('movie_title');
        movieTitleSpan.textContent = movie.title;

        const movieRatingSpan = document.createElement('span');
        movieRatingSpan.classList.add('movie_rating');
        movieRatingSpan.textContent = movie.vote_average.toFixed(1);

        const starImg = document.createElement('img');
        starImg.src = './assets/estrela.svg';
        starImg.alt = 'Estrela';

        movieRatingSpan.append(starImg);
        movieInfoDiv.append(movieTitleSpan, movieRatingSpan);
        featureFilmDiv.append(movieInfoDiv);
        moviesDiv.append(featureFilmDiv);
    });
};


const searchedMovieInput = document.querySelector('.input');

searchedMovieInput.addEventListener('keydown', function (e) {
    const search = searchedMovieInput.value;

    if (!search || e.key !== 'Enter') return;

    carouselPages = 0;

    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${search}`).then(answer => {
        const promiseBody = answer.json();

        promiseBody.then(body => {
            if (body.results.length === 0) {
                searchedMovieInput.value = '';
                return;
            }

            carousel = '';
            currentPageMovies = '';
            moviesDiv.innerHTML = '';
            buildCarousel(body.results);
        })
    })
})



fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(answer => {
    const promiseBody = answer.json();


    promiseBody.then(body => {
        buildCarousel(body.results);
    });

    let movieCarousel = [...moviesDiv.children];
    movieCarousel.forEach(movie => {
        movie.addEventListener('click', function () {
            modalDiv.classList.remove('hidden');
            const id = movie.id;

            fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`).then(answer => {
                const promiseBody = answer.json();

                promiseBody.then(body => {
                    const genres = body.genres;

                    genres.forEach(genre => {
                        const spanGenre = document.createElement('span');
                        spanGenre.classList.add('modal__genre');
                        spanGenre.textContent = genre.name;

                        modalGenres.append(spanGenre);
                    });

                    modalTitle.textContent = body.title;
                    modalImg.src = body.backdrop_path;
                    modalDescription.textContent = body.overview;
                    modalAverage.textContent = body.vote_average.toFixed(1);
                })
            })
        })
    })
});

buttonNext.addEventListener('click', function () {
    carouselPages++;
    paginationMovies();
});


buttonPrev.addEventListener('click', function () {
    carouselPages -= 1;
});

const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlighthLaunch = document.querySelector('.highlight__launch');
const highlighthDescription = document.querySelector('.highlight__description');
const highlightVideoLink = document.querySelector('.highlight__video-link');


fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(answer => {
    const promiseBody = answer.json();

    promiseBody.then(body => {
        const genres = body.genres;
        const genresArray = [];

        genres.forEach(genre => {
            genresArray.push(genre.name);
        });

        let genresString = genresArray.join(', ');

        const data = new Date(body.release_date);

        const dateMovie = (data.getDate()) + "-" + (data.getMonth() + 1) + "-" + data.getFullYear();


        highlightVideo.style.backgroundImage = `url(${body.backdrop_path})`;
        highlightTitle.textContent = body.title;
        highlightRating.textContent = body.vote_average.toFixed(1);
        highlightGenres.textContent = genresString;
        highlighthLaunch.textContent = dateMovie;
        highlighthDescription.textContent = body.overview;

    })
});

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then(answer => {
    const promiseBody = answer.json();

    promiseBody.then(body => {
        const queryMovie = body.results[0].key;

        highlightVideoLink.href = `https://www.youtube.com/watch?v=${queryMovie}`;
    })
});


modalDiv.addEventListener('click', function () {
    modalDiv.classList.add('hidden');
    modalGenres.innerHTML = '';
    modalTitle.textContent = '';
    modalImg.src = '';
    modalDescription.textContent = '';
    modalAverage.textContent = '';
});

modalMovie.addEventListener('click', function (e) {
    e.stopPropagation();
});




const body = document.querySelector('body');
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

const highlightDescription = initialTheme === 'light' ? '#000' : '#FFF';
body.style.setProperty('--highlight-description', highlightDescription);

buttonTheme.addEventListener('click', function () {
    const theme = initialTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);

    const newBackgroundColor =
        body.style.getPropertyValue('--background-color') === '#242424' ? '#FFF' : '#242424';
    body.style.setProperty('--background-color', newBackgroundColor);

    buttonTheme.src = body.style.getPropertyValue('--background-color') === '#FFF' ? './assets/light-mode.svg' : './assets/dark-mode.svg';

    buttonNext.src = body.style.getPropertyValue('--background-color') === '#FFF' ? './assets/seta-direita-preta.svg' : './assets/seta-direita-branca.svg';

    buttonPrev.src = body.style.getPropertyValue('--background-color') === '#FFF' ? './assets/seta-esquerda-preta.svg' : './assets/seta-esquerda-branca.svg';

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

    const newHighlightDescription =
        body.style.getPropertyValue('--highlight-description') === '#FFF' ? '#000' : '#FFF';
    body.style.setProperty('--highlight-description', newHighlightDescription);
})