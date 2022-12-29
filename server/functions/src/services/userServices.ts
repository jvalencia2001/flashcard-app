//import { user } from "firebase-functions/v1/auth";
import { ServiceResponse } from "../dtos/serviceResponseDTO";
import { CreateUserDTO, UpdateUserDTO, UserDTO } from "../dtos/userDTOs";
import { db } from "../firebaseSetup";
import User from "../models/userModel";

export async function createUser(
  newUser: CreateUserDTO
): Promise<ServiceResponse<UserDTO>> {
  var serviceResponse: ServiceResponse<UserDTO> = new ServiceResponse(
    "Get User Service",
    "Couldn't query the database."
  );

  const entry = new User(
    newUser._uuid,
    newUser._displayName,
    newUser._handle,
    newUser._email
  );

  await db
    .collection("users")
    .add(entry.forDatabase())
    .then((doc) => {
      serviceResponse = new ServiceResponse(
        "Get User Service",
        "Succesfully retrieved user.",
        new UserDTO(
          entry.uuid,
          entry.displayName,
          entry.handle,
          entry.email,
          entry.createdAt
        )
      );
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Create User Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}

export async function getUser(id: string): Promise<ServiceResponse<UserDTO>> {
  var serviceResponse: ServiceResponse<UserDTO> = new ServiceResponse(
    "Get User Service",
    "Couldn't query the database."
  );

  const query = db.collection("users").where("id", "==", id);
  await query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty || querySnapshot.size > 1) {
        querySnapshot.docs.forEach((doc) => {
          serviceResponse = new ServiceResponse(
            "Get User Service",
            "Succesfully retrieved user.",
            new UserDTO(
              doc.data().id,
              doc.data().displayName,
              doc.data().handle,
              doc.data().email,
              doc.data().createdAt
            )
          );
        });
      } else {
        if (querySnapshot.size > 1) {
          serviceResponse = new ServiceResponse(
            "Update User Service",
            "There is more than one user with this id."
          );
        } else {
          serviceResponse = new ServiceResponse(
            "Update User Service",
            "Couldn't find the user."
          );
        }
      }
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Get User Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}

export async function updateUser(
  id: string,
  updatedUserDTO: UpdateUserDTO
): Promise<ServiceResponse<UserDTO>> {
  var serviceResponse: ServiceResponse<UserDTO> = new ServiceResponse(
    "Get User Service",
    "Couldn't query the database."
  );

  const query = db.collection("users").where("id", "==", id);
  await query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty || querySnapshot.size > 1) {
        querySnapshot.docs.forEach((doc) => {
          const newDisplayName =
            updatedUserDTO._displayName !== ""
              ? updatedUserDTO._displayName
              : doc.get("displayName");
          const newEmail =
            updatedUserDTO._email !== ""
              ? updatedUserDTO._email
              : doc.get("email");
          const newHandle =
            updatedUserDTO._handle !== ""
              ? updatedUserDTO._handle
              : doc.get("handle");

          const updatedUser = new User(
            doc.get("id"),
            newDisplayName,
            newHandle,
            newEmail,
            doc.get("createdAt")
          );

          const docRef = doc.ref;
          docRef
            .update({
              displayName: updatedUser.displayName,
              email: updatedUser.email,
              handle: updatedUser.handle,
            })
            .catch((err) => {
              serviceResponse = new ServiceResponse(
                "Update User Service",
                "Couldn't update user."
              );
              return serviceResponse;
            });
          serviceResponse = new ServiceResponse(
            "Update User Service",
            "Succesfully updated user",
            new UserDTO(
              updatedUser.uuid,
              updatedUser.displayName,
              updatedUser.handle,
              updatedUser.email,
              updatedUser.createdAt
            )
          );
        });
      } else {
        if (querySnapshot.size > 1) {
          serviceResponse = new ServiceResponse(
            "Update User Service",
            "There is more than one user with this id."
          );
        } else {
          serviceResponse = new ServiceResponse(
            "Update User Service",
            "Couldn't find the user."
          );
        }
      }
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Get User Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}
