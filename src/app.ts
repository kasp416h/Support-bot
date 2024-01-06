import dotenv from "dotenv";
import express, { Application } from "express";
import bodyParser from "body-parser";
import compression from "compression";
import { connection as mongooseConnection } from "mongoose";
import connectDB from "./config/mongoDB/dbConn";
import fs from "fs";
import path from "path";

dotenv.config();
const app: Application = express();
const PORT: string | number = process.env.PORT || 8080;

connectDB();

console.log(process.env.NODE_ENV);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

import chatRoutes from "./routes/chat.routes";
import businessInfoRoutes from "./routes/businessInfo.routes";

app.use("/chat", chatRoutes);
app.use("/business-info", businessInfoRoutes);

mongooseConnection.once("open", () => {
  console.log("Connected to MongoDB");

  const migrationFiles = fs.readdirSync(path.join(__dirname, "migrations"));
  migrationFiles.forEach((file) => {
    require(path.join(__dirname, "migrations", file));
  });
  console.log("Migrations executed");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongooseConnection.on("error", (err) => {
  console.log(err);
});
