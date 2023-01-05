class Card {
  private _name: string;
  private _content: string;
  private _collectionID: string;
  private _createdAt: number;

  constructor(
    name: string,
    content: string,
    collectionID: string,
    date?: number
  ) {
    this._name = name;
    this._content = content;
    this._collectionID = collectionID;
    this._createdAt = date ? date : Date.now();
  }

  forDatabase() {
    const jsonFormat = {
      name: this.name,
      content: this.content,
      collectionID: this.collectionID,
      createdAt: this.createdAt,
    };

    return jsonFormat;
  }

  set name(newName: string) {
    this._name = newName;
  }

  set content(newContent: string) {
    this._content = newContent;
  }

  get name(): string {
    return this._name;
  }

  get content(): string {
    return this._content;
  }

  get collectionID(): string {
    return this._collectionID;
  }

  get createdAt(): number {
    return this._createdAt;
  }
}

export default Card;
