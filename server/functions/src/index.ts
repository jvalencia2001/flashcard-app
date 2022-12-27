import * as functions from "firebase-functions";
import * as express from "express";
import { db } from "./firebaseSetup";
import User from "./models/userModel";
import Collection from "./models/collectionModel";
import Card from "./models/cardModel";

const app = express();
app.use(express.json());

app.post("/newUser", (req, res) => {
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
      res.status(200).json({ message: "User created succesfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't create the user" });
    });
});

app.post("/newCollection", (req, res) => {
  const newCollection = new Collection(
    req.body.name,
    req.body.userID,
    req.body.description
  );

  try {
    newCollection.checkCollection();
  } catch (error) {
    res.status(500).json(error);
    return;
  }

  const entry = newCollection.forDatabase();

  db.collection("collections")
    .add(entry)
    .then((doc) => {
      doc.update({ collectionID: doc.id }).catch((err) => {
        res.status(500).json({ error: "Couldn't add id to collection" });
      });
      res.status(500).json({ message: "Collection created succesfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't create the collection" });
    });
});

app.post("/newCard", (req, res) => {
  const newCard = new Card(
    req.body.name,
    req.body.content,
    req.body.collectionID
  );

  try {
    newCard.checkCard();
  } catch (error) {
    res.status(500).json(error);
    return;
  }

  const entry = newCard.forDatabase();

  db.collection("cards")
    .add(entry)
    .then((doc) => {
      doc.update({ cardID: doc.id }).catch((err) => {
        res.status(500).json({ error: "Couldn't add id to card" });
        return;
      });

      res.status(200).json({ message: "Card created succesfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't create the card" });
    });
});

type responseContent = {
  objects: Array<{}>;
};

app.get("/users/:userID", (req, res) => {
  let response: responseContent = { objects: [] };

  const query = db.collection("users").where("id", "==", req.params.userID);

  query
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        response.objects.push(doc.data());
      });
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't query the database." });
    });
});

app.get("/users/:userID/collections", (req, res) => {
  let response: responseContent = { objects: [] };

  const query = db
    .collection("collections")
    .where("userID", "==", req.params.userID);

  query
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        response.objects.push(doc.data());
      });
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't query the database." });
    });
});

app.get("/collections/:collectionID", (req, res) => {
  let response: responseContent = { objects: [] };

  const query = db
    .collection("collections")
    .where("collectionID", "==", req.params.collectionID);

  query
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        response.objects.push(doc.data());
      });
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't query the database." });
    });
});

app.get("/collections/:collectionID/cards", (req, res) => {
  let response: responseContent = { objects: [] };

  const query = db
    .collection("cards")
    .where("collectionID", "==", req.params.collectionID);

  query
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        response.objects.push(doc.data());
      });
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't query the database." });
    });
});

app.get("/cards/:cardID", (req, res) => {
  let response: responseContent = { objects: [] };

  const query = db.collection("cards").where("cardID", "==", req.params.cardID);

  query
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        response.objects.push(doc.data());
      });
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't query the database." });
    });
});

app.put("/users/:userID", (req, res) => {
  let response: responseContent = { objects: [] };

  const query = db.collection("users").where("id", "==", req.params.userID);

  query
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty)
        res.status(500).json({ error: "Couldn't find the user." });
      querySnapshot.docs.forEach((doc) => {
        const docRef = doc.ref;
        docRef
          .update({
            displayName: req.body.newDisplayName
              ? req.body.newDisplayName
              : doc.get("displayName"),
            email: req.body.newDesc ? req.body.newDesc : doc.get("email"),
            handle: req.body.newHandle ? req.body.newHandle : doc.get("handle"),
          })
          .catch((err) => {
            res.status(500).json({ error: "Couldn't find user." });
          });
        response.objects.push({
          updatedUserID: req.params.userID,
          newDisplayName: req.body.newDisplayName
            ? req.body.newDisplayName
            : doc.get("displayName"),
          newEmail: req.body.newDesc ? req.body.newDesc : doc.get("email"),
          newHandle: req.body.newHandle
            ? req.body.newHandle
            : doc.get("handle"),
        });
        res.status(200).json(response);
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't query the database." });
    });
});

app.put("/collections/:collectionID", (req, res) => {
  let response: responseContent = { objects: [] };

  const query = db
    .collection("collections")
    .where("collectionID", "==", req.params.collectionID);

  query
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty)
        res.status(500).json({ error: "Couldn't find the collection." });
      querySnapshot.docs.forEach((doc) => {
        const docRef = doc.ref;
        docRef.update({
          name: req.body.newName ? req.body.newName : doc.get("name"),
          desc: req.body.newDesc ? req.body.newDesc : doc.get("desc"),
        });
        response.objects.push({
          updatedCollectionID: req.params.collectionID,
          newName: req.body.newName ? req.body.newName : doc.get("name"),
          newDesc: req.body.newDesc ? req.body.newDesc : doc.get("desc"),
        });
        res.status(200).json(response);
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't query the database." });
    });
});

app.put("/cards/:cardID", (req, res) => {
  let response: responseContent = { objects: [] };

  const query = db.collection("cards").where("cardID", "==", req.params.cardID);

  query
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty)
        res.status(500).json({ error: "Couldn't find the card." });
      querySnapshot.docs.forEach((doc) => {
        const docRef = doc.ref;
        docRef.update({
          name: req.body.newName ? req.body.newName : doc.get("name"),
          content: req.body.newContent
            ? req.body.newContent
            : doc.get("content"),
          collectionID: req.body.newCollectionID
            ? req.body.newCollectionID
            : doc.get("collectionID"),
        });
        response.objects.push({
          cardID: req.params.cardID,
          newName: req.body.newName ? req.body.newName : doc.get("name"),
          newContent: req.body.newContent
            ? req.body.newContent
            : doc.get("content"),
          newCollectionID: req.body.newCollectionID
            ? req.body.newCollectionID
            : doc.get("collectionID"),
        });
        res.status(200).json(response);
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't query the database." });
    });
});

app.delete("/users/:userID", (req, res) => {
  let response: responseContent = { objects: [] };

  const query = db.collection("users").where("id", "==", req.params.userID);

  query
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty)
        res.status(500).json({ error: "Couldn't find the user." });
      querySnapshot.docs.forEach((doc) => {
        const docRef = doc.ref;
        docRef.delete();
        response.objects.push({
          deletedUserID: req.params.userID,
        });
        res.status(200).json(response);
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't query the database." });
    });
});

app.delete("/collections/:collectionID", (req, res) => {
  let response: responseContent = { objects: [] };

  const query = db
    .collection("collections")
    .where("collectionID", "==", req.params.collectionID);

  query
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty)
        res.status(500).json({ error: "Couldn't find the collection" });
      querySnapshot.docs.forEach((doc) => {
        const docRef = doc.ref;
        docRef.delete();
        response.objects.push({
          deletedUserID: req.params.collectionID,
        });
        res.status(200).json(response);
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't query the database." });
    });
});

app.delete("/cards/:cardID", (req, res) => {
  let response: responseContent = { objects: [] };

  const query = db.collection("cards").where("cardID", "==", req.params.cardID);

  query
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty)
        res.status(500).json({ error: "Couldn't find the card" });
      querySnapshot.docs.forEach((doc) => {
        const docRef = doc.ref;
        docRef.delete();
        response.objects.push({
          deletedUserID: req.params.cardID,
        });
        res.status(200).json(response);
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't query the database." });
    });
});

exports.api = functions.https.onRequest(app);
