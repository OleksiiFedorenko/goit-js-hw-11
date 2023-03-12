import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import GalleryService from './js/gallery-service';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  // loadMoreBtn: document.querySelector('.load-more'),
};
const observerOptions = {
  rootMargin: '100px 0px 0px 0px',
};
const galleryService = new GalleryService();
const lightbox = new SimpleLightbox('.gallery a');
const infiniteObserver = new IntersectionObserver(onObserve, observerOptions);

refs.searchForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  const input = e.currentTarget.searchQuery.value.trim();
  if (!input) return Notify.info("Please type what you're looking for.");

  // refs.loadMoreBtn.classList.add('is-hidden');
  galleryService.query = input;
  galleryService.resetPage();

  try {
    const fetchedImages = await galleryService.fetchImages();
    scrollToTheTop();
    drawInitMarkup(fetchedImages);
    addObserver();
  } catch (error) {
    console.log(error);
  }
}

function onObserve([entry], observer) {
  if (!entry.isIntersecting) return;
  observer.unobserve(entry.target);
  loadMorePhotos();
}

async function loadMorePhotos() {
  if (galleryService.capacity <= 0) {
    // refs.loadMoreBtn.classList.add('is-hidden');
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }

  try {
    const fetchedImages = await galleryService.fetchImages();
    drawAddMarkup(fetchedImages);
    //smoothScroll()
    addObserver();
  } catch (error) {
    console.log(error);
  }
}

function drawInitMarkup({ hits, totalHits }) {
  if (!totalHits) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    galleryService.capacity = totalHits - 40;
    refs.gallery.innerHTML = createGalleryMarkup(hits);
    lightbox.refresh();
    Notify.success(`Hooray! We found ${totalHits} images.`);
    // refs.loadMoreBtn.classList.remove('is-hidden');
    // refs.loadMoreBtn.addEventListener('click', loadMorePhotos);
  }
}

function drawAddMarkup({ hits }) {
  refs.gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
  lightbox.refresh();
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
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
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

function addObserver() {
  const lastPhotoCard = document.querySelector('.photo-card:last-child');
  infiniteObserver.observe(lastPhotoCard);
}

function scrollToTheTop() {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  });
}

function smoothScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
