import * as express from "express";
import { CardDTO } from "../dtos/cardDTOs";
import {
  CreateCollectionDTO,
  CollectionDTO,
  UpdateCollectionDTO,
} from "../dtos/collectionDTOs";
import { ServiceResponse } from "../dtos/serviceResponseDTO";
import {
  createCollection,
  getCollection,
  getCollectionCards,
  updateCollection,
  deleteCollection,
} from "../services/collectionServices";

const collections = express.Router();

collections.post("/", async (req, res) => {
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

collections.get("/:collectionID", async (req, res) => {
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

collections.get("/:collectionID/cards", async (req, res) => {
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

collections.put("/:collectionID", async (req, res) => {
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

collections.delete("/:collectionID", async (req, res) => {
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

export default collections;
