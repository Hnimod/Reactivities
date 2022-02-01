import { Profile } from "./profile";

export interface Activity {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUserName: string;
  isCancelled: boolean;
  isGoing: boolean;
  isHost: boolean;
  host?: Profile;
  attendees: Profile[];
}

export class Activity implements Activity {
  constructor(activity: ActivityFormValues, user: Profile) {
    Object.assign(this, activity);
    this.hostUserName = user.userName;
    this.attendees = [user];
    this.isCancelled = false;
  }
}

export class ActivityFormValues {
  id: string = "";
  title: string = "";
  date: Date | null = null;
  description: string = "";
  category: string = "";
  city: string = "";
  venue: string = "";

  constructor(activity?: ActivityFormValues) {
    if (activity) {
      Object.keys(this).forEach(key => {
        this[key as keyof ActivityFormValues] = activity[
          key as keyof ActivityFormValues
        ] as string & Date;
      });
    }
  }
}
