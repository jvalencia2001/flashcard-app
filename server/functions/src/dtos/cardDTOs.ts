export class CardDTO {
  name: string;
  content: string;
  cardID: string;
  collectionID: string;
  createdAt: number;

  constructor(
    name: string,
    content: string,
    collectionID: string,
    cardID: string,
    date: number
  ) {
    this.name = name;
    this.content = content;
    this.cardID = cardID;
    this.collectionID = collectionID;
    this.createdAt = date;
  }
}

export class CreateCardDTO {
  name: string;
  content: string;
  collectionID: string;

  constructor(name: string, content: string, collectionID: string) {
    this.name = name;
    this.content = content;
    this.collectionID = collectionID;
  }
}

export class UpdateCardDTO {
  name: string;
  content: string;
  collectionID: string;

  constructor(name: string, content: string, collectionID: string) {
    this.name = name;
    this.content = content;
    this.collectionID = collectionID;
  }
}
