import * as express from "express";
import { CollectionDTO } from "../dtos/collectionDTOs";
import { ServiceResponse } from "../dtos/serviceResponseDTO";
import { CreateUserDTO, UpdateUserDTO, UserDTO } from "../dtos/userDTOs";
import {
  createUser,
  deleteUser,
  getUser,
  getUserCollections,
  updateUser,
} from "../services/userServices";

const users = express.Router();

users.post("/", async (req, res) => {
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

users.get("/:userID", async (req, res) => {
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

users.get("/:userID/collections", async (req, res) => {
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

users.put("/:userID", async (req, res) => {
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

users.delete("/:userID", async (req, res) => {
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

export default users;
