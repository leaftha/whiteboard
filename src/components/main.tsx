import { useAuth } from "../context/AuthContext";
import AddProject from "./Addproject";

const Main = () => {
  const { currentUser, loading } = useAuth();

  return (
    <div>
      <h1>Main</h1>
      <AddProject />
    </div>
  );
};

export default Main;
