import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const form = document.querySelector('.form');
const btnLoadMore = document.querySelector('.btn-load-more');
let page = 1;
let search = '';
const perPage = 15;

form.addEventListener('submit', async event => {
  event.preventDefault();
  clearGallery();
  hideLoadMoreButton();
  page = 1;
  const formData = new FormData(event.target);
  const query = formData.get('search-text').trim();
  if (query === '') {
    return iziToast.warning({ message: 'Empty field!' });
  }

  showLoader();
  try {
    const { hits } = await getImagesByQuery(query, page);
    if (hits.length === 0) {
      iziToast.show({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    createGallery(hits);
    showLoadMoreButton();
    search = query;
  } catch (error) {
    iziToast.show({ message: `${error.message}` });
  } finally {
    hideLoader();
  }
});

btnLoadMore.addEventListener('click', render);

async function render() {
  try {
    showLoader();
    hideLoadMoreButton();
    page += 1;
    const { hits, totalHits } = await getImagesByQuery(search, page);
    const totalPages = Math.ceil(totalHits / perPage);
    createGallery(hits);
    scroll();
    hideLoader();
    showLoadMoreButton();
    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: `We're sorry, but you've reached the end of search results.`,
      });
    }
  } catch (error) {
    hideLoader();
    iziToast.warning({ message: `${error.message}` });
  }
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
