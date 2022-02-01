import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Image, List, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
  attendees: Profile[];
}

function ActivityListItemAttendee({ attendees }: Props) {
  return (
    <List horizontal>
      {attendees.map(({ userName, image, displayName, bio }) => (
        <Popup
          hoverable
          key={userName}
          trigger={
            <List.Item key={userName} as={Link} to={`/profiles/${userName}`}>
              <Image size="mini" circular src={image || "./assets/user.png"} />
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={{ userName, image, displayName, bio }} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
}

export default observer(ActivityListItemAttendee);
