import { Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Segment, Header, Comment, Button } from "semantic-ui-react";
import * as Yup from "yup";

import MyTextArea from "../../../app/common/form/MyTextArea";
import { useStore } from "../../../app/stores/store";

interface Props {
  activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
  const {
    commentStore: { createHubConnection, stopHubConnection, comments, addComment },
  } = useStore();

  useEffect(() => {
    if (activityId) createHubConnection(activityId);

    return () => {
      stopHubConnection();
    };
  }, [activityId, createHubConnection, stopHubConnection]);

  return (
    <>
      <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: "none" }}>
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached clearing>
        <Comment.Group>
          {comments.map(({ id, image, userName, body, createdAt, displayName }) => (
            <Comment key={id}>
              <Comment.Avatar src={image || "/assets/user.png"} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${userName}`}>
                  {displayName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{createdAt}</div>
                </Comment.Metadata>
                <Comment.Text>{body}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}

          <Formik
            initialValues={{ body: "" }}
            onSubmit={(values, { resetForm }) => {
              addComment(values).then(() => resetForm());
            }}
            validationSchema={Yup.object({
              body: Yup.string().required(),
            })}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="ui form">
                <MyTextArea name="body" placeholder="Add comment" rows={3} />
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  floated="right"
                />
              </Form>
            )}
          </Formik>
        </Comment.Group>
      </Segment>
    </>
  );
});
