import { makeAutoObservable } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/users";
import { store } from "./store";

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  isLoggedIn = () => {
    return !!this.user;
  };

  setUser = (user: User | null) => {
    this.user = user;
  };

  getUser = async () => {
    const result = await agent.Account.me();
    if (result.isSuccess) {
      this.setUser(result.value);
    }
    return result;
  };

  login = async (cridentials: UserFormValues) => {
    const result = await agent.Account.login(cridentials);
    if (result.isSuccess) {
      store.commonStore.setToken(result.value!.token);
      this.setUser(result.value!);
      history.replace("/activities");
      store.modalStore.closeModal();
    }
    return result;
  };

  logout = () => {
    store.commonStore.setToken(null);
    store.activityStore.clearActivity();
    this.setUser(null);
    history.replace("/");
  };

  register = async (cridentials: UserFormValues) => {
    const result = await agent.Account.register(cridentials);
    if (result.isSuccess) {
      store.commonStore.setToken(result.value!.token);
      this.setUser(result.value!);
      history.replace("/activities");
      store.modalStore.closeModal();
    }
    return result;
  };
}
