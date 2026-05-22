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

const uploadImageWithDetails = async (folder = "SNITCH" , buffer , fileName) => {
  try {
    const response = await client.files.upload({
      file: await ImageKit.toFile(buffer),
      fileName: fileName,
      folder : folder
    });
    return {
      url: response.url,
      fileId: response.fileId
    };
  } catch (error) {
    console.error("Error uploading image with details:", error);
    throw new Error("Failed to upload image");
  }
};

const listImages = async (folder = "SNITCH-BANNERS") => {
  try {
    const files = await client.files.list({
      path: folder
    });
    return files;
  } catch (error) {
    console.error("Error listing files from ImageKit:", error);
    throw new Error("Failed to list files from ImageKit");
  }
};

const deleteImage = async (fileId) => {
  try {
    await client.files.delete(fileId);
    return true;
  } catch (error) {
    console.error("Error deleting file from ImageKit:", error);
    throw new Error("Failed to delete file from ImageKit");
  }
};

export { uploadImage, uploadImageWithDetails, listImages, deleteImage };
