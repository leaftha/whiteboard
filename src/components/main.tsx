import { useAuth } from "../context/AuthContext";
import AddProject from "./Addproject";
import MyProject from "./Myproject";

const Main = () => {
  return (
    <div>
      <h1>Main</h1>
      <AddProject />
      <MyProject />
    </div>
  );
};

export default Main;
