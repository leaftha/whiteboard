import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuid } from "uuid";

const Main = () => {
  console.log(process.env.REACT_APP_FireBase_apiKey);
  const newProject = async () => {
    const id = uuid();
    try {
      const docRef = await addDoc(collection(db, "project"), {
        roomId: id,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <h1>Mainb</h1>
      <button onClick={newProject}>새 프로젝트 생성</button>
    </div>
  );
};

export default Main;
