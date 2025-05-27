const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");
const userModel = require("../models/user.model")

// const hardCodedUser = {
//     email: "intern@dacoid.com",
//     password: "test123",
// }

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let existingUser = await userModel.findOne({ email })
        console.log(existingUser)
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists with this email. Please login instead" });
        }

        const newUser = new userModel({
            name,
            email,
            password
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });
        console.log("Token payload:", jwt.verify(token, JWT_SECRET));


        res.cookie("token", token, {
            httpOnly: true,
            success: true,
            maxAge: 360000 // 1 hour
        })

        return res.status(200).json({ success: true, message: "User registered succesfully", token, newUser });

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.login = async (req, res) => {

    try {

        const {email , password} = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        const isMatch = await user.verifyPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
            }
        });
    }

    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }

}