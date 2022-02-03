import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";

function ProfileContent() {
  const panes = [
    { menuItem: "About", render: () => <Tab.Pane>About content</Tab.Pane> },
    { menuItem: "Photos", render: () => <ProfilePhotos /> },
    { menuItem: "Events", render: () => <Tab.Pane>Events content</Tab.Pane> },
    { menuItem: "Followers", render: () => <Tab.Pane>Followers content</Tab.Pane> },
    { menuItem: "Following", render: () => <Tab.Pane>Following content</Tab.Pane> },
  ];

  return <Tab menu={{ fluid: true, vertical: true }} menuPosition="right" panes={panes} />;
}

export default observer(ProfileContent);
