const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductControllers");

const multer = require("multer");

const FileTypeMap = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FileTypeMap[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "../public/uploads");
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.replace(" ", "-");
    const extension = FileTypeMap[file.mimetype];
    cb(null, `${filename}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, ProductController.getProductList);
router.post(`/`, uploadOptions.single("image"), ProductController.PostProduct);
router.get("/:id", ProductController.getProductById);
router.put(
  "/:id",
  uploadOptions.single("image"),
  ProductController.updateProduct
);
router.delete("/:id", ProductController.deleteProduct);
router.get("/get/count", ProductController.getProductCount);
router.get("/get/featured/:count", ProductController.getFeaturedProduct);
router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  ProductController.updateGalleryImages
);

module.exports = router;
