import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { fetchImages } from './js/fetch-images';
import './css/styles.css';

const KEY = '34154257-bf748b84cc835cf9e78cea2f7';
const BASE_URL = 'https://pixabay.com/api/';
let pageNumber = 1;
const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  const input = e.currentTarget.searchQuery.value.trim();
  const res = fetchImages(input);
  console.log(res);
  res.then(checkData);
}

function checkData({ hits, totalHits }) {
  if (!totalHits) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    refs.gallery.innerHTML = createGalleryMarkup(hits);
  }
}

function createGalleryMarkup(gallery) {
  return gallery
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>`
    )
    .join('');
}

function fetchImages(input) {
  const config = {
    url: BASE_URL,
    params: {
      key: KEY,
      q: input,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: pageNumber,
      per_page: 40,
    },
  };

  return axios(config).then(response => response.data);
}
