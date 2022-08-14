const ProductModel = require("../Model/Product");
const categoryModel = require("../Model/Category");

const mongoose = require("mongoose");

const getProductList = async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await ProductModel.find(filter).populate("category");

  if (!productList) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send(productList);
};

const getProductById = async (req, res) => {
  const product = await ProductModel.findById(req.params.id).populate(
    "category"
  );
  if (!product) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send(product);
};

const updateProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }

  const category = await categoryModel
    .findById(req.body.category)
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ sucess: false, error: err });
    });

  if (!category) return res.status(400).send("Invalid category");

  const product = await ProductModel.findById(req.params.id);
  if (!product) return res.status(400).send("Invalid Product");

  const file = req.file;
  let imagePath;

  if (file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
    imagePath = `${basePath}${fileName}`;
  } else {
    imagePath = product.image;
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagePath,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!updatedProduct) {
    return res.status(500).send("the product cannot be updated");
  }
  return res.status(200).send(updatedProduct);
};

const PostProduct = async (req, res) => {
  const category = await categoryModel
    .findById(req.body.category)
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ sucess: false, error: err });
    });
  if (!category) return res.status(400).send("Invalid category");

  const file = req.file;
  if (!file) return res.status(400).send("No Image in the request");

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let newProduct = new ProductModel({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  newProduct
    .save()
    .then((product) => {
      console.log("new Product save");
      return res.status(200).send(product);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        error: err,
        success: false,
      });
    });
};

const deleteProduct = (req, res) => {
  ProductModel.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: "the category is deleted",
        });
      } else {
        return res
          .status(404)
          .json({ success: "false", message: "cannot find the category" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

const getProductCount = async (req, res) => {
  const productListCount = await ProductModel.countDocuments();

  if (!productListCount) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send({ count: productListCount });
};

const getFeaturedProduct = async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const FeatureProduct = await ProductModel.find({ isFeatured: true }).limit(
    count
  );
  if (!FeatureProduct) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).send(FeatureProduct);
};

const updateGalleryImages = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }
  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    files.map((file) => {
      console.log(file)
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }
  const product = await ProductModel.findByIdAndUpdate(
    req.params.id,
    {
      images: imagesPaths,
    },
    { new: true }
  );

  if(!product){
    return res.status(500).send('the product cannot be update')
  }
  return res.status(200).send(product)
};

module.exports = {
  getProductList,
  PostProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductCount,
  getFeaturedProduct,
  updateGalleryImages,
};
