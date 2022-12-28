export class CardDTO {
  _name: string;
  _content: string;
  _collectionID: string;
  _createdAt: number;

  constructor(name: string, content: string, collectionID: string) {
    this._name = name;
    this._content = content;
    this._collectionID = collectionID;
    this._createdAt = Date.now();
  }
}

export class CreateCardDTO {
  _name: string;
  _content: string;
  _collectionID: string;

  constructor(name: string, content: string, collectionID: string) {
    this._name = name;
    this._content = content;
    this._collectionID = collectionID;
  }
}

export class UpdateCardDTO {
  _name: string;
  _content: string;
  _collectionID: string;

  constructor(name: string, content: string, collectionID: string) {
    this._name = name;
    this._content = content;
    this._collectionID = collectionID;
  }
}
