import * as functions from "firebase-functions";
import * as express from "express";
import { db } from "./firebaseSetup";
import User from "./models/userModel";
import Collection from "./models/collectionModel";
import Card from "./models/cardModel";

const app = express();
app.use(express.json());

app.post("/create-user", (req, res) => {
  const newUser = new User(
    req.body.uuid,
    req.body.displayName,
    req.body.handle,
    req.body.email
  );

  const entry = newUser.forDatabase();

  db.collection("users")
    .add(entry)
    .then((doc) => {
      res.json({ message: "doc createed succesfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "something wrong" });
    });
});

app.post("/create-collection", (req, res) => {
  const newCollection = new Collection(
    req.body.name,
    req.body.userID,
    req.body.description
  );

  try {
    newCollection.checkCollection();
  } catch (error) {
    res.json(error);
    return;
  }

  const entry = newCollection.forDatabase();

  db.collection("collections")
    .add(entry)
    .then((doc) => {
      res.json({ message: "doc createed succesfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "something wrong." });
    });
});

app.post("/create-card", (req, res) => {
  const newCard = new Card(
    req.body.name,
    req.body.content,
    req.body.collectionID
  );

  try {
    newCard.checkCard();
  } catch (error) {
    res.json(error);
    return;
  }

  const entry = newCard.forDatabase();

  db.collection("cards")
    .add(entry)
    .then((doc) => {
      doc.update({ cardID: doc.id }).catch((err) => {
        res.json({ error: "unable to add id to card" });
        return;
      });

      res.json({ message: "doc createed succesfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "something wrong." });
    });
});

type responseContent = {
  objects: Array<{}>;
};

app.get("/get-collections", (req, res) => {
  let retrieved: responseContent = { objects: [] };

  const query = db
    .collection("collections")
    .where("userID", "==", req.body.userID);

  query
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        retrieved.objects.push(doc.data());
      });
      res.json(retrieved);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/get-cards", (req, res) => {
  let retrieved: responseContent = { objects: [] };

  const query = db
    .collection("cards")
    .where("collectionID", "==", req.body.collectionID);

  query
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        retrieved.objects.push(doc.data());
      });
      res.json(retrieved);
    })
    .catch((err) => {
      res.json(err);
    });
});

exports.api = functions.https.onRequest(app);
