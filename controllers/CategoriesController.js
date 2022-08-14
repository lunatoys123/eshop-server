const categoryModel = require("../Model/Category");

const getCategoryList = async (req, res) => {
  const categoryList = await categoryModel.find({});

  if (!categoryList) {
    res.status(500).json({ sucess: false });
  }
  res.status(200).send(categoryList);
};

const getCategoryById = async (req, res) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    res.status(500).json({ sucess: false });
  }

  res.status(200).send(category);
};

const AddCategory = async (req, res) => {
  let newCategory = new categoryModel({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  newCategory = await newCategory.save();
  if (!newCategory) {
    return res.status(404).send("the category cannot be created");
  }

  return res.status(200).send(newCategory);
};

const updateCategory = async (req, res) => {
  const category = await categoryModel.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  },
  {new: true});

  if (!category) {
    return res.status(400).send("the category cannot be updated");
  }
  return res.status(200).send(category);
};

const deleteCategory = (req, res) => {
    categoryModel.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: "the category is deleted",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "cannot find the category" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

module.exports = {
  getCategoryList,
  AddCategory,
  deleteCategory,
  getCategoryById,
  updateCategory
};
