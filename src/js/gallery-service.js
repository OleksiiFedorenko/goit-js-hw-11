import axios from 'axios';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

const API_KEY = '34154257-bf748b84cc835cf9e78cea2f7';
const BASE_URL = 'https://pixabay.com/api/';

export default class GalleryService {
  constructor() {
    this.searchQuery = '';
    this.pageNumber = 1;
    this.imagesCapacity = 0;
  }

  fetchImages() {
    const config = {
      url: BASE_URL,
      params: {
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.pageNumber,
        per_page: 40,
      },
    };

    return axios(config).then(({ data }) => {
      this.incrementPage();
      this.decrementCapacity();
      console.log(data);
      return data;
    });
  }

  incrementPage() {
    this.pageNumber += 1;
  }

  resetPage() {
    this.pageNumber = 1;
  }

  decrementCapacity() {
    this.imagesCapacity -= 40;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get capacity() {
    return this.imagesCapacity;
  }

  set capacity(newImagesCapacity) {
    this.imagesCapacity = newImagesCapacity;
  }
}
