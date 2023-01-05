import * as express from "express";
import * as functions from "firebase-functions";
import users from "./controllers/userController";
import collections from "./controllers/collectionController";
import cards from "./controllers/cardController";

const app = express();
app.use(express.json());

app.use("/users", users);
app.use("/collections", collections);
app.use("/cards", cards);

exports.api = functions.https.onRequest(app);
