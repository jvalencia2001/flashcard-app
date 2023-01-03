# **_Flashcard App API_ v1.0**

**\*Note: This API is currently undergoing a refactoring process mainly in order to organize functions into services, implement DTO's for the entities, and implement async functions, and standardizing the response format across endpoints.**

### _This is a RESTful API designed to connect with the client side of any flashcard app through HTML request in order to provide said app with basic back-end functionalities. The API is written in typescript using express.js and it implements Firebase's Firestore as a database, FIrebase's auth as an auth provider, and Firebase Cloud Functions for scaling._

### _There are three entities implemented by the API: Users, Collections and Cards. Creating any entities through this API will set the fields neccessary to create the correct relations between the entities in the database. Every entity has full CRUD functionalities made accessible through the various endpoints in this API._

## **Response Format**

#### _This API uses a uniform JSON response format across all its endpoints (currently implementing). Each response contains at least two of the following fields: serviceName, serviceMessage and serviceData._

- #### _The serviceName field in a reponse simply indicated which service was invoked through the request. All responses will contain a serviceName field._

- #### _The serviceMessage field in a response will indicate wether the request was succesful or not, if it's not it also briefly explains why. All responses will contain a serviceMessage field._

- #### _The serviceData field in a reponse contains any information requested in a GET request or information about the entity created, updated or deleted. **Only a successful request contains a serviceData field.**_

## **Users**

**\*Note: A user's passwords, records and JWT tokens are managed by Firebase Auth. The Users repository is only meant as a way to assign those users a representation in the database.**

- ### **POST** @ **/users**

  - #### _Use this endpoint to write a new User entity to the database._

  - #### _Body (JSON):_

  ```
  {
    "uuid": <string>,
    "displayName:" <string>,
    "handle": <string>,
    "email": <string>,
  }
  ```

  - #### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Create User Service",
    "serviceMessage": "Succesfully created User.",
    "serviceData": {
                    "uuid": <string>,
                    "displayName:" <string>,
                    "handle": <string>,
                    "email": <string>,
                    "createdAt": <number>,
                    }
  }
  ```

- ### **GET** @ **/users/:userID**

  - #### _Use this endpoint to request the information of a specific User entity from the database._

  - #### _Path Params:_

  ```
  userID: <String>
  ```

  - ### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Get User Service",
    "serviceMessage": "Succesfully retrieved User data.",
    "serviceData": {
                    "uuid": <string>,
                    "displayName:" <string>,
                    "handle": <string>,
                    "email": <string>,
                    "createdAt": <number>,
                    }
  }
  ```

- ### **GET** @ **/users/:userID/collections**

  - #### _Use this endpoint to request the data of the all the collections owned by a user from the database._

  - #### _Path Params:_

  ```
  userID: <String>
  ```

  - ### _Sample Succescful Response(JSON):_

  ```
  {
    "serviceName": "Get User's Collections Service",
    "serviceMessage": "Succesfully retrieved User's collections data.",
    "serviceData":
                  [
                    {
                      "name": <string>,
                      "description"?: <string>,
                      "userID": <string>,
                      "createdAt": <number>,
                    },
                    {
                      "name": <string>,
                      "description"?: <string>,
                      "userID": <string>,
                      "createdAt": <number>,
                    },
                  ]
  }
  ```

- ### **PUT** @ **/users/:userID**

  **\*Note: In the future, the function to update a each entity partially will be refactored out from any put endpoints into patch endpoints.**

  - #### _Use this endpoint to update all or partial data in a user entity._

  - #### _Path Params:_

  ```
  userID: <String>
  ```

  - #### _Body (JSON):_

  ```
  {
    "displayName:" <string>,
    "handle": <string>,
    "email": <string>,
  }
  ```

  - ### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Update User Service",
    "serviceMessage": "Succesfully updated User.",
    "serviceData": {
                    "uuid": <string>,
                    "displayName:" <string>,
                    "handle": <string>,
                    "email": <string>,
                    "createdAt": <number>,
                    }
  }
  ```

  - ### **DELETE** @ **/users/:userID**

  - #### _Use this endpoint to delete a specific user entity from the database._

  - #### _Path Params:_

  ```
  userID: <String>
  ```

  - ### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Delete User Service",
    "serviceMessage": "Succesfully deleted the User.",
    "serviceData": {
                    "uuid": <string>,
                    "displayName:" <string>,
                    "handle": <string>,
                    "email": <string>,
                    "createdAt": <number>,
                    }
  }
  ```

## **Collections**

