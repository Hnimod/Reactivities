import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuid } from "uuid";

import agent, { Result } from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { Profile } from "../models/profile";
import { store } from "./store";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  loading = false;
  loadingInitial = false;
  selectedActivity: Activity | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((grouped, activity) => {
        const date = activity.date?.toISOString().split("T")[0] || "Problem";
        grouped[date] = grouped[date] ? [...grouped[date], activity] : [activity];
        return grouped;
      }, {} as { [key: string]: Activity[] })
    );
  }

  clearActivity = () => {
    this.activityRegistry.clear();
    this.selectedActivity = undefined;
  };

  getActivity = (id: string) => this.activityRegistry.get(id);

  setActivity = (activity: Activity) => {
    const user = store.userStore.user;

    if (user) {
      activity.isGoing = activity.attendees!.some(a => a.userName === user.userName);
      activity.isHost = activity.hostUserName === user.userName;
      activity.host = activity.attendees!.find(a => a.userName === activity.hostUserName);
    }

    const modifiedActivity = { ...activity, date: new Date(activity.date!) };
    this.activityRegistry.set(activity.id, modifiedActivity);
  };

  selectActivity = (activity: Activity) => {
    this.selectedActivity = activity;
  };

  setLoadingInitial = (value: boolean) => {
    this.loadingInitial = value;
  };

  setLoading = (value?: boolean) => {
    this.loading = value ?? true;
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);

    activity.id = uuid();
    const result = await agent.Activities.create(activity);
    if (!result.isSuccess) return result;

    const newActivity = new Activity(activity, attendee);
    this.setActivity(newActivity);
    this.selectActivity(newActivity);
    return Result.Success(newActivity);
  };

  deleteActivity = async (id: string) => {
    this.setLoading(true);
    const result = await agent.Activities.delete(id);

    if (result.isSuccess) {
      runInAction(() => {
        this.activityRegistry.delete(id);
      });
    }

    this.setLoading(false);
    return result;
  };

  loadActivities = async () => {
    this.setLoadingInitial(true);
    const result = await agent.Activities.list();

    if (result.isSuccess) {
      result.value!.forEach(activity => {
        this.setActivity(activity);
      });
    }

    this.setLoadingInitial(false);
    return result;
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectActivity(activity);
      return Result.Success(activity);
    }

    this.setLoadingInitial(true);
    const result = await agent.Activities.details(id);

    if (result.isSuccess) {
      this.setActivity(result.value!);
      this.selectActivity(result.value!);
    }

    this.setLoadingInitial(false);
    return result;
  };

  updateActivity = async (activity: ActivityFormValues) => {
    const result = await agent.Activities.update(activity);

    if (result.isSuccess) {
      const updatedActivity = { ...this.getActivity(activity.id), ...activity } as Activity;
      this.setActivity(updatedActivity);
      this.selectActivity(updatedActivity);
      return Result.Success(updatedActivity);
    }

    return result;
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.setLoading();
    const result = await agent.Activities.attend(this.selectedActivity!.id);

    if (result.isSuccess) {
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(
            a => a.userName !== user?.userName
          );
          this.selectedActivity.isGoing = false;
        } else {
          const newAttendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(newAttendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      });
    }

    this.setLoading(false);
    return result;
  };

  cancelActivityToggle = async () => {
    this.setLoading();
    const result = await agent.Activities.attend(this.selectedActivity!.id);

    if (result.isSuccess) {
      runInAction(() => {
        this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      });
    }

    this.setLoading(false);
    return result;
  };
}
