import axios from "axios";

export default class GalleryApiService {
	constructor() {
		this.searchQuery = '';
		this.page = 1;
		this.totalHits = '';
	}

	async fetchPhotos() {
		const API_KEY = '22756527-2e30581cfec2e7755e4985106';
		const STATIC_URL = 'https://pixabay.com/api/';
		const URL = `${STATIC_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
		const response = await axios.get(URL);
		this.page += 1;
		return response.data;
	}

	resetPage() {
		this.page = 1;
	};

	get query() {
		return this.searchQuery;
	}

	set query(newQuery) {
		this.searchQuery = newQuery;
	}
}