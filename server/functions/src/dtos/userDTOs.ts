export class UserDTO {
  uuid: string;
  displayName: string;
  handle: string;
  email: string;
  createdAt: number;

  constructor(
    uuid: string,
    displayName: string,
    handle: string,
    email: string,
    date: number
  ) {
    this.uuid = uuid;
    this.displayName = displayName;
    this.handle = handle;
    this.email = email;
    this.createdAt = date;
  }
}

export class CreateUserDTO {
  uuid: string;
  displayName: string;
  handle: string;
  email: string;

  constructor(
    uuid: string,
    displayName: string,
    handle: string,
    email: string
  ) {
    this.uuid = uuid;
    this.displayName = displayName;
    this.handle = handle;
    this.email = email;
  }
}

export class UpdateUserDTO {
  displayName: string;
  handle: string;
  email: string;

  constructor(displayName: string, handle: string, email: string) {
    this.displayName = displayName;
    this.handle = handle;
    this.email = email;
  }
}
