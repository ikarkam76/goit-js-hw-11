const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const searchFormInput = document.querySelector('input');
const fotoGallery = document.querySelector('.gallery');
// const loadMoreButton = document.querySelector('.load-more');
let page = 1;
let gallery = new SimpleLightbox('.gallery a', {});
  
searchForm.addEventListener('submit', onSubmitForm);
// loadMoreButton.addEventListener('click', fetchFotos);


 
function onSubmitForm(event) {
  event.preventDefault();
  page = 1;
  fotoGallery.innerHTML = '';
  fetchFotos(event);
}

function fetchFotos() {
  const searchName = searchFormInput.value.split(' ').join('+');
  axios.get(
      `https://pixabay.com/api/?key=28478003-fd100ae876bc055f23610276b&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    )
    .then(response => {
      renderFotosCards(response);
    })
    .catch(error => console.log(error));
}

function renderFotosCards(response) {
  console.log(response.data.totalHits);
  if (!response.data.totalHits) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    if (response.data.totalHits / 40 <= page - 1) {
      return Notify.success(
        `We're sorry, but you've reached the end of search results.`
      );
    }
    if (page <= 1) {
      Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    }
    const fotos = response.data.hits;
    const markup = fotos
      .map(foto => {
        return `<div class="photo-card">
                    <a class="gallery__link" href="${foto.largeImageURL}">
                        <img src="${foto.webformatURL}" alt="${foto.tags}" loading="lazy"/>
                            <div class="info">
                                <p class="info-item">
                                <b>Likes</b> ${foto.likes}
                                </p>
                                <p class="info-item">
                                <b>Views</b> ${foto.views}
                                </p>
                                <p class="info-item">
                                <b>Comments</b> ${foto.comments}
                                </p>
                                <p class="info-item">
                                <b>Downloads</b> ${foto.downloads}
                                </p>
                            </div>
                    </a>
                </div>`;
      })
      .join(' ');
    page += 1;
    fotoGallery.insertAdjacentHTML('beforeend', markup);
    if (page >= 2) {
      const { height: cardHeight } =
        fotoGallery.firstElementChild.getBoundingClientRect();
        window.scrollBy({
          top: cardHeight * 3,
          behavior: 'smooth',
        });
    }
   gallery.refresh();
  }
}

window.addEventListener('scroll', () => {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 150) {
    fetchFotos();
  }
});

