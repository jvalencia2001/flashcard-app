class Collection {
  private _name: string;
  private _description?: string;
  private _userID: string;
  private _createdAt: number;

  constructor(name: string, userID: string, description?: string) {
    this._name = name;
    this._userID = userID;
    this._description = description;
    this._createdAt = Date.now();
  }

  forDatabase() {
    const jsonFormat = {
      name: this.name,
      userID: this.userID,
      desc: this.description,
      createdAt: this.createdAt,
    };

    return jsonFormat;
  }

  set name(newName: string) {
    this._name = newName;
  }

  set description(newDesc: string) {
    this._description = newDesc;
  }

  get name(): string {
    return this._name;
  }

  get userID(): string {
    return this._userID;
  }

  get description(): string {
    if (this._description) return this._description;

    return "";
  }

  get createdAt(): number {
    return this._createdAt;
  }
}

export default Collection;
