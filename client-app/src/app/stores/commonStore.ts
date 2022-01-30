import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  private tokenLocalKey = "jwt-reactivities";

  error: ServerError | null = null;
  token: string | null = window.localStorage.getItem(this.tokenLocalKey);
  appLoaded = false;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.token,
      token => {
        if (token) window.localStorage.setItem(this.tokenLocalKey, token);
        else window.localStorage.removeItem(this.tokenLocalKey);
      }
    );
  }

  setServerError = (error: ServerError) => {
    this.error = error;
  };

  setToken = (token: string | null) => {
    this.token = token;
  };

  setApploaded = (state?: boolean) => {
    this.appLoaded = state ?? true;
  };
}
