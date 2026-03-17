const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express e-ses API",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
      },
    ],
  },
  apis: ["./docs/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const coworkingspaces = require("./routes/coworkingspaces");
const reservations = require("./routes/reservations");
const auth = require("./routes/auth");

const app = express();

app.set("query parser", "extended");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Cookie parser
app.use(cookieParser());

// Mount routers
app.use("/api/v1/coworkingspaces", coworkingspaces);
app.use("/api/v1/reservations", reservations);
app.use("/api/v1/auth", auth);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
