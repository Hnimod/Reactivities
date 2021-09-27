import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Header, List } from "semantic-ui-react";

interface Activity {
  id: string;
  title: string;
}

function App() {
  const [data, setData] = useState<Activity[]>([]);

  useEffect(() => {
    (async function () {
      const response = await axios.get("http://localhost:5000/api/activities");
      setData(response.data);
    })();
  }, []);

  return (
    <div>
      <Header as="h2" icon="users" content="Reactivities" />
      <List>
        {data.map((item, index) => (
          <List.Item key={item.id}>{item.title}</List.Item>
        ))}
      </List>
    </div>
  );
}

export default App;
