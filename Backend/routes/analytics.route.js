const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const { getAnalyticsSummary } = require('../controllers/analytics.controller');

router.get("/summary", authMiddleware, getAnalyticsSummary);


module.exports = router;