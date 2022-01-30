import { useEffect } from "react";
import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Route, Switch, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./styles.css";

import { useStore } from "../stores/store";
import NavBar from "../layout/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import NotFound from "../../features/errors/NotFound";
import TestErrors from "../../features/errors/TestError";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/users/LoginForm";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";

function App() {
  const { key } = useLocation();
  const {
    commonStore: { setApploaded, appLoaded, token },
    userStore: { getUser },
  } = useStore();

  useEffect(() => {
    (async function () {
      if (token) await getUser();
      setApploaded();
    })();
  }, [getUser, setApploaded, token]);

  if (!appLoaded) return <LoadingComponent content="Loading app..." />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
      <Route path="/" exact component={HomePage} />
      <Route
        path="/(.+)"
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route path="/activities" exact component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route
                  path={["/createActivity", "/manage/:id"]}
                  key={key}
                  component={ActivityForm}
                />
                <Route path="/errors" component={TestErrors} />
                <Route path="/server-error" component={ServerError} />
                <Route path="/login" component={LoginForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
      ;
    </>
  );
}

export default observer(App);
