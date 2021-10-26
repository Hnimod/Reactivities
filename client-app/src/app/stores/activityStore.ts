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

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  closeForm = () => {
    this.editMode = false;
  };

  createActivity = async (activity: Activity) => {
    try {
      this.setLoading(true);
      activity.id = uuid();
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
      });
      this.setEditMode(false);
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  };

  deleteActivity = async (id: string) => {
    try {
      this.setLoading(true);
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
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
        runInAction(() => {
          this.activityRegistry.set(activity.id, {
            ...activity,
            date: activity.date.split("T")[0],
          });
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoadingInitial(false);
    }
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

  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
  };

  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectedActivity();
    this.editMode = true;
  };

  updateActivity = async (activity: Activity) => {
    try {
      this.setLoading(true);
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
      });
      this.selectActivity(activity.id);
      this.setEditMode(false);
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  };
}
