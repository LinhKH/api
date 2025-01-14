
import { v2 as cloudinary } from "cloudinary";

const removeImgCloundinary = async (images) => {
  let arrImages = [];
  const deleteImagePromises = images.map((image) => {
    const [public_id] = image.split("/").slice(-1)[0].split(".");
    arrImages.push(`mern-estate/${public_id}`);
  });
  if (arrImages.length > 0) {
    cloudinary.api.delete_resources(arrImages);
    await Promise.all(deleteImagePromises);
  }
};

export default removeImgCloundinary;