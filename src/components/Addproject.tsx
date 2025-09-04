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

type AddProjectProps = {
  setProjects: React.Dispatch<React.SetStateAction<any[]>>; // Project 타입을 맞추려면 Project[]로 수정 가능
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddProject: React.FC<AddProjectProps> = ({ setProjects, setIsModal }) => {
  const [title, setTitle] = useState<string>("");
  const { currentUser } = useAuth();

  const newProject = async () => {
    if (!title.trim() || !currentUser) return;

    const id = uuid();
    try {
      // 프로젝트 컬렉션에 새 프로젝트 추가
      const docRef = await addDoc(collection(db, "project"), {
        projectName: title,
        roomId: id,
        users: arrayUnion(currentUser.uid),
      });

      // 사용자 문서에 프로젝트 ID 추가
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        projects: arrayUnion(docRef.id),
      });

      // MyProject 컴포넌트 상태에 새 프로젝트 반영
      setProjects((prev) => [
        ...prev,
        {
          id: docRef.id,
          projectName: title,
          roomId: id,
          scheduleId: "",
          users: [currentUser.uid],
          maxMenber: 1,
          startDate: new Date(),
        },
      ]);

      setTitle(""); // 입력 초기화
      setIsModal(false); // 모달 닫기
    } catch (e) {
      console.error("프로젝트 생성 중 에러:", e);
    }
  };

  return (
    <div
      style={{ padding: "20px", background: "#f9f9f9", borderRadius: "10px" }}
    >
      <h2>프로젝트 생성</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="프로젝트 제목"
        style={{
          padding: "8px",
          marginRight: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={newProject}
        style={{
          padding: "8px 15px",
          borderRadius: "6px",
          background: "#558bcf",
          color: "white",
          border: "none",
        }}
      >
        새 프로젝트 생성
      </button>
    </div>
  );
};

export default AddProject;
