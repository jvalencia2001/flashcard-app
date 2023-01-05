export class CollectionDTO {
  name: string;
  description?: string;
  userID: string;
  createdAt: number;
  collectionID: string;

  constructor(
    name: string,
    userID: string,
    date: number,
    id: string,
    description?: string
  ) {
    this.name = name;
    this.userID = userID;
    this.description = description;
    this.createdAt = date;
    this.collectionID = id;
  }
}

export class CreateCollectionDTO {
  name: string;
  description?: string;
  userID: string;

  constructor(name: string, userID: string, description?: string) {
    this.name = name;
    this.userID = userID;
    this.description = description;
  }
}

export class UpdateCollectionDTO {
  name: string;
  description?: string;
  userID: string;

  constructor(name: string, userID: string, description?: string) {
    this.name = name;
    this.userID = userID;
    this.description = description;
  }
}
