import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImgsApiService from './search-service';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const imgsApiService = new ImgsApiService();
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
});

refs.form.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  imgsApiService.query = event.currentTarget.elements.searchQuery.value.trim();
  const loadMoreIsHidden = refs.loadMore.classList.contains('is-hidden');

  if (!loadMoreIsHidden) {
    hideLoadMoreBtn();
  }

  clearGallery();
  clearInput(event);

  if (imgsApiService.query === '') {
    return Notify.failure('Please input search query');
  }

  imgsApiService.resetPage();
  const imgs = await imgsApiService.fetchImg();
  const hasHits = imgs.hits.length > 0;
  if (!hasHits) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  appendHtml(imgs.hits);
  lightbox.refresh();
  Notify.success(`Hooray! We found ${imgs.totalHits} images `);
  showLoadMoreBtn();
}

function appendHtml(data) {
  const markup = data
    .map(
      el => `<div class="photo-card">
  <a href="${el.largeImageURL}">
      <img src="${el.largeImageURL}" alt="${el.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${el.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${el.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${el.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${el.downloads}
    </p>
  </div>
  </a>
</div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

async function onLoadMore() {
  imgsApiService.incremenPage();

  const imgs = await imgsApiService.fetchImg();
  appendHtml(imgs.hits);
  lightbox.refresh();
  smoothScrool();
  if (imgsApiService.page === Math.ceil(imgs.totalHits / 40)) {
    Notify.info("We've sorry, but you've reached the end of search result");
    hideLoadMoreBtn();
  }
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}

function clearInput(e) {
  e.currentTarget.elements.searchQuery.value = '';
}

function showLoadMoreBtn() {
  refs.loadMore.classList.remove('is-hidden');
}
function hideLoadMoreBtn() {
  refs.loadMore.classList.add('is-hidden');
}

function smoothScrool() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2 - 20,
    behavior: 'smooth',
  });
}
