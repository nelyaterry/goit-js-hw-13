import './css/common.css';
import '../node_modules/simplelightbox/src/simple-lightbox.scss';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import GalleryApiService from './js/gallery-api-service.js';
import photoCard from './templates/photoCard';

const refs = {
	form: document.querySelector('.search-form'),
	gallery: document.querySelector('.gallery'),
	loadMoreBtn: document.querySelector('.load-more'),
}

var lightbox = new SimpleLightbox('.gallery a');

const galleryApiService = new GalleryApiService();

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoad);

refs.loadMoreBtn.classList.add('is-hidden');

async function onSearch(event) {
	event.preventDefault();

	galleryApiService.query = event.currentTarget.elements.searchQuery.value.trim('');

	await galleryApiService.fetchPhotos()
		.then(response => {
			if (response.hits.length === 0 || galleryApiService.query === '') {
				cleanGallery();
				refs.loadMoreBtn.classList.add('is-hidden');
				Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
			}
			else if (response.hits.length !== 0) {
				cleanGallery();
				Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);

				addPhotoCard(response.hits);

				lightbox.refresh();
				refs.loadMoreBtn.classList.remove('is-hidden');
			}
		})
		
	 .catch (error => console.log(error));
}

// async function onSearch(event) {
// 	event.preventDefault();

// 	galleryApiService.query = event.currentTarget.elements.searchQuery.value.trim('');

// 	try {
// 		const response = await galleryApiService.fetchPhotos();
// 		if (response.hits.length === 0 || galleryApiService.query === '') {
// 			cleanGallery();
// 			refs.loadMoreBtn.classList.add('is-hidden');
// 			Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
// 		}
// 		else if (response.hits.length !== 0) {
// 			cleanGallery();
// 			Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);

//       addPhotoCard(response.hits);

// 			lightbox.refresh();
// 			refs.loadMoreBtn.classList.remove('is-hidden');
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

async function onLoad() {
	
	await galleryApiService.fetchPhotos()
		.then(response => {
			addPhotoCard(response.hits);
			const hitsLength = refs.gallery.querySelectorAll('.photo-card').length;

			if (hitsLength >= response.totalHits) {
				Notiflix.Notify.failure("We are sorry, but you have reached the end of search results.");
				refs.loadMoreBtn.classList.add('is-hidden');
			} else {
				lightbox.refresh();
			}
		})
		.catch(error => console.log(error));
}


function addPhotoCard(data){
	refs.gallery.insertAdjacentHTML('beforeend', photoCard(data));
};

function cleanGallery () {
    refs.gallery.innerHTML = '';
}