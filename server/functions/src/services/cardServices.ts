import { CardDTO, CreateCardDTO, UpdateCardDTO } from "../dtos/cardDTOs";
import { ServiceResponse } from "../dtos/serviceResponseDTO";
import { db } from "../firebaseSetup";
import Card from "../models/cardModel";

export async function createCard(
  newCard: CreateCardDTO
): Promise<ServiceResponse<CardDTO>> {
  var serviceResponse: ServiceResponse<CardDTO> = new ServiceResponse(
    "Create Card Service",
    "Couldn't query the database."
  );

  const entry = new Card(newCard.name, newCard.content, newCard.collectionID);

  await db
    .collection("cards")
    .add(entry.forDatabase())
    .then((doc) => {
      doc.update({ cardID: doc.id }).catch((err) => {
        serviceResponse = new ServiceResponse(
          "Create Card Services",
          "Couldn't add ID to Card"
        );
        return serviceResponse;
      });
      serviceResponse = new ServiceResponse(
        "Create Card Service",
        "Succesfully created Card.",
        new CardDTO(
          entry.name,
          entry.content,
          entry.collectionID,
          doc.id,
          entry.createdAt
        )
      );
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Create Card Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}

export async function getCard(id: string): Promise<ServiceResponse<CardDTO>> {
  var serviceResponse: ServiceResponse<CardDTO> = new ServiceResponse(
    "Get Card Service",
    "Couldn't query the database."
  );

  const query = db.collection("cards").where("id", "==", id);
  await query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty && !(querySnapshot.size > 1)) {
        querySnapshot.docs.forEach((doc) => {
          serviceResponse = new ServiceResponse(
            "Get Card Service",
            "Succesfully retrieved card.",
            new CardDTO(
              doc.data().name,
              doc.data().userID,
              doc.data().createdAt,
              doc.data().cardID,
              doc.data().content
            )
          );
        });
      } else {
        if (querySnapshot.size > 1) {
          serviceResponse = new ServiceResponse(
            "Update Card Service",
            "There is more than one card with this id."
          );
        } else {
          serviceResponse = new ServiceResponse(
            "Update Card Service",
            "Couldn't find the card."
          );
        }
      }
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Get Card Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}

export async function updateCard(
  id: string,
  updatedCardDTO: UpdateCardDTO
): Promise<ServiceResponse<CardDTO>> {
  var serviceResponse: ServiceResponse<CardDTO> = new ServiceResponse(
    "Get Card Service",
    "Couldn't query the database."
  );

  const query = db.collection("cards").where("id", "==", id);
  await query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty && !(querySnapshot.size > 1)) {
        querySnapshot.docs.forEach((doc) => {
          const newName =
            updatedCardDTO.name !== "" ? updatedCardDTO.name : doc.get("name");
          const newContent =
            updatedCardDTO.content !== ""
              ? updatedCardDTO.content
              : doc.get("content");
          const newCollectionID =
            updatedCardDTO.collectionID !== ""
              ? updatedCardDTO.collectionID
              : doc.get("collectionID");

          const updatedCard = new Card(
            newName,
            newContent,
            newCollectionID,
            doc.get("createdAt")
          );

          const docRef = doc.ref;
          docRef
            .update({
              name: updatedCard.name,
              collectionID: updatedCard.collectionID,
              content: updatedCard.content,
            })
            .catch((err) => {
              serviceResponse = new ServiceResponse(
                "Update Card Service",
                "Couldn't update card."
              );
              return serviceResponse;
            });
          serviceResponse = new ServiceResponse(
            "Update Card Service",
            "Succesfully updated card",
            new CardDTO(
              updatedCard.name,
              updatedCard.content,
              updatedCard.collectionID,
              doc.get("cardID"),
              updatedCard.createdAt
            )
          );
        });
      } else {
        if (querySnapshot.size > 1) {
          serviceResponse = new ServiceResponse(
            "Update Card Service",
            "There is more than one card with this id."
          );
        } else {
          serviceResponse = new ServiceResponse(
            "Update Card Service",
            "Couldn't find the card."
          );
        }
      }
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Update Card Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}

export async function deleteCard(
  id: string
): Promise<ServiceResponse<CardDTO>> {
  var serviceResponse: ServiceResponse<CardDTO> = new ServiceResponse(
    "Delete Card Service",
    "Couldn't query the database."
  );

  const query = db.collection("cards").where("id", "==", id);
  await query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty && !(querySnapshot.size > 1)) {
        querySnapshot.docs.forEach((doc) => {
          const docRef = doc.ref;
          docRef.delete().catch((err) => {
            serviceResponse = new ServiceResponse(
              "Delete Card Service",
              "Couldn't delete card."
            );
            return serviceResponse;
          });
          serviceResponse = new ServiceResponse(
            "Delete Card Service",
            "Succesfully deleted card.",
            new CardDTO(
              doc.get("name"),
              doc.get("content"),
              doc.get("collectionID"),
              doc.get("cardID"),
              doc.get("createdAt")
            )
          );
        });
      } else {
        if (querySnapshot.size > 1) {
          serviceResponse = new ServiceResponse(
            "Delete Card Service",
            "There is more than one card with this id."
          );
        } else {
          serviceResponse = new ServiceResponse(
            "Delete Card Service",
            "Couldn't find the card."
          );
        }
      }
    })
    .catch((err) => {
      serviceResponse = new ServiceResponse(
        "Delete Card Service",
        "Error querying the database."
      );
      return serviceResponse;
    });

  return serviceResponse;
}
