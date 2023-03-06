import axios from 'axios';

const KEY = '34154257-bf748b84cc835cf9e78cea2f7';
const BASE_URL = 'https://pixabay.com/api/';
let pageNumber = 1;

export function fetchImages(input) {
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

  return axios(config)
    .then(response => response.data)
    .catch(e => console.log(e));
}
