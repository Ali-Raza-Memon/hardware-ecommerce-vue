import axios from "axios";

const cloudName = 'dbkr2rgab'; 
const uploadPreset = 'unsigned_upload'; 

export function uploadImage(file) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  return axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

