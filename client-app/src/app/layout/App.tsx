import { useState, useEffect } from "react";
import { Container } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import "./styles.css";

import { Activity } from "../models/activity";
import NavBar from "../layout/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(activity => activity.id === id));
  };

  const handleCancelSelectAcitivity = () => {
    setSelectedActivity(undefined);
  };

  const handleFormOpen = (id?: string) => {
    id ? handleSelectActivity(id) : handleCancelSelectAcitivity();
    setEditMode(true);
  };

  const handleFormClose = () => {
    setEditMode(false);
  };

  const handleCreateOrEdit = async (activity: Activity) => {
    setSubmitting(true);

    if (activity.id) {
      await agent.Activities.update(activity);
      setActivities([...activities.filter(x => x.id !== activity.id), activity]);
      setEditMode(false);
      setSelectedActivity(activity);
    } else {
      activity.id = uuid();
      await agent.Activities.create(activity);
      setActivities([...activities, activity]);
    }

    setEditMode(false);
    setSelectedActivity(activity);
    setSubmitting(false);
  };

  const handleDeleteActivity = async (id: string) => {
    setSubmitting(true);
    await agent.Activities.delete(id);
    setActivities([...activities.filter(x => x.id !== id)]);
    setSubmitting(false);
  };

  useEffect(() => {
    (async function () {
      setLoading(true);
      const response = await agent.Activities.list();
      const modifiedActivities = response.map(activity => ({
        ...activity,
        date: activity.date.split("T")[0],
      }));
      setActivities(modifiedActivities);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingComponent />;

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelActivity={handleCancelSelectAcitivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEdit}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
