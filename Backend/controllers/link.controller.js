
const { nanoid } = require('nanoid');
const LinkData = require('../models/link.model'); // Assuming you have a LinkData model for your links
const logClick = require('../utils/logClick'); // Assuming you have a function to log clicks


const createShortLink = async (req, res) => {
    try {
        const { originalUrl, customAlias, createdAt, expireAt } = req.body;
        const userId = req.user.email; // Assuming req.user contains the authenticated user's information



        const shortCode = customAlias || nanoid(6); // Generate a random short URL if custom alias is not provided

        const expiryDate = expireAt ? new Date(expireAt) : null;

        const linkData = {
            userId,
            originalUrl,
            shortUrl: shortCode,
            createdAt,
            expireAt: expiryDate,
        };
        
        if (customAlias && customAlias.trim() !== '') {
            linkData.customAlias = customAlias.trim();
        }
        
        const newLink = new LinkData(linkData);

        // Ensure that originalUrl is a valid URL
        const isValidUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(originalUrl);
        if (!isValidUrl) {
            return res.status(400).json({ message: "Invalid URL" });
        }

        const existingLink = await LinkData.findOne({ shortUrl: shortCode });
        if(existingLink){
            return res.status(400).json({ message: "Custom alias already taken" });

        } 

        await newLink.save()
        console.log("expireAt", expireAt)
        return res.json(
            {
             shortUrl: shortCode, 
             originalUrl, 
             createdAt:newLink.createdAt.toISOString().split('T')[0], 
             expireAt, userId 
            }
        );
    }
    catch (err) {
        console.error('Error creating short link:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });

    }
};

const redirectLink = async (req, res) => {
    const { shortUrl } = req.params;
    try {
        const link = await LinkData.findOne({ shortUrl });
        if (!link || (link.expireAt && link.expireAt < new Date())) {
            return res.status(404).json({ message: 'Link not found' });
        }

        link.clicks += 1; // Increment the click count
        await link.save(); // Save the updated link document

        await logClick(req, link.userId, link._id); // Log the click(store the click info in the database)

        // await LinkData.findByIdAndUpdate(link._id, { $inc: { clicks: 1 } });

        return res.redirect(link.originalUrl); // Redirect to the original URL
    }
    catch (err) {
        console.error('Error redirecting link:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//recent links
const getRecentLinks = async (req, res) => {

    const userId = req.user.email; // Assuming shortUrl is passed as a URL parameter

    try {

        const recentLinks = await LinkData.find({
            userId,
            $or:[
            {expireAt: { $gt: new Date() }},
            {expireAt:null }
        ],
        })
            .sort({ createdAt: 1 }) // Sort by expiration date in descending order
            .limit(6); // Get latest 5 links (you can adjust the number)

        console.log("getRecentLinks", recentLinks)
        res.status(200).json(recentLinks);
    } catch (error) {
        console.error('Error fetching recent links:', error);
        res.status(500).json({ message: 'Failed to fetch recent links' });
    }
};


const getUserLinks = async (req, res) => {

    const userId = req.user.email; // Assuming req.user contains the authenticated user's information

    try {
        const links = await LinkData.find({ userId });
        console.log("getUserLinks", links)
        return res.json(links);
    }
    catch (err) {
        console.error('Error fetching user links:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getClickCount = async (req, res) => {

    const linkId = req.params.linkId; // Assuming linkId is passed as a URL parameter

    try {

        const link = await LinkData.findById(linkId);
        if (!link) {
            return res.status(404).json({ message: 'Link not found' });
        }

        return res.json({ linkId, clickCount: link.clicks });
    }
    catch (err) {
        console.error('Error fetching click analytics:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteLinksById = async(req,res) => {

    let userId = req.user.email;
    let linkId = req.params.linkId;

    try{
        const deleteLink = await LinkData.findById({userId ,  _id: linkId});

        if(!deleteLink) 
            return res.status(404).json({message: "No Link found or Unauthorized"})

        await deleteLink.deleteOne({ linkId });
        res.status(200).json({ message: "Link deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while deleting link" });
    }
}

module.exports = {
    createShortLink,
    redirectLink,
    getUserLinks,
    getClickCount,
    getRecentLinks,
    deleteLinksById
};

