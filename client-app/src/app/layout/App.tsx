import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Route, useLocation } from "react-router-dom";
import "./styles.css";

import NavBar from "../layout/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";

function App() {
  const { key } = useLocation();

  return (
    <>
      <Route path="/" exact component={HomePage} />
      <Route
        path="/(.+)"
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Route path="/activities" exact component={ActivityDashboard} />
              <Route path="/activities/:id" component={ActivityDetails} />
              <Route path={["/createActivity", "/manage/:id"]} key={key} component={ActivityForm} />
            </Container>
          </>
        )}
      />
      ;
    </>
  );
}

export default observer(App);
