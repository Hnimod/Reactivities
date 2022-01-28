import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useParams, useHistory, Link } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";

import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import MyDateInput from "../../../app/common/form/MyDateInput";

const ActivityForm = () => {
  const history = useHistory();
  const { activityStore } = useStore();
  const { loading, updateActivity, createActivity, loadActivity, loadingInitial } = activityStore;
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    date: null,
    description: "",
    category: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (id) loadActivity(id).then(activity => setActivity(activity!));
  }, [id, loadActivity]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required(),
    category: Yup.string().required(),
    date: Yup.string().required("Date is required").nullable(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  const handleFormSubmit = (activity: Activity) => {
    activity.id
      ? updateActivity(activity).then(a => {
          if (a?.id) history.push(`/activities/${a.id}`);
        })
      : createActivity(activity).then(a => {
          if (a?.id) history.push(`/activities/${a.id}`);
        });
  };

  if (loadingInitial) return <LoadingComponent />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        initialValues={activity}
        enableReinitialize
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput placeholder="Title" name="title" />
            <MyTextArea placeholder="Description" name="description" rows={3} />
            <MySelectInput options={categoryOptions} placeholder="Category" name="category" />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />
            <Button
              loading={loading}
              floated="right"
              positive
              type="submit"
              content="Submit"
              disabled={!isValid || isSubmitting || !dirty}
            />
            <Button as={Link} to="/activities" floated="right" type="button" content="Cancel" />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ActivityForm);
