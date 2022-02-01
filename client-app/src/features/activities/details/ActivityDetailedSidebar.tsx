import { Segment, List, Label, Item, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity;
}

function ActivityDetailedSidebar({ activity: { attendees, host } }: Props) {
  return (
    <>
      <Segment
        textAlign="center"
        style={{ border: "none" }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {attendees!.length} {attendees!.length <= 1 ? "Person" : "People"} going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees!.map(({ userName, image, displayName }) => (
            <Item style={{ position: "relative" }} key={userName}>
              {userName === host?.userName && (
                <Label style={{ position: "absolute" }} color="orange" ribbon="right">
                  Host
                </Label>
              )}
              <Image size="tiny" src={image || "/assets/user.png"} />
              <Item.Content verticalAlign="middle">
                <Item.Header as="h3">
                  <Link to={`/profiles/${userName}`}>{displayName}</Link>
                </Item.Header>
                <Item.Extra style={{ color: "orange" }}>Following</Item.Extra>
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </>
  );
}

export default observer(ActivityDetailedSidebar);
