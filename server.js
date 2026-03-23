const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load env vars (ควรเรียกก่อน config อย่างอื่น เพื่อความชัวร์ว่าตัวแปรสภาพแวดล้อมมาครบ)
dotenv.config({ path: "./config/config.env" });

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
        url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
      },
    ],
  },
  apis: ["./docs/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Route files
const coworkingspaces = require("./routes/coworkingspaces");
const reservations = require("./routes/reservations");
const auth = require("./routes/auth");

const app = express();

app.set("query parser", "extended");
const cors = require("cors");
app.use(
  cors()
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
let server;

// ✅ จุดที่แก้ไข: รอให้ connectDB ทำงานสำเร็จก่อน (.then) ค่อยเปิด Server
connectDB()
  .then(() => {
    server = app.listen(
      PORT,
      () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // ปิดโปรแกรมถ้าต่อ DB ไม่ติด
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});