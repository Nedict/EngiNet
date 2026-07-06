const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const compression = require("compression");

const morgan = require("morgan");

const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");

const profileRoutes = require("./routes/profile.routes");

const app = express();

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        app: "EngiNet",
        status: "Running"
    });
});

module.exports = app;