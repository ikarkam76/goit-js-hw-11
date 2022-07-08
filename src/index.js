const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const searchFormInput = document.querySelector('input');
const fotoGallery = document.querySelector('.gallery');
let page = 0;
let gallery = new SimpleLightbox('.gallery a', {});
const API_URL = 'https://pixabay.com/api/';
const API_KEY = '28478003-fd100ae876bc055f23610276b';

  
searchForm.addEventListener('submit', onSubmitForm);


 
function onSubmitForm(event) {
  event.preventDefault();
  page = 1;
  fotoGallery.innerHTML = '';
  fetchFotos();
}

async function fetchFotos() {
  const searchName = searchFormInput.value.split(' ').join('+');
  try {
    const response = await axios.get(
      `${API_URL}?key=${API_KEY}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    return renderFotosCards(response);
  } catch (error) {
    console.log(error.message);
  }
}

function renderFotosCards(response) {
  if (!response.data.totalHits) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    if (response.data.totalHits / 40 <= page ) {
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
                                <b>Likes</b><br> <i>${foto.likes}</i>
                                </p>
                                <p class="info-item">
                                <b>Views</b><br> <i>${foto.views}</i>
                                </p>
                                <p class="info-item">
                                <b>Comments</b><br> <i>${foto.comments}</i>
                                </p>
                                <p class="info-item">
                                <b>Downloads</b><br> <i>${foto.downloads}</i>
                                </p>
                            </div>
                    </a>
                </div>`;
      }).join(' ');
    page += 1;
    fotoGallery.insertAdjacentHTML('beforeend', markup);
   gallery.refresh();
  }
}

window.addEventListener('scroll', () => {
  const documentRect = fotoGallery.getBoundingClientRect();
  if (
    documentRect.top * -1 > fotoGallery.clientHeight - window.visualViewport.height - 2
  ) {
    fetchFotos();
  }
});

