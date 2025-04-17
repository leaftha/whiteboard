import { collection, doc, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// todo
// 프로젝트 컴포넌트
// 화이트 보드 파일 클라우드로 저장
// 로그인 기능 후
// 유저에 따라 커서 색 다르게
// 초대 기능

const AddProject = () => {
  // const [prjList, setPrjList] = useState<{ id: string; roomeId?: string }[]>(
  //   []
  // );
  const [title, setTitle] = useState<string>("");

  // useEffect(() => {
  //   const ReadprjList = async () => {
  //     const prjListRef = collection(db, "users", "vltpcks", "projectList");
  //     const querySnapshot = await getDocs(prjListRef);

  //     const list = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setPrjList(list);
  //   };

  //   ReadprjList();
  // }, []);

  const newProject = async () => {
    const id = uuid();
    try {
      const docRef = await addDoc(collection(db, "project"), {
        projectName: title,
        roomId: id,
      });
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
