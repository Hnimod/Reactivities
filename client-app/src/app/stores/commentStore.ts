import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { httpFactory, Result } from "../api/agent";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = async (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chat?activityId=" + activityId, {
        accessTokenFactory: () => store.userStore.user?.token!,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    const result = await httpFactory(this.hubConnection.start());

    if (!result.isSuccess) return result;

    this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
      runInAction(() => {
        this.comments = comments;
      });
    });

    this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
      runInAction(() => {
        this.comments.push(comment);
      });
    });

    return result;
  };

  stopHubConnection = async () => {
    if (!this.hubConnection) return Result.Success(null);
    const result = await httpFactory(this.hubConnection.stop());
    return result;
  };

  clearConnection = () => {
    this.comments = [];
    this.stopHubConnection();
  };

  addComment = async (values: any) => {
    if (!this.hubConnection) return Result.Success(null);
    values.activityId = store.activityStore.selectedActivity!.id;

    const result = await httpFactory(this.hubConnection?.invoke("SendComment", values));

    return result;
  };
}
