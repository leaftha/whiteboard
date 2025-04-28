import {
  collection,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// todo
// 프로젝트 컴포넌트
// 로그인 기능 후
// 유저에 따라 커서 색 다르게
// 초대 기능

const AddProject = () => {
  const [title, setTitle] = useState<string>("");
  const { currentUser, loading } = useAuth();

  const newProject = async () => {
    const id = uuid();
    try {
      const docRef = await addDoc(collection(db, "project"), {
        projectName: title,
        roomId: id,
        users: arrayUnion(currentUser?.uid),
      });

      if (currentUser?.uid) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          projects: arrayUnion(docRef.id),
        });
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <div>
      <h1>프로젝트 제목</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={newProject}>새 프로젝트 생성</button>
      {/* <ul>
        {prjList.map((prj) => (
          <li key={String(prj.id)}>
            <Link to="/whiteboard" state={{ roomeId: prj.roomeId }}>
              {prj.id}
            </Link>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default AddProject;
