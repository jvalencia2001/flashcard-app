import { db } from "../firebaseSetup";

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

  checkCollection() {
    const nameCheck = this._checkName(this.name);

    if (nameCheck == 1) throw { error: "Name is empty." };
    else if (nameCheck == 2)
      throw { error: "Name has more than 50 characters." };
    else if (nameCheck == 3) throw { error: "Collection name must be unique." };

    if (this.description) {
      const descCheck = this._checkDesc(this.description);

      if (descCheck == 1)
        throw { error: "Description has more than 300 characters." };
    } else this._description = "";
  }

  private _checkName(nameAttempt: string): number {
    if (!nameAttempt) return 1;
    if (nameAttempt.length > 50) return 2;

    let empty = 0;
    const query = db.collection("collections").where("name", "==", this.name);

    query.get().then((querySnapshot) => {
      if (querySnapshot.empty) empty = 1;
    });

    if (empty == 0) return 3;
    return 0;
  }

  private _checkDesc(descAttempt: string): number {
    if (descAttempt.length > 300) return 1;

    return 0;
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

  set name(newName: string) {
    const nameCheck = this._checkName(newName);

    if (nameCheck == 1) throw { error: "Name is empty." };
    else if (nameCheck == 2)
      throw { error: "Name has more than 50 characters." };

    this._name = newName;
  }

  set description(newDesc: string) {
    if (!newDesc) this._description = "";
    if (newDesc) {
      const descCheck = this._checkDesc(newDesc);

      if (descCheck == 1)
        throw { error: "Description has more than 300 characters." };

      this._description = newDesc;
    }
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
}

export default Collection;
