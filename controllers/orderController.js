const orderModel = require("../Model/Order");
const orderItemModel = require("../Model/order-items");

const getOrderList = async (req, res) => {
  const orderList = await orderModel
    .find()
    .populate("orderItems")
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    return res.status(500).json({ sucess: false });
  }

  return res.status(200).send(orderList);
};

const getOrderById = async (req, res) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!order) {
    return res.status(500).json({ sucess: false });
  }

  return res.status(200).send(order);
};

const AddOrder = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new orderItemModel({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemIdsResolve = await orderItemsIds;
  const totalPrices = await Promise.all(
    orderItemIdsResolve.map(async (orderItemId) => {
      const orderItem = await orderItemModel
        .findById(orderItemId)
        .populate("product", "price");
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let newOrder = new orderModel({
    orderItems: orderItemIdsResolve,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  newOrder = await newOrder.save();
  if (!newOrder) {
    return res.status(404).send("the order cannot be created");
  }

  return res.status(200).send(newOrder);
};

const updateOrder = async (req, res) => {
  const order = await orderModel.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) {
    return res.status(400).send("the order cannot be updated");
  }
  return res.status(200).send(order);
};
``;

const deleteOrder = (req, res) => {
  orderModel
    .findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await orderItemModel.findByIdAndRemove(orderItem);
        });
        return res.status(200).json({
          success: true,
          message: "the Order is deleted",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "cannot find the order" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

const totalSales = async (req, res) => {
  const totalSales = await orderModel.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  return res.status(200).send({ totalSales: totalSales.pop().totalSales });
};

const CountOrder = async (req, res) => {
  const orderCount = await orderModel.countDocuments();
  if (!orderCount) {
    return res.status(500).send({ success: false });
  }

  return res.status(200).send({ orderCount: orderCount });
};

const getUserOrder = async (req, res) => {
  const orderList = await orderModel
    .find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send(orderList);
};

module.exports = {
  getOrderList,
  AddOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  totalSales,
  CountOrder,
  getUserOrder
};
