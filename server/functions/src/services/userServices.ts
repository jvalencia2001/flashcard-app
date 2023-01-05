import { CollectionDTO } from "../dtos/collectionDTOs";
import { ServiceResponse } from "../dtos/serviceResponseDTO";
import { CreateUserDTO, UpdateUserDTO, UserDTO } from "../dtos/userDTOs";
import { db } from "../firebaseSetup";
import User from "../models/userModel";

export async function createUser(
  newUser: CreateUserDTO
): Promise<ServiceResponse<UserDTO>> {
  var serviceResponse: ServiceResponse<UserDTO> = new ServiceResponse(
    "Create User Service",
    "Couldn't query the database."
  );

  const entry = new User(
    newUser.uuid,
    newUser.displayName,
    newUser.handle,
    newUser.email
  );

  await db
    .collection("users")
    .add(entry.forDatabase())
    .then((doc) => {
      serviceResponse = new ServiceResponse(
        "Create User Service",
        "Succesfully created User.",
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
      if (!querySnapshot.empty && !(querySnapshot.size > 1)) {
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

export async function getUserCollections(
  id: string
): Promise<ServiceResponse<Array<CollectionDTO>>> {
  var serviceResponse: ServiceResponse<Array<CollectionDTO>> =
    new ServiceResponse(
      "Get User's Collections Service",
      "Couldn't query the database."
    );

  const query = db.collection("collections").where("userID", "==", id);

  await query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        var collections: Array<CollectionDTO> = new Array<CollectionDTO>();
        querySnapshot.docs.forEach((doc) => {
          collections.push(
            new CollectionDTO(
              doc.get("name"),
              doc.get("userID"),
              doc.get("collectionID"),
              doc.get("createdAt"),
              doc.get("desc")
            )
          );
        });
        serviceResponse = new ServiceResponse(
          "Get User's Collections Service",
          "Succesfully retrieved user's collections.",
          collections
        );
      } else {
        serviceResponse = new ServiceResponse(
          "Get User's Collections Service",
          "Couldn't find any collections from this user."
        );
      }
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Get User's Collections Service",
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
      if (!querySnapshot.empty && !(querySnapshot.size > 1)) {
        querySnapshot.docs.forEach((doc) => {
          const newDisplayName =
            updatedUserDTO.displayName !== ""
              ? updatedUserDTO.displayName
              : doc.get("displayName");
          const newEmail =
            updatedUserDTO.email !== ""
              ? updatedUserDTO.email
              : doc.get("email");
          const newHandle =
            updatedUserDTO.handle !== ""
              ? updatedUserDTO.handle
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
        "Update User Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}

export async function deleteUser(
  id: string
): Promise<ServiceResponse<UserDTO>> {
  var serviceResponse: ServiceResponse<UserDTO> = new ServiceResponse(
    "Delete User Service",
    "Couldn't query the database."
  );

  const query = db.collection("users").where("id", "==", id);
  await query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty && !(querySnapshot.size > 1)) {
        querySnapshot.docs.forEach((doc) => {
          const docRef = doc.ref;
          docRef.delete().catch((err) => {
            serviceResponse = new ServiceResponse(
              "Delete User Service",
              "Couldn't delete user."
            );
            return serviceResponse;
          });
          serviceResponse = new ServiceResponse(
            "Delete User Service",
            "Succesfully deleted user.",
            new UserDTO(
              doc.get("id"),
              doc.get("displayName"),
              doc.get("handle"),
              doc.get("email"),
              doc.get("createdAt")
            )
          );
        });
      } else {
        if (querySnapshot.size > 1) {
          serviceResponse = new ServiceResponse(
            "Delete User Service",
            "There is more than one user with this id."
          );
        } else {
          serviceResponse = new ServiceResponse(
            "Delete User Service",
            "Couldn't find the user."
          );
        }
      }
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Delete User Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}
