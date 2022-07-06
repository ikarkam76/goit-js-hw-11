const axios = require('axios').default;
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const searchFormInput = document.querySelector('input');
const fotoGallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', fetchFotos);

function fetchFotos(event) {
  event.preventDefault();
  searchName = searchFormInput.value.split(' ').join('+');
  axios
    .get(
      `https://pixabay.com/api/?key=28478003-fd100ae876bc055f23610276b&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true`
    )
    .then(renderFotosCards)
    .catch(error => console.log(error));
}

let gallery = new SimpleLightbox('.gallery a', {});

function renderFotosCards(response) {
  console.log(response.data.totalHits);
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
  fotoGallery.innerHTML = markup;
}
