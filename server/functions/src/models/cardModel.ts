class Card {
  private _name: string;
  private _content: string;
  private _collectionID: string;
  private _createdAt: number;

  constructor(name: string, content: string, collectionID: string) {
    this._name = name;
    this._content = content;
    this._collectionID = collectionID;
    this._createdAt = Date.now();
  }

  checkCard() {
    const nameCheck = this._checkName(this.name);
    const contentCheck = this._checkContent(this.content);

    if (nameCheck == 1) throw { error: "Name is empty." };
    else if (nameCheck == 2)
      throw { error: "Name is more than 50 characters." };

    if (contentCheck == 1) throw { error: "Content is empty." };
    else if (contentCheck == 2)
      throw { error: "Content is more than 300 characters." };
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

  private _checkName(nameAttempt: string): number {
    if (!nameAttempt) return 1;
    if (nameAttempt.length > 50) return 2;

    return 0;
  }

  private _checkContent(contentAttempt: string): number {
    if (!contentAttempt) return 1;
    if (contentAttempt.length > 300) return 2;

    return 0;
  }

  set name(newName: string) {
    const nameCheck = this._checkName(newName);
    if (nameCheck == 1) throw { error: "Name is empty." };
    else if (nameCheck == 2)
      throw { error: "Name is more than 50 characters." };

    this._name = newName;
  }

  set content(newContent: string) {
    const contentCheck = this._checkContent(newContent);
    if (contentCheck == 1) throw { error: "Content is empty." };
    else if (contentCheck == 2)
      throw { error: "Content is more than 300 characters." };

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
