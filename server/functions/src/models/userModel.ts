//Most of auth is handled by firebase in the client

class User {
  private _uuid: string;
  private _displayName: string;
  private _handle: string;
  private _email: string;
  private _createdAt: number;

  constructor(
    uuid: string,
    displayName: string,
    handle: string,
    email: string,
    createdAt?: number
  ) {
    this._uuid = uuid;
    this._displayName = displayName;
    this._handle = handle;
    this._email = email;
    this._createdAt = createdAt ? createdAt : Date.now();
  }

  forDatabase() {
    const jsonFormat = {
      id: this.uuid,
      displayName: this.displayName,
      handle: this.handle,
      email: this.email,
      createdAt: this.createdAt,
    };
    return jsonFormat;
  }

  set displayName(newName: string) {
    this._displayName = newName;
  }

  set email(newEmail: string) {
    this._email = newEmail;
  }

  get uuid(): string {
    return this._uuid;
  }

  get displayName(): string {
    return this._displayName;
  }

  get handle(): string {
    return this._handle;
  }

  get email(): string {
    return this._email;
  }

  get createdAt(): number {
    return this._createdAt;
  }
}

export default User;
