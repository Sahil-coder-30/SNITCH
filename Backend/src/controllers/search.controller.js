import ProductModel from "../models/product.model.js";

/**
 * Controller to handle advanced e-commerce searches and filters
 * GET /api/products/search
 */
export const searchProductsController = async (req, res, next) => {
  try {
    const {
      q = "",
      categories,
      brands,
      sizes,
      colors,
      minPrice,
      maxPrice,
      minDiscount,
      inStock,
      minRating,
      sort = "relevance"
    } = req.query;

    // 1. Build the base query for searching the keyword
    const searchRegex = new RegExp(q.trim(), "i");
    const baseQuery = {
      $or: [
        { title: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
        { "category.name": searchRegex },
        { "category.for": searchRegex }
      ]
    };

    // 2. Generate DYNAMIC filter choices (facets) available for this search keyword
    // This allows the frontend to show only the categories, brands, etc. that exist in the results
    const filterAggregation = await ProductModel.aggregate([
      { $match: baseQuery },
      {
        $facet: {
          brands: [
            { $group: { _id: "$brand", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          categories: [
            { $group: { _id: "$category.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          priceBounds: [
            {
              $group: {
                _id: null,
                minPrice: { $min: "$price.amount" },
                maxPrice: { $max: "$price.amount" }
              }
            }
          ],
          sizes: [
            { $unwind: "$sizes" },
            { $group: { _id: "$sizes.size", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ],
          colors: [
            {
              $group: {
                _id: { name: "$color.name", hex: "$color.hex" },
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } }
          ]
        }
      }
    ]);

    const facets = filterAggregation[0] || {};
    const priceBounds = facets.priceBounds?.[0] || { minPrice: 0, maxPrice: 10000 };

    const availableFilters = {
      brands: (facets.brands || []).map(b => ({ name: b._id, count: b.count })),
      categories: (facets.categories || []).map(c => ({ name: c._id, count: c.count })),
      sizes: (facets.sizes || []).map(s => ({ name: s._id, count: s.count })),
      colors: (facets.colors || []).map(c => ({
        name: c._id.name,
        hex: c._id.hex,
        count: c.count
      })),
      priceRange: {
        min: priceBounds.minPrice || 0,
        max: priceBounds.maxPrice || 10000
      }
    };

    // 3. Build the final query applying selected filters
    const finalQuery = { ...baseQuery };

    if (categories) {
      finalQuery["category.name"] = { $in: categories.split(",") };
    }

    if (brands) {
      finalQuery["brand"] = { $in: brands.split(",") };
    }

    if (sizes) {
      finalQuery["sizes.size"] = { $in: sizes.split(",") };
    }

    if (colors) {
      finalQuery["color.name"] = { $in: colors.split(",") };
    }

    if (minPrice || maxPrice) {
      finalQuery["price.amount"] = {};
      if (minPrice) finalQuery["price.amount"].$gte = Number(minPrice);
      if (maxPrice) finalQuery["price.amount"].$lte = Number(maxPrice);
    }

    if (minDiscount) {
      finalQuery["discountPercent"] = { $gte: Number(minDiscount) };
    }

    if (inStock === "true") {
      finalQuery["sizes"] = { $elemMatch: { quantity: { $gt: 0 } } };
    }

    if (minRating) {
      finalQuery["rating"] = { $gte: Number(minRating) };
    }

    // 4. Query matching products
    let productsQuery = ProductModel.find(finalQuery);

    // Sorting
    if (sort === "price-asc") {
      productsQuery = productsQuery.sort({ "price.amount": 1 });
    } else if (sort === "price-desc") {
      productsQuery = productsQuery.sort({ "price.amount": -1 });
    } else if (sort === "rating") {
      productsQuery = productsQuery.sort({ rating: -1 });
    } else if (sort === "newest") {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const products = await productsQuery;

    // 5. Query SIMILAR products
    // We base similarity on categories of matching products
    const matchedIds = products.map(p => p._id);
    const matchedCategories = [...new Set(products.map(p => p.category?.name))].filter(Boolean);

    let similarProducts = [];
    if (matchedCategories.length > 0) {
      similarProducts = await ProductModel.find({
        _id: { $nin: matchedIds },
        "category.name": { $in: matchedCategories }
      }).limit(6);
    }

    if (similarProducts.length === 0) {
      similarProducts = await ProductModel.find({
        _id: { $nin: matchedIds }
      })
        .sort({ rating: -1 })
        .limit(6);
    }

    // Fetch sibling color variations of same styleCode for all products in this view
    const allProductsForSiblings = [...products, ...similarProducts];
    const styleCodes = allProductsForSiblings.map(p => p.styleCode).filter(Boolean);
    const siblings = styleCodes.length > 0 
        ? await ProductModel.find({ styleCode: { $in: styleCodes } }, 'styleCode color')
        : [];
        
    const styleColorMap = {};
    siblings.forEach(sib => {
        if (!sib.styleCode || !sib.color) return;
        if (!styleColorMap[sib.styleCode]) {
            styleColorMap[sib.styleCode] = [];
        }
        const exists = styleColorMap[sib.styleCode].some(c => c.hex === sib.color.hex);
        if (!exists) {
            styleColorMap[sib.styleCode].push({
                name: sib.color.name,
                hex: sib.color.hex,
                id: sib._id
            });
        }
    });

    // Helper function to map database structure to storefront layout
    const mapProduct = (product) => {
      const isSale = product.discountPercent > 0;
      const colorsList = [];
      const colorNamesList = [];

      // Add this product's own color first
      if (product.color && product.color.hex) {
        colorsList.push(product.color.hex);
        colorNamesList.push(product.color.name || 'Color');
      }

      // Add other sibling colors
      const siblingsList = styleColorMap[product.styleCode] || [];
      siblingsList.forEach(sib => {
        if (sib.hex && !colorsList.includes(sib.hex)) {
          colorsList.push(sib.hex);
          colorNamesList.push(sib.name || 'Color');
        }
      });

      return {
        id: product._id,
        styleCode: product.styleCode,
        name: product.title,
        brand: product.brand,
        price: product.price ? product.price.amount : 0,
        originalPrice: product.originalPrice ? product.originalPrice.amount : (product.price ? product.price.amount : 0),
        discount: product.discountPercent || 0,
        category: product.category ? product.category.name : '',
        rating: product.rating || 4.5,
        reviewCount: product.reviewCount || 0,
        image: product.coverImage,
        badge: product.badge,
        badgeType: product.badge === 'new-arrival' ? 'new' : (isSale ? 'sale' : 'new'),
        inStock: product.sizes ? product.sizes.some(s => s.quantity > 0) : false,
        colors: colorsList,
        colorNames: colorNamesList,
        deliveryDays: 3
      };
    };

    const mappedProducts = products.map(mapProduct);
    const mappedSimilarProducts = similarProducts.map(mapProduct);

    // 6. Return payload
    res.status(200).json({
      products: mappedProducts,
      similarProducts: mappedSimilarProducts,
      availableFilters
    });

  } catch (error) {
    next(error);
  }
};
