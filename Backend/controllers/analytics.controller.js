const Link = require('../models/link.model');
const Analytics = require("../models/analytics.model")

const getAnalyticsSummary = async (req, res) => {
  const userEmail = req.user.email;
  console.log("Email:",userEmail)
  const shortCode = req.params.shortCode; // Assuming shortCode is passed as a URL parameter

  try {
    // 1. Get all links of the user
    const links = await Link.find({ userId: userEmail });

    const analyticsCount = await Analytics.countDocuments({ userEmail });
    console.log("Analytics docs count:", analyticsCount);

    const totalLinks = await Link.countDocuments({ shortCode });

    // 2. Total Clicks (from Link model)
    const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

    // 1. Total Links

    // 3. Clicks Over Time (Fallback: from Link model instead of Analytics)
    const clicksOverTime = await Analytics.aggregate([
      {
        $match: { userEmail }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          clicks: { $sum: 1 },
        }
      },

      { $sort: { "_id": 1 } },

      {
        $project: {
          _id: 0,
          date: "$_id",
          clicks: 1
        },
      },

    ]);

    const formattedClicksOverTime = clicksOverTime.length > 0
      ? clicksOverTime
      : [{ date: 'No Data', clicks: 0 }
      ];


    // 4. Top Links
    const topLinks = links
      .filter(link => link.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map(link => ({
        shortUrl: link.shortUrl,
        originalUrl: link.originalUrl,
        clicks: link.clicks
      }));


    const dayClicks = {};
    for (const link of links) {
      const day = new Date(link.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
      dayClicks[day] = (dayClicks[day] || 0) + (link.clicks || 0);
    }
    const mostActiveDay = Object.entries(dayClicks).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      ["None", 0]
    );

    // 4. Device Breakdown — Assuming you store this in `link.deviceStats` or a separate Analytics collection
    // Here’s mock code if you store in Link
    const deviceCounts = await Analytics.aggregate([
      { $match: { userEmail } },
      { $group: { _id: "$device", count: { $sum: 1 } } }
    ]);

    // Map results to mobile, desktop, tablet
    const countsMap = deviceCounts.reduce((acc, cur) => {
      acc[cur._id?.toLowerCase() || "unknown"] = cur.count;
      return acc;
    }, { mobile: 0, desktop: 0, tablet: 0 });

    const totalDevices = Object.values(countsMap).reduce((a, b) => a + b, 0) || 1;

    const deviceBreakdown = {
      mobile: Math.round((countsMap.mobile / totalDevices) * 100),
      desktop: Math.round((countsMap.desktop / totalDevices) * 100),
      tablet: Math.round((countsMap.tablet / totalDevices) * 100),
    };



    // 5. Device Stats
    const deviceStats = await Analytics.aggregate([
      { $match: { userEmail } },
      { $group: { _id: "$device", count: { $sum: 1 } } }
    ]).then(data =>
      data.reduce((acc, curr) => {
        acc[curr._id || 'Unknown'] = curr.count;
        return acc;
      }, {})
    );

    // 6. Browser Stats
    const browserStats = await Analytics.aggregate([
      { $match: { userEmail } },
      { $group: { _id: "$browser", count: { $sum: 1 } } }
    ]).then(data =>
      data.reduce((acc, curr) => {
        acc[curr._id || 'Unknown'] = curr.count;
        return acc;
      }, {})
    );

    // 7. OS Stats
    const osStats = await Analytics.aggregate([
      { $match: { userEmail } },
      { $group: { _id: "$os", count: { $sum: 1 } } }
    ]).then(data =>
      data.reduce((acc, curr) => {
        acc[curr._id || 'Unknown'] = curr.count;
        return acc;
      }, {})
    );

    // Final Response
    return res.status(200).json({
      totalLinks,
      totalClicks,
      clicksOverTime: formattedClicksOverTime,
      topLinks,
      deviceStats,
      browserStats,
      osStats,
      mostActiveDay: {
        day: mostActiveDay[0],
        clicks: mostActiveDay[1]
      },
      deviceBreakdown,
    });

  } catch (err) {
    console.error("Error in getAnalyticsSummary:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAnalyticsSummary
};
