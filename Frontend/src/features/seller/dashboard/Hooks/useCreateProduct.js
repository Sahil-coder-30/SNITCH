import { useState } from 'react';
import { uploadImages, createProduct } from '../services/product.api';

export const useCreateProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const submitProduct = async (formData, sizes, colors, coverImage) => {
    setIsSubmitting(true);
    let uploadedCoverUrl = "";

    try {
      // Step 1: Upload Cover Image
      setUploadStatus("Uploading Cover Architecture...");
      const coverData = new FormData();
      coverData.append('images', coverImage);
      const coverRes = await uploadImages(coverData);
      uploadedCoverUrl = coverRes.urls[0];

      // Step 2: Upload Variant Images
      const finalColors = [...colors];
      for (let j = 0; j < finalColors.length; j++) {
        const colorState = finalColors[j];
        const filesToUpload = colorState.files ? colorState.files.slice(0, 7) : [];
        if (filesToUpload.length > 0) {
          setUploadStatus(`Synthing Media for ${colorState.name} (${j + 1}/${finalColors.length})`);
          const colorForm = new FormData();
          filesToUpload.forEach(file => colorForm.append('images', file));
          const colorRes = await uploadImages(colorForm);
          finalColors[j].images = colorRes.urls;
        } else {
          finalColors[j].images = [];
        }
      }

      setUploadStatus("Configuring Storefront Topology...");

      const compiledStock = sizes
        .filter(s => s.quantity > 0)
        .map(sizeItem => ({
          size: sizeItem.size,
          quantity: Number(sizeItem.quantity),
          colors: finalColors.map(c => ({ name: c.name, hex: c.hex, images: c.images || [] }))
        }));

      const payload = {
        title: formData.title,
        brand: formData.brand,
        description: formData.description,
        originalPrice: { amount: Number(formData.originalPrice), currency: "INR" },
        price: { amount: Number(formData.price), currency: "INR" },
        discountPercent: formData.discountPercent || 0,
        category: { for: formData.categoryFor, name: formData.categoryName },
        badge: formData.badge,
        coverImage: uploadedCoverUrl,
        stock: compiledStock
      };

      const result = await createProduct(payload);
      setUploadStatus('');
      setIsSubmitting(false);
      return { success: true, data: result };
    } catch (err) {
      console.error(err);
      setUploadStatus('');
      setIsSubmitting(false);
      return { 
        success: false, 
        error: err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error configuring product details' 
      };
    }
  };

  return { submitProduct, isSubmitting, uploadStatus };
};
