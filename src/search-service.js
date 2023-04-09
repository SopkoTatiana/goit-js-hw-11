export default class ImgsApiService {
  constructor() {
    this.Searchquery - '';
    this.page = 1;
  }

  async fetchImg() {
    const axios = require('axios').default;

    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '35178291-396a475acbd7be5fd5986a1bd';

    try {
      const response = await axios.get(
        `${BASE_URL}/?key=${KEY}&q=${this.Searchquery}&image_type=photo$orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      );
      const imgs = await response.data;
      return imgs;
    } catch (error) {
      console.error(error.message);
    }
  }

  incremenPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.Searchquery;
  }

  set query(newQuery) {
    this.Searchquery = newQuery;
  }
}
