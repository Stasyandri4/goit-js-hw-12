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

form.addEventListener('submit', event => {
  event.preventDefault();
  clearGallery();
  hideLoadMoreButton();
  page = 1;
  const formData = new FormData(event.target);
  if (formData.get('search-text') === '') {
    return iziToast.warning({ message: 'Empty field!' });
  } else {
    showLoader();
    getImagesByQuery(formData.get('search-text'), page).then(({ hits }) => {
      try {
        if (hits.length === 0) {
          iziToast.show({
            message:
              'Sorry, there are no images matching your search query. Please try again!',
          });
          hideLoader();
          return;
        }
        createGallery(hits);
        showLoadMoreButton();
        search = formData.get('search-text');
        return search;
      } catch (error) {
        hideLoader();
        iziToast.show({
          message: `${error.message}`,
        });
      }
    });
  }
});

btnLoadMore.addEventListener('click', render);

async function render() {
  try {
    hideLoadMoreButton();
    page += 1;
    const { hits, totalHits } = await getImagesByQuery(search, page);
    const totalPages = Math.ceil(totalHits / perPage);
    createGallery(hits);
    scroll();
    showLoadMoreButton();
    if (page >= totalPages) {
      iziToast.info({
        message: `We're sorry, but you've reached the end of search results.`,
      });
    }
  } catch (error) {
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
