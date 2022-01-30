import { makeAutoObservable } from "mobx";

export class ModalStore {
  open = false;
  body: JSX.Element | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  openModal = (content: JSX.Element) => {
    this.body = content;
    this.open = true;
  };

  closeModal = () => {
    this.body = null;
    this.open = false;
  };
}
