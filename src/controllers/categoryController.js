import CategoryService from '../services/categoryService';

export default {
  methods: {
    fetchCategories() {
      CategoryService.getAllCategories()
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error("There was an error fetching the categories!", error);
        });
    }
  }
};
