const express = require("express");
const router = express.Router();
const CategoriesController = require("../controllers/CategoriesController");

router.get("/", CategoriesController.getCategoryList);
router.post("/", CategoriesController.AddCategory);
router.delete("/:id", CategoriesController.deleteCategory);
router.get("/:id", CategoriesController.getCategoryById);
router.put("/:id", CategoriesController.updateCategory);

module.exports = router;
