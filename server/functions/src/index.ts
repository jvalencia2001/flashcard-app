import * as functions from "firebase-functions";
import * as express from "express";
import { db } from "./firebaseSetup";
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
import { CardDTO, CreateCardDTO, UpdateCardDTO } from "./dtos/cardDTOs";
import {
  createCard,
  deleteCard,
  getCard,
  updateCard,
} from "./services/cardServices";

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

app.post("/cards", async (req, res) => {
  const newCard = new CreateCardDTO(
    req.body.name,
    req.body.content,
    req.body.collectionID
  );

  await createCard(newCard).then(
    (serviceResponse: ServiceResponse<CardDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(201).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
});

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

app.get("/cards/:cardID", async (req, res) => {
  await getCard(req.params.cardID).then(
    (serviceResponse: ServiceResponse<CardDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(201).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
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

app.put("/cards/:cardID", async (req, res) => {
  const updatedCard = new UpdateCardDTO(
    req.body.name ? req.body.name : "",
    req.body.content ? req.body.content : "",
    req.body.collectionID ? req.body.collectionID : ""
  );

  await updateCard(req.params.cardID, updatedCard).then(
    (serviceResponse: ServiceResponse<CardDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(200).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
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

app.delete("/cards/:cardID", async (req, res) => {
  await deleteCard(req.params.cardID).then(
    (serviceResponse: ServiceResponse<CardDTO>) => {
      if (serviceResponse.serviceData) {
        res.status(200).json(serviceResponse);
      } else {
        res.status(500).json(serviceResponse);
      }
    }
  );
});

exports.api = functions.https.onRequest(app);
