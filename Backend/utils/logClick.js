const Analytics = require('../models/analytics.model');
const parser = require('ua-parser-js');

const logClick = async (req, userEmail, linkId) => {
    try {
        const ua = parser(req.headers['user-agent']);

        const device = ua.device.type || 'Desktop';
        const browser = ua.browser.name || 'Unknown';
        const os = ua.os.name || 'Unknown';

        const analyticsEntry = new Analytics({
            linkId,
            userEmail,
            device,
            browser,
            os,
        });

        await analyticsEntry.save();
    } catch (err) {
        console.error('Failed to log click:', err.message);
    }
};

module.exports = logClick;
