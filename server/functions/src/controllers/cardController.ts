import * as express from "express";
import { CreateCardDTO, CardDTO, UpdateCardDTO } from "../dtos/cardDTOs";
import { ServiceResponse } from "../dtos/serviceResponseDTO";
import {
  createCard,
  getCard,
  updateCard,
  deleteCard,
} from "../services/cardServices";

const cards = express.Router();

cards.post("/", async (req, res) => {
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

cards.get("/:cardID", async (req, res) => {
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

cards.put("/:cardID", async (req, res) => {
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

cards.delete("/:cardID", async (req, res) => {
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

export default cards;
