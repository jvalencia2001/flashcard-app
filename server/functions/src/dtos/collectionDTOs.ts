export class CollectionDTO {
  _name: string;
  _description?: string;
  _userID: string;
  _createdAt: number;

  constructor(name: string, userID: string, description?: string) {
    this._name = name;
    this._userID = userID;
    this._description = description;
    this._createdAt = Date.now();
  }
}

export class CreateCollectionDTO {
  _name: string;
  _description?: string;
  _userID: string;

  constructor(name: string, userID: string, description?: string) {
    this._name = name;
    this._userID = userID;
    this._description = description;
  }
}

export class UpdateCollectionDTO {
  _name: string;
  _description?: string;
  _userID: string;

  constructor(name: string, userID: string, description?: string) {
    this._name = name;
    this._userID = userID;
    this._description = description;
  }
}
