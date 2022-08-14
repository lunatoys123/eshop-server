const mongoose = require("mongoose");

require("dotenv").config({ path: "../.env" });
const DB_URL = process.env.DB_URL;

mongoose.connect(
  DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Category connection successfully");
  },
  (e) => console.error(e)
);

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  { collection: "Category" }
);

const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
