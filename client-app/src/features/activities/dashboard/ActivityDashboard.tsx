import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Grid, GridColumn } from "semantic-ui-react";

import { useStore } from "../../../app/stores/store";
import ActivityList from "./ActivityList";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";

function ActivityDashboard() {
  const { activityStore } = useStore();
  const { loadingInitial, loadActivities, activityRegistry } = activityStore;

  useEffect(() => {
    if (activityRegistry.size <= 1) loadActivities();
  }, [loadActivities, activityRegistry]);

  if (loadingInitial) return <LoadingComponent content="Loading activities..." />;

  return (
    <Grid>
      <GridColumn width="10">
        <ActivityList />
      </GridColumn>
      <GridColumn width="6">
        <ActivityFilters />
      </GridColumn>
    </Grid>
  );
}

export default observer(ActivityDashboard);
