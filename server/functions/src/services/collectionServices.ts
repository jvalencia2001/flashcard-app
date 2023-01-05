import { CardDTO } from "../dtos/cardDTOs";
import {
  CollectionDTO,
  CreateCollectionDTO,
  UpdateCollectionDTO,
} from "../dtos/collectionDTOs";
import { ServiceResponse } from "../dtos/serviceResponseDTO";
import { db } from "../firebaseSetup";
import Collection from "../models/collectionModel";

export async function createCollection(
  newCollection: CreateCollectionDTO
): Promise<ServiceResponse<CollectionDTO>> {
  var serviceResponse: ServiceResponse<CollectionDTO> = new ServiceResponse(
    "Create Collection Service",
    "Couldn't query the database."
  );

  const entry = new Collection(
    newCollection.name,
    newCollection.userID,
    newCollection.description
  );

  await db
    .collection("collections")
    .add(entry.forDatabase())
    .then((doc) => {
      doc.update({ collectionID: doc.id }).catch((err) => {
        serviceResponse = new ServiceResponse(
          "Create Collection Services",
          "Couldn't add ID to Collection"
        );
        return serviceResponse;
      });
      serviceResponse = new ServiceResponse(
        "Create Collection Service",
        "Succesfully created Collection.",
        new CollectionDTO(
          entry.name,
          entry.userID,
          entry.createdAt,
          doc.id,
          entry.description
        )
      );
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Create Collection Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}

export async function getCollection(
  id: string
): Promise<ServiceResponse<CollectionDTO>> {
  var serviceResponse: ServiceResponse<CollectionDTO> = new ServiceResponse(
    "Get Collection Service",
    "Couldn't query the database."
  );

  const query = db.collection("collections").where("id", "==", id);
  await query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty && !(querySnapshot.size > 1)) {
        querySnapshot.docs.forEach((doc) => {
          serviceResponse = new ServiceResponse(
            "Get Collection Service",
            "Succesfully retrieved collection.",
            new CollectionDTO(
              doc.data().name,
              doc.data().userID,
              doc.data().createdAt,
              doc.data().collectionID,
              doc.data().desc
            )
          );
        });
      } else {
        if (querySnapshot.size > 1) {
          serviceResponse = new ServiceResponse(
            "Update Collection Service",
            "There is more than one collection with this id."
          );
        } else {
          serviceResponse = new ServiceResponse(
            "Update Collection Service",
            "Couldn't find the collection."
          );
        }
      }
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Get Collection Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}

export async function getCollectionCards(
  id: string
): Promise<ServiceResponse<Array<CardDTO>>> {
  var serviceResponse: ServiceResponse<Array<CardDTO>> = new ServiceResponse(
    "Get Collection's Cards Service",
    "Couldn't query the database."
  );

  const query = db.collection("cards").where("collectionID", "==", id);

  await query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        var cards: Array<CardDTO> = new Array<CardDTO>();
        querySnapshot.docs.forEach((doc) => {
          cards.push(
            new CardDTO(
              doc.get("name"),
              doc.get("content"),
              doc.get("collectionID"),
              doc.get("cardID"),
              doc.get("createdAt")
            )
          );
        });
        serviceResponse = new ServiceResponse(
          "Get Collection's Cards Service",
          "Succesfully retrieved collection's cards.",
          cards
        );
      } else {
        serviceResponse = new ServiceResponse(
          "Get Collection's Cards Service",
          "Couldn't find the any cards in this collection."
        );
      }
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Get Collection's Cards Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}

export async function updateCollection(
  id: string,
  updatedCollectionDTO: UpdateCollectionDTO
): Promise<ServiceResponse<CollectionDTO>> {
  var serviceResponse: ServiceResponse<CollectionDTO> = new ServiceResponse(
    "Get Collection Service",
    "Couldn't query the database."
  );

  const query = db.collection("collections").where("id", "==", id);
  await query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty && !(querySnapshot.size > 1)) {
        querySnapshot.docs.forEach((doc) => {
          const newName =
            updatedCollectionDTO.name !== ""
              ? updatedCollectionDTO.name
              : doc.get("displayName");
          const newDescription =
            updatedCollectionDTO.description !== ""
              ? updatedCollectionDTO.description
              : doc.get("desc");
          const newUserID =
            updatedCollectionDTO.userID !== ""
              ? updatedCollectionDTO.userID
              : doc.get("userID");

          const updatedCollection = new Collection(
            newName,
            newUserID,
            newDescription,
            doc.get("createdAt")
          );

          const docRef = doc.ref;
          docRef
            .update({
              name: updatedCollection.name,
              userID: updatedCollection.userID,
              desc: updatedCollection.description,
            })
            .catch((err) => {
              serviceResponse = new ServiceResponse(
                "Update Collection Service",
                "Couldn't update collection."
              );
              return serviceResponse;
            });
          serviceResponse = new ServiceResponse(
            "Update Collection Service",
            "Succesfully updated collection",
            new CollectionDTO(
              updatedCollection.name,
              updatedCollection.userID,
              updatedCollection.createdAt,
              doc.get("collectionID"),
              updatedCollection.description
            )
          );
        });
      } else {
        if (querySnapshot.size > 1) {
          serviceResponse = new ServiceResponse(
            "Update Collection Service",
            "There is more than one collection with this id."
          );
        } else {
          serviceResponse = new ServiceResponse(
            "Update Collection Service",
            "Couldn't find the collection."
          );
        }
      }
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Get Collection Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}

export async function deleteCollection(
  id: string
): Promise<ServiceResponse<CollectionDTO>> {
  var serviceResponse: ServiceResponse<CollectionDTO> = new ServiceResponse(
    "Delete Collection Service",
    "Couldn't query the database."
  );

  const query = db.collection("collections").where("id", "==", id);
  await query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty && !(querySnapshot.size > 1)) {
        querySnapshot.docs.forEach((doc) => {
          const docRef = doc.ref;
          docRef.delete().catch((err) => {
            serviceResponse = new ServiceResponse(
              "Delete Collection Service",
              "Couldn't delete collection."
            );
            return serviceResponse;
          });
          serviceResponse = new ServiceResponse(
            "Delete Collection Service",
            "Succesfully deleted collection.",
            new CollectionDTO(
              doc.get("name"),
              doc.get("userID"),
              doc.get("createdAt"),
              doc.get("collectionID"),
              doc.get("desc")
            )
          );
        });
      } else {
        if (querySnapshot.size > 1) {
          serviceResponse = new ServiceResponse(
            "Delete Collection Service",
            "There is more than one collection with this id."
          );
        } else {
          serviceResponse = new ServiceResponse(
            "Delete Collection Service",
            "Couldn't find the collection."
          );
        }
      }
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Get Collection Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}
