const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Регистрация пользователя
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: 'User with this email already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ msg: 'Error registering user' });
  }
};
