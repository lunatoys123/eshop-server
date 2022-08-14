const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const ProductRouter = require("./routers/Product");
const CategoryRouter = require("./routers/Category");
const UserRouter = require("./routers/User");
const orderRouter = require("./routers/Order");
const cors = require("cors");
const authJWT = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
const path = require('path')

require("dotenv").config({ path: ".env" });
const api = process.env.APP_URL;

app.use(cors());
app.options("*", cors());

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJWT());
app.use(errorHandler);
app.use('/public/uploads',express.static(path.join(__dirname,'/public/uploads')))

app.use(`${api}/Category`, CategoryRouter);
app.use(`${api}/products`, ProductRouter);
app.use(`${api}/users`, UserRouter);
app.use(`${api}/orders`, orderRouter);

// Development
// app.listen(5000, () => {
//   console.log("listen to port 5000");
// });

var server = app.listen(process.env.PORT ||5000, function(){
  var port = server.address().port;
  console.log(`Express is working on port ${port}`)
})
