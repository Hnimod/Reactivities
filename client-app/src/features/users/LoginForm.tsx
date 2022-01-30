import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header, Label } from "semantic-ui-react";

import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";

function LoginForm() {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ email: "", password: "", error: "" }}
      onSubmit={(values, { setErrors, setSubmitting }) => {
        userStore
          .login(values)
          .catch(error => setErrors({ error: "Incorrect email or password" }))
          .finally(() => setSubmitting(false));
      }}
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className="ui form" autoComplete="off" onSubmit={handleSubmit}>
          <Header as="h2" content="Login to Activities" color="teal" textAlign="center" />
          <MyTextInput name="email" placeholder="Email" />
          <MyTextInput name="password" placeholder="Password" type="password" />
          <ErrorMessage
            name="error"
            render={() => (
              <Label style={{ marginBottom: 10 }} basic color="red" content={errors.error} />
            )}
          />
          <Button positive content="Login" fluid type="Submit" loading={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
}

export default observer(LoginForm);
