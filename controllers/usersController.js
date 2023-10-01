const { User } = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const users = await User.find();
    const usernameCheck = users.some((user) => user.username === username)
      ? true
      : false;
    if (usernameCheck) {
      return res.json({
        message: "Username already registered.",
        status: false,
      });
    }
    const emailCheck = users.some((user) => user.email === email)
      ? true
      : false;
    if (emailCheck) {
      return res.json({ message: "Email already registered.", status: false });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = { ...req.body, password: hashedPassword };
    const user = new User(newUser);

    user
      .save()
      .then((user) => {
        delete user.password;
        res.json({ status: true, user });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.json(error);
      });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const users = await User.find();
    const user = users.find((user) => user.username === username);
    if (!user) {
      res.json({
        message: "Incorrect Username or Password",
        status: false,
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      delete user.password;
      res.json({
        user,
        status: true,
      });
    } else {
      res.json({
        message: "Incorrect Username or Password",
        status: false,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (err) {
    next(err);
  }
};
