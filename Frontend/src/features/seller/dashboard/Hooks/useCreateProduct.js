import { useState } from 'react';
import { uploadImages, createProduct } from '../services/product.api';

export const useCreateProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const submitProduct = async (formData, sizes, color, coverImage, variantImages) => {
    setIsSubmitting(true);
    let uploadedCoverUrl = "";
    let uploadedVariantUrls = [];

    try {
      // Step 1: Upload Cover Image
      setUploadStatus("Uploading Cover Image...");
      const coverData = new FormData();
      coverData.append('images', coverImage);
      const coverRes = await uploadImages(coverData);
      uploadedCoverUrl = coverRes.urls[0];

      // Step 2: Upload Variant Images
      if (variantImages && variantImages.length > 0) {
        setUploadStatus("Uploading Variant Media...");
        const variantData = new FormData();
        variantImages.forEach(img => variantData.append('images', img));
        const variantRes = await uploadImages(variantData);
        uploadedVariantUrls = variantRes.urls;
      }

      setUploadStatus("Creating Product Document...");

      const parsedSizes = sizes
        .filter(s => Number(s.quantity) > 0)
        .map(s => ({
          size: s.size,
          quantity: Number(s.quantity)
        }));

      const payload = {
        title: formData.title,
        brand: formData.brand,
        description: formData.description,
        originalPrice: { amount: Number(formData.originalPrice), currency: "INR" },
        price: { amount: Number(formData.price), currency: "INR" },
        discountPercent: Number(formData.discountPercent) || 0,
        category: { for: formData.categoryFor, name: formData.categoryName },
        badge: formData.badge,
        coverImage: uploadedCoverUrl,
        styleCode: formData.styleCode,
        color: {
          name: color.name,
          hex: color.hex
        },
        sizes: parsedSizes,
        images: uploadedVariantUrls
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
        error: err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error creating product.' 
      };
    }
  };

  return { submitProduct, isSubmitting, uploadStatus };
};
