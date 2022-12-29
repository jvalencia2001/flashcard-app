export class UserDTO {
  _uuid: string;
  _displayName: string;
  _handle: string;
  _email: string;
  _createdAt: number;

  constructor(
    uuid: string,
    displayName: string,
    handle: string,
    email: string,
    date: number
  ) {
    this._uuid = uuid;
    this._displayName = displayName;
    this._handle = handle;
    this._email = email;
    this._createdAt = date;
  }
}

export class CreateUserDTO {
  _uuid: string;
  _displayName: string;
  _handle: string;
  _email: string;

  constructor(
    uuid: string,
    displayName: string,
    handle: string,
    email: string
  ) {
    this._uuid = uuid;
    this._displayName = displayName;
    this._handle = handle;
    this._email = email;
  }
}

export class UpdateUserDTO {
  _displayName: string;
  _handle: string;
  _email: string;

  constructor(displayName: string, handle: string, email: string) {
    this._displayName = displayName;
    this._handle = handle;
    this._email = email;
  }
}
