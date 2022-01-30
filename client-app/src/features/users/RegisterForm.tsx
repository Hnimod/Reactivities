import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header } from "semantic-ui-react";
import * as Yup from "yup";

import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import ValidationErrors from "../errors/ValidationErrors";

function RegisterForm() {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ email: "", password: "", error: [], displayName: "", username: "" }}
      onSubmit={(values, { setErrors, setSubmitting }) => {
        userStore.register(values).catch(error => setErrors({ error }));
        setSubmitting(false);
      }}
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
        username: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required(),
      })}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form className="ui form error" autoComplete="off" onSubmit={handleSubmit}>
          <Header as="h2" content="Sign up to Activities" color="teal" textAlign="center" />
          <MyTextInput name="displayName" placeholder="Display Name" />
          <MyTextInput name="username" placeholder="Username" />
          <MyTextInput name="email" placeholder="Email" />
          <MyTextInput name="password" placeholder="Password" type="password" />
          <ErrorMessage
            name="error"
            render={() => <ValidationErrors errors={errors.error as string[]} />}
          />
          <Button
            positive
            content="Register"
            fluid
            type="Submit"
            loading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
}

export default observer(RegisterForm);
