import {
  collection,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { SetStateAction, Dispatch, useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import style from "../style/Addproject.module.css";

interface AddProjectProps {
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type Project = {
  id: string;
  roomId: string;
  scheduleId: string;
  projectName: string;
  users: string[];
  maxMenber: number;
  startDate: Date;
};

const AddProject = ({ setIsModal, setProjects }: AddProjectProps) => {
  const [title, setTitle] = useState<string>("");
  const [menber, setMenber] = useState<number>(1);
  const { currentUser } = useAuth();

  const newProject = async (e: FormEvent) => {
    e.preventDefault();
    if (title === "") {
      alert("제목을 입력하세요");
      return;
    }
    const id = uuid();
    const currentDay = new Date();
    try {
      const docschedulesRef = await addDoc(collection(db, "schedules"), {
        done: [],
        inProgress: [],
        todo: [],
      });
      const docRef = await addDoc(collection(db, "project"), {
        projectName: title,
        roomId: id,
        users: arrayUnion(currentUser?.uid),
        maxMenber: menber,
        startDate: currentDay,
        scheduleId: docschedulesRef.id,
      });

      if (currentUser?.uid) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          projects: arrayUnion(docRef.id),
        });
      }
      const newProject = {
        id: docRef.id,
        roomId: id,
        projectName: title,
        users: currentUser?.uid ? [currentUser.uid] : [],
        maxMenber: menber,
        startDate: currentDay,
        scheduleId: docschedulesRef.id,
      };

      setProjects((prev) => [...prev, newProject]);
      setIsModal(false);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <div className={style.main} onClick={() => setIsModal(false)}>
      <form
        className={style.formContainer}
        onSubmit={(e) => newProject(e)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={style.formContent}>
          <div className={style.inpuBox}>
            <label>프로젝트 제목</label>
            <input
              placeholder="프로젝트 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={style.inpuBox}>
            <label>인원 수</label>
            <input
              type="number"
              value={menber}
              min={1}
              max={4}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMenber(Number(e.target.value))
              }
            />
          </div>
        </div>
        <div className={style.buttonBox}>
          <button>새 프로젝트 생성</button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
