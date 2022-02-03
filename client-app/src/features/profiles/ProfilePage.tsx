import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";

import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

function ProfilePage() {
  const { userName } = useParams<{ userName?: string }>();
  const {
    profileStore: { loadProfile, loadingProfile, profile },
  } = useStore();

  useEffect(() => {
    if (userName) loadProfile(userName);
  }, [userName, loadProfile]);

  if (loadingProfile) return <LoadingComponent content="Loading profile..." />;
  if (!profile) return <div>No Profile</div>;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader />
        <ProfileContent />
      </Grid.Column>
    </Grid>
  );
}

export default observer(ProfilePage);
