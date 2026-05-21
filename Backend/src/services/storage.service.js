import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";
import { toFile } from "@imagekit/nodejs";

const client = new ImageKit({
  privateKey: config.IMAGE_KIT_PRIVATE_KEY, // This is the default and can be omitted
});

const uploadImage = async (folder = "SNITCH" , buffer , fileName) => {
  try {
    const response = await client.files.upload({
      file: await ImageKit.toFile(buffer),
      fileName: fileName,
      folder : folder
    });
    return response.url; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export { uploadImage };
