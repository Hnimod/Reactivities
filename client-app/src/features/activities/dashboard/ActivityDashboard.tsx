import { Grid, GridColumn } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";

type Props = {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  selectActivity: (id: string) => void;
  cancelActivity: () => void;
  editMode: boolean;
  openForm: (id: string) => void;
  closeForm: () => void;
  createOrEdit: (activity: Activity) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  submitting: boolean;
};

const ActivityDashboard = ({
  activities,
  selectActivity,
  cancelActivity,
  selectedActivity,
  editMode,
  openForm,
  closeForm,
  createOrEdit,
  deleteActivity,
  submitting,
}: Props) => {
  return (
    <Grid>
      <GridColumn width="10">
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
          submitting={submitting}
        />
      </GridColumn>
      <GridColumn width="6">
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            cancelActivity={cancelActivity}
            openForm={openForm}
          />
        )}
        {editMode && (
          <ActivityForm
            closeForm={closeForm}
            activity={selectedActivity}
            createOrEdit={createOrEdit}
            submitting={submitting}
          />
        )}
      </GridColumn>
    </Grid>
  );
};

export default ActivityDashboard;
