import * as Dotenv from "dotenv";
import express from 'express';
import mongoose from "mongoose";
import UserRoutes from "./users/routes.js";
import EventRoutes from "./events/routes.js";
// import ExternalApiRoutes from "./ExternalApi/externalApi_routes.js"
import cors from "cors";
import session from "express-session";
import UserEventRoutes from "./user_events/routes.js"

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING
mongoose.connect(CONNECTION_STRING, {dbName: 'HackIt'});
const app = express()
app.use(express.json());

app.use(cors({
  credentials:true,
  origin: process.env.FRONTEND_URL,
}));
const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};
app.use(
  session(sessionOptions)
);

app.use(express.json());
app.get('/', (req, res) => {res.send('HackIt server is up and running!')})


UserRoutes(app);
EventRoutes(app);
// ExternalApiRoutes(app);
UserEventRoutes(app);
app.listen(process.env.PORT || 4000);

