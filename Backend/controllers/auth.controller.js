const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config")

const hardCodedUser = {
    email: "intern@dacoid.com",
    password: "test123",
}

exports.login = async (req, res) => {

    const { email, password } = req.body;

    if (email === hardCodedUser.email && password === hardCodedUser.password) {

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token",token,{
            httpOnly: true,
            secure:true,
            maxAge: 3600000, // 1 hour
        })
        return res.status(200).json({ success: true, message: "Login successful", token, email });
    }

    else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
}