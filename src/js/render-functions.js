import SimpleLightBox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
loader.classList.add('is-hidden');
const btnLoadMore = document.querySelector('.btn-load-more');

const lightbox = new SimpleLightBox('.gallery-item a');

export function createGallery(images) {
  const img = images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<li class="gallery-item">
  <a class="gallery-link" href="${largeImageURL}">
    <img
      class="gallery-image"
      src="${webformatURL}"
      alt="${tags}"
    />
  </a>
  <div>
        <h2>Likes</h2>
        <p>${likes}</p>
  </div>
  <div>
        <h2>Views</h2>
        <p>${views}</p>
  </div>
  <div>
        <h2>Comments</h2>
        <p>${comments}</p>
  </div>
  <div>
        <h2>Downloads</h2>
        <p>${downloads}</p>
  </div>
</li>
`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', img);

  lightbox.refresh();
  lightbox.on('show.simplelightbox', function () {});
}
export function clearGallery() {
  gallery.innerHTML = '';
}
export function showLoader() {
  loader.classList.remove('is-hidden');
}
export function hideLoader() {
  loader.classList.add('is-hidden');
}

export function showLoadMoreButton() {
  btnLoadMore.classList.remove('is-hidden');
}
export function hideLoadMoreButton() {
  btnLoadMore.classList.add('is-hidden');
}
