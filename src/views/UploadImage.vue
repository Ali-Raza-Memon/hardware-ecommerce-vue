<template>
  <div class="upload-container">
    <h2>Upload Image</h2>
    <input type="file" @change="handleImageUpload" />
    <div v-if="imageUrl">
      <p>Uploaded Image URL:</p>
      <a :href="imageUrl" target="_blank">{{ imageUrl }}</a>
      <div>
        <img :src="imageUrl" alt="Uploaded Image" width="200" />
      </div>
    </div>
  </div>
</template>

<script>
import { uploadImage } from "@/services/cloudinary";

export default {
  data() {
    return {
      imageUrl: null,
    };
  },
  methods: {
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          const response = await uploadImage(file);
          this.imageUrl = response.data.secure_url;
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.upload-container {
  margin: 20px;
  text-align: center;
}
</style>
