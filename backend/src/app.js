const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const routes = require("./routes");

const app = express();

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use("/api", routes);

app.get("/", (req, res) => {
    res.json({
        app: "EngiNet API",
        version: "1.0.0"
    });
});

module.exports = app;
