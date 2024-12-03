const mongoose = require("mongoose");

const signupUser = async (req, res) => {

    const userData = req.body;

    const existingUser = await User.find();

}