- ### **POST** @ **/collections**

  - #### _Use this endpoint to write a new Collection entity to the database._

  - #### _Body (JSON):_

  ```
  {
    "name": <string>,
    "description"?: <string>,
    "userID": <string>,
  }
  ```

  - #### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Create Collection Service",
    "serviceMessage": "Succesfully created Collection.",
    "serviceData": {
                    "name": <string>,
                    "description"?: <string>,
                    "userID": <string>,
                    "createdAt": <number>,
                    }
  }
  ```

- ### **GET** @ **/collections/:collectionID**

  - #### _Use this endpoint to request the information of a specific Collection entity from the database._

  - #### _Path Params:_

  ```
  collectionID: <String>
  ```

  - ### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Get Collection Service",
    "serviceMessage": "Succesfully retrieved Collection data.",
    "serviceData": {
                    "name": <string>,
                    "description"?: <string>,
                    "userID": <string>,
                    "createdAt": <number>,
                    }
  }
  ```

- ### **GET** @ **/collections/:collectionID/collections**

  - #### _Use this endpoint to request the data of the all the cards owned by a collection from the database._

  - #### _Path Params:_

  ```
  collectionID: <String>
  ```

  - ### _Sample Succescful Response(JSON):_

  ```
  {
    "serviceName": "Get Collection's cards Service",
    "serviceMessage": "Succesfully retrieved Collection's cards data.",
    "serviceData":
                  [
                    {
                      "name": <string>,
                      "content": <string>,
                      "collectionID": <string>,
                      "createdAt": <number>,
                    },
                    {
                      "name": <string>,
                      "content": <string>,
                      "collectionID": <string>,
                      "createdAt": <number>,
                    },
                  ]
  }
  ```

- ### **PUT** @ **/collections/:collectionID**

  **\*Note: In the future, the function to update a each entity partially will be refactored out from any put endpoints into patch endpoints.**

  - #### _Use this endpoint to update all or partial data in a collection entity._

  - #### _Path Params:_

  ```
  collectionID: <String>
  ```

  - #### _Body (JSON):_

  ```
  {
    "name": <string>,
    "description"?: <string>,
    "userID": <string>,
  }
  ```

  - ### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Update Collection Service",
    "serviceMessage": "Succesfully updated collection.",
    "serviceData": {
                    "name": <string>,
                    "description"?: <string>,
                    "userID": <string>,
                    "createdAt": <number>,
                    }
  }
  ```

  - ### **DELETE** @ **/collections/:collectionID**

  - #### _Use this endpoint to delete a specific Collection entity from the database._

  - #### _Path Params:_

  ```
  collectionID: <String>
  ```

  - ### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Delete Collection Service",
    "serviceMessage": "Succesfully deleted the Collection.",
    "serviceData": {
                    "name": <string>,
                    "description"?: <string>,
                    "userID": <string>,
                    "createdAt": <number>,
                    }
  }
  ```

## **Cards**

- ### **POST** @ **/cards**

  - #### _Use this endpoint to write a new Card entity to the database._

  - #### _Body (JSON):_

  ```
  {
    "name": <string>,
    "content": <string>,
    "collectionID": <string>,
  }
  ```

  - #### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Create Card Service",
    "serviceMessage": "Succesfully created Card.",
    "serviceData": {
                    "name": <string>,
                    "content": <string>,
                    "collectionID": <string>,
                    "createdAt": <number>,
                    }
  }
  ```

- ### **GET** @ **/cards/:cardID**

  - #### _Use this endpoint to request the information of a specific Card entity from the database._

  - #### _Path Params:_

  ```
  cardID: <String>
  ```

  - ### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Get Card Service",
    "serviceMessage": "Succesfully retrieved Card data.",
    "serviceData": {
                    "name": <string>,
                    "content": <string>,
                    "collectionID": <string>,
                    "createdAt": <number>,
                    }
  }
  ```

- ### **PUT** @ **/cards/:cardID**

  **\*Note: In the future, the function to update a each entity partially will be refactored out from any put endpoints into patch endpoints.**

  - #### _Use this endpoint to update all or partial data in a card entity._

  - #### _Path Params:_

  ```
  cardID: <String>
  ```

  - #### _Body (JSON):_

  ```
  {
    "name": <string>,
    "content": <string>,
    "collectionID": <string>,
  }
  ```

  - ### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Update Card Service",
    "serviceMessage": "Succesfully updated card.",
    "serviceData": {
                    "name": <string>,
                    "content": <string>,
                    "collectionID": <string>,
                    "createdAt": <number>,
                    }
  }
  ```

  - ### **DELETE** @ **/cards/:cardID**

  - #### _Use this endpoint to delete a specific Card entity from the database._

  - #### _Path Params:_

  ```
  cardID: <String>
  ```

  - ### _Sample Successful Response(JSON):_

  ```
  {
    "serviceName": "Delete Card Service",
    "serviceMessage": "Succesfully deleted the Card.",
    "serviceData": {
                    "name": <string>,
                    "content": <string>,
                    "collectionID": <string>,
                    "createdAt": <number>,
                    }
  }
  ```
