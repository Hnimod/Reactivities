import { User } from "./users";

export interface Profile {
  userName: string;
  displayName: string;
  bio?: string;
  image?: string;
}

export class Profile implements Profile {
  userName: string;
  displayName: string;
  image?: string;

  constructor(user: User) {
    this.userName = user.userName;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}
