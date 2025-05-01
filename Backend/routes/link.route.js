const express = require('express');
const router = express.Router();
const { createShortLink, getUserLinks, redirectLink, getClickCount, getRecentLinks, deleteLinksById } = require('../controllers/link.controller');

const {authMiddleware} = require("../middlewares/auth.middleware");

// Route to create a short link
router.post("/create", authMiddleware, createShortLink); // Protected route
router.get("/fetchAll", authMiddleware, getUserLinks); // Protected route

router.get("/clickCount/:linkId", authMiddleware,getClickCount); // Protected route

router.get("/recent", authMiddleware, getRecentLinks); // Protected route

router.delete("/deleteLink/:linkId", authMiddleware , deleteLinksById)

//public route
router.get("/:shortUrl", redirectLink); // Assuming you have a function to handle redirection

module.exports = router;