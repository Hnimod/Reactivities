import { makeAutoObservable, runInAction } from "mobx";
import agent, { Result } from "../api/agent";
import { Photo, Profile } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.userName === this.profile.userName;
    }
    return false;
  }

  private setLoadingProfile = (value?: boolean) => {
    this.loadingProfile = value ?? true;
  };

  private setloading = (value?: boolean) => {
    this.loading = value ?? true;
  };

  private setProfile = (profile: Profile) => {
    this.profile = profile;
  };

  private checkProfileNull = () => {
    if (!this.profile) return Result.Failure("Profile is not yet loaded");
  };

  loadProfile = async (userName: string) => {
    this.setLoadingProfile();
    const result = await agent.Profiles.get(userName);
    if (result.isSuccess) this.setProfile(result.value!);
    this.setLoadingProfile(false);
    return result;
  };

  uploadPhoto = async (file: Blob) => {
    this.checkProfileNull();
    const profile = this.profile as Profile;
    this.setloading();
    const result = await agent.Profiles.uploadPhoto(file);

    if (result.isSuccess) {
      const photo = result.value as Photo;
      runInAction(() => {
        if (!profile.photos) profile.photos = [];
        profile.photos.push(photo);
        if (photo.isMain && store.userStore.user) {
          store.userStore.setImage(photo.url);
          profile.image = photo.url;
        }
      });
    }

    this.setloading(false);
    return result;
  };

  setMainPhoto = async (photo: Photo) => {
    this.checkProfileNull();
    const profile = this.profile as Profile;
    this.setloading();
    const result = await agent.Profiles.setMainPhoto(photo.id);

    if (result.isSuccess) {
      store.userStore.setImage(photo.url);
      runInAction(() => {
        profile.photos!.find(p => p.isMain)!.isMain = false;
        profile.photos!.find(p => p.id === photo.id)!.isMain = true;
        profile.image = photo.url;
      });
    }

    this.setloading(false);
    return result;
  };

  deletePhoto = async (photo: Photo) => {
    this.checkProfileNull();
    const profile = this.profile as Profile;
    this.setloading();
    const result = await agent.Profiles.deletePhoto(photo.id);

    if (result.isSuccess) {
      runInAction(() => {
        profile.photos = profile.photos!.filter(p => p.id !== photo.id);
      });
    }

    this.setloading(false);
    return result;
  };
}
