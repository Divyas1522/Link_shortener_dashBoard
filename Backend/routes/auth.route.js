const Router = require('express');
const { login, registerUser } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const router = Router();

router.post("/register", registerUser);
router.post('/login', login);

router.get('/verify', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;