import * as functions from "firebase-functions";
import * as express from "express";
import { db } from "./firebaseSetup";
import Card from "./models/cardModel";
import { CreateUserDTO, UpdateUserDTO, UserDTO } from "./dtos/userDTOs";
import {
  createUser,
  deleteUser,
  getUser,
  getUserCollections,
  updateUser,
} from "./services/userServices";
import { ServiceResponse } from "./dtos/serviceResponseDTO";
import {
  CollectionDTO,
  CreateCollectionDTO,
  UpdateCollectionDTO,
} from "./dtos/collectionDTOs";
import {
  createCollection,
  deleteCollection,
  getCollection,
  getCollectionCards,
  updateCollection,
} from "./services/collectionServices";
import { CardDTO } from "./dtos/cardDTOs";
//import { service } from "firebase-functions/v1/analytics";
//import { ServiceResponse } from "./dtos/serviceResponseDTO";

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  const newUser = new CreateUserDTO(
    req.body.uuid,
    req.body.displayName,
    req.body.handle,
    req.body.email
  );

  await createUser(newUser).then(
    (serviceResponse: ServiceResponse<UserDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(201).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
});

app.post("/collections", async (req, res) => {
  const newCollection = new CreateCollectionDTO(
    req.body.name,
    req.body.userID,
    req.body.description
  );

  await createCollection(newCollection).then(
    (serviceResponse: ServiceResponse<CollectionDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(201).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
});

app.post("/cards", (req, res) => {
  const newCard = new Card(
    req.body.name,
    req.body.content,
    req.body.collectionID
  );

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

app.get("/users/:userID", async (req, res) => {
  await getUser(req.params.userID).then(
    (serviceResponse: ServiceResponse<UserDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(200).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
});

app.get("/users/:userID/collections", async (req, res) => {
  await getUserCollections(req.params.userID).then(
    (serviceResponse: ServiceResponse<Array<CollectionDTO>>) => {
      if (serviceResponse.serviceData) {
        res.status(200).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
});

app.get("/collections/:collectionID", async (req, res) => {
  await getCollection(req.params.collectionID).then(
    (serviceResponse: ServiceResponse<CollectionDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(201).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
});

app.get("/collections/:collectionID/cards", async (req, res) => {
  await getCollectionCards(req.params.collectionID).then(
    (serviceResponse: ServiceResponse<Array<CardDTO>>) => {
      if (serviceResponse.serviceData) {
        res.status(200).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
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

app.put("/users/:userID", async (req, res) => {
  const updatedUser = new UpdateUserDTO(
    req.body.displayName ? req.body.displayName : "",
    req.body.handle ? req.body.handle : "",
    req.body.email ? req.body.email : ""
  );

  await updateUser(req.params.userID, updatedUser).then(
    (serviceResponse: ServiceResponse<UserDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(200).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
});

app.put("/collections/:collectionID", async (req, res) => {
  const updatedCollection = new UpdateCollectionDTO(
    req.body.name ? req.body.name : "",
    req.body.userID ? req.body.userID : "",
    req.body.description ? req.body.description : ""
  );

  await updateCollection(req.params.collectionID, updatedCollection).then(
    (serviceResponse: ServiceResponse<CollectionDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(200).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
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

app.delete("/users/:userID", async (req, res) => {
  await deleteUser(req.params.userID).then(
    (serviceResponse: ServiceResponse<UserDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(200).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
});

app.delete("/collections/:collectionID", async (req, res) => {
  await deleteCollection(req.params.collectionID).then(
    (serviceResponse: ServiceResponse<CollectionDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(200).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
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
