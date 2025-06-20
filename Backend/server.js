const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");

const userRoute = require("./routes/auth.route");
const linkRoute = require("./routes/link.route");
const analyticsRoute = require("./routes/analytics.route");


connectDB();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173', // your frontend origin
    'https://link-shortener-dash-board.vercel.app'
    ],
  credentials: true, // if you're sending cookies or auth headers
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());


app.use("/auth",userRoute);
app.use("/link", linkRoute);
app.use("/analytics", analyticsRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT= process.env.PORT || 5000;

app.listen(PORT , (err) => {
    if(err) throw err;
    console.log(`Server is running on port ${PORT}`);
});


// r4X61kO7uPcWY6ix