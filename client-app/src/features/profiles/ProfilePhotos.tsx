import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

function ProfilePhotos() {
  const {
    profileStore: { isCurrentUser, profile, uploadPhoto, loading, setMainPhoto, deletePhoto },
  } = useStore();
  const { photos } = profile as Profile;
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState("");

  async function handleUploadPhoto(file: Blob) {
    await uploadPhoto(file);
    setAddPhotoMode(false);
  }

  async function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
    setTarget(e.currentTarget.name);
    await setMainPhoto(photo);
  }

  async function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
    setTarget(e.currentTarget.name);
    await deletePhoto(photo);
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(prev => !prev)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget onUpload={handleUploadPhoto} loading={loading} />
          ) : (
            <Card.Group itemsPerRow={5}>
              {photos?.map(photo => (
                <Card key={photo.id}>
                  <Image src={photo.url}></Image>
                  {isCurrentUser && (
                    <Button.Group fluid widths={2}>
                      <Button
                        basic
                        color="green"
                        content="Main"
                        name={"main" + photo.id}
                        loading={target === "main" + photo.id && loading}
                        disabled={photo.isMain}
                        onClick={e => handleSetMainPhoto(photo, e)}
                      />
                      <Button
                        basic
                        color="red"
                        icon="trash"
                        name={"delete" + photo.id}
                        loading={target === "delete" + photo.id && loading}
                        disabled={photo.isMain}
                        onClick={e => handleDeletePhoto(photo, e)}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}

export default observer(ProfilePhotos);
