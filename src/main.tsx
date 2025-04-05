import { collection, doc, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Main = () => {
  const [prjList, setPrjList] = useState<{ id: String; roomeId?: String }[]>(
    []
  );

  useEffect(() => {
    const ReadprjList = async () => {
      const prjListRef = collection(db, "users", "vltpcks", "projectList");
      const querySnapshot = await getDocs(prjListRef);

      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPrjList(list);
    };

    ReadprjList();
  }, []);

  const newProject = async () => {
    const id = uuid();
    try {
      const docRef = await addDoc(collection(db, "project"), {
        projectName: "",
        roomeId: id,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  console.log(prjList);
  return (
    <div>
      <h1>Main</h1>
      <button onClick={newProject}>새 프로젝트 생성</button>
      <ul>
        {prjList.map((prj) => (
          <li key={String(prj.id)}>
            <Link to="/whiteboard" state={{ roomeId: prj.roomeId }}>
              {prj.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Main;
