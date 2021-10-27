import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  editMode = false;
  loading = false;
  loadingInitial = false;
  selectedActivity: Activity | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((grouped, activity) => {
        const date = activity.date;
        grouped[date] = grouped[date] ? [...grouped[date], activity] : [activity];
        return grouped;
      }, {} as { [key: string]: Activity[] })
    );
  }

  private setInitialActivity = (activity: Activity) => {
    const modifiedActivity = { ...activity, date: activity.date.split("T")[0] };
    this.activityRegistry.set(activity.id, modifiedActivity);
  };

  createActivity = async (activity: Activity) => {
    let newActivity: Activity | undefined;
    try {
      this.setLoading(true);
      activity.id = uuid();
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
      });
      this.setEditMode(false);
      newActivity = { ...activity };
    } catch (error) {
      console.error(error);
      newActivity = undefined;
    } finally {
      this.setLoading(false);
      return newActivity;
    }
  };

  deleteActivity = async (id: string) => {
    try {
      this.setLoading(true);
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  };

  loadActivities = async () => {
    try {
      this.setLoadingInitial(true);
      const activities = await agent.Activities.list();
      activities.forEach(activity => {
        this.setInitialActivity(activity);
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoadingInitial(false);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.activityRegistry.get(id);
    if (activity) {
      this.selectActivity(activity);
      return activity;
    }
    try {
      this.setLoadingInitial(true);
      activity = await agent.Activities.details(id);
      this.setInitialActivity(activity);
      this.selectActivity(activity);
      return activity;
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoadingInitial(false);
    }
  };

  selectActivity = (activity: Activity) => {
    this.selectedActivity = activity;
  };

  setLoadingInitial = (value: boolean) => {
    this.loadingInitial = value;
  };

  setEditMode = (value: boolean) => {
    this.editMode = value;
  };

  setLoading = (value: boolean) => {
    this.loading = value;
  };

  updateActivity = async (activity: Activity) => {
    let updatedActivity: Activity | undefined;
    try {
      this.setLoading(true);
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
      });
      this.selectActivity(activity);
      this.setEditMode(false);
      updatedActivity = activity;
    } catch (error) {
      console.error(error);
      updatedActivity = undefined;
    } finally {
      this.setLoading(false);
      return updatedActivity;
    }
  };
}
