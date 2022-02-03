import { observer } from "mobx-react-lite";
import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

function ProfileHeader() {
  const { profileStore } = useStore();
  const { image, displayName } = profileStore.profile as Profile;

  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image avatar size="small" src={image || "/assets/user.png"}></Item.Image>
              <Item.Content verticalAlign="middle">
                <Header as="h1" content={displayName} />
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic label="Followers" value={5} />
            <Statistic label="Following" value={45} />
          </Statistic.Group>
          <Divider />
          <Reveal animated="move">
            <Reveal.Content visible style={{ width: "100%" }}>
              <Button fluid color="teal" content="Following" />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: "100%" }}>
              <Button
                fluid
                basic
                color={true ? "red" : "green"}
                content={true ? "Unfollow" : "Follow"}
              />
            </Reveal.Content>
          </Reveal>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default observer(ProfileHeader);
