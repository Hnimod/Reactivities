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
    const user = await agent.Account.me();
    this.setUser(user);
  };

  login = async (cridentials: UserFormValues) => {
    const user = await agent.Account.login(cridentials);
    store.commonStore.setToken(user.token);
    this.setUser(user);
    history.replace("/activities");
    store.modalStore.closeModal();
  };

  logout = () => {
    store.commonStore.setToken(null);
    this.setUser(null);
    history.replace("/");
  };

  register = async (cridentials: UserFormValues) => {
    const user = await agent.Account.register(cridentials);
    store.commonStore.setToken(user.token);
    this.setUser(user);
    history.replace("/activities");
    store.modalStore.closeModal();
  };
}
