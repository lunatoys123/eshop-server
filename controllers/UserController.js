const UserModel = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "../.env" });

const AddUser = async (req, res) => {
  let newUser = new UserModel({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    street: req.body.street,
    city: req.body.city,
    country: req.body.country,
  });

  newUser = await newUser.save();
  if (!newUser) {
    return res.status(404).send("user cannot be created");
  }

  return res.status(200).send(newUser);
};

const getUserList = async (req, res) => {
  const UserList = await UserModel.find({}, { passwordHash: 0 });

  if (!UserList) {
    return res.status(500).json({ sucess: false });
  }
  return res.status(200).send(UserList);
};

const geUserById = async (req, res) => {
  const User = await UserModel.findById(req.params.id, { passwordHash: 0 });
  if (!User) {
    return res.status(500).json({ sucess: false });
  }

  return res.status(200).send(User);
};

const Login = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const secret = process.env.secret;
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).send({ user: user.email, token: token });
  } else {
    return res.status(400).send("wrong password");
  }
};

const getUserCount = async (req, res) => {
  const userCount = await UserModel.countDocuments();

  if (!userCount) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).send({ count: userCount });
};

const deleteUser = (req, res) => {
  UserModel.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          success: true,
          message: "the user is deleted",
        });
      } else {
        return res
          .status(404)
          .json({ success: "false", message: "cannot find the user" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

module.exports = {
  AddUser,
  getUserList,
  geUserById,
  Login,
  getUserCount,
  deleteUser,
};
