import axios from "axios";

const cloudName = 'dhvjnlvtm'; // Your Cloudinary cloud name
const uploadPreset = 'unsigned_upload'; // The upload preset you created

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
