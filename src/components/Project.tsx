import {
  collection,
  doc,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import style from "../style/Project.module.css";

type ProjectType = {
  id: string;
  roomId: string;
  scheduleId: string;
  projectName: string;
  users: string[];
  maxMenber: number;
  startDate: Date;
};

const Project: React.FC = () => {
  const [prj, setPrj] = useState<ProjectType>({
    id: "",
    roomId: "",
    scheduleId: "",
    projectName: "",
    users: [],
    maxMenber: 1,
    startDate: new Date(),
  });
  const [name, setName] = useState<string>("");
  let { id } = useParams();

  useEffect(() => {
    const loadPrj = async () => {
      if (!id) return;

      const prjDocRef = doc(db, "project", id);
      const querySnapshot = await getDoc(prjDocRef);

      if (querySnapshot.exists()) {
        const data = querySnapshot.data();
        setPrj({
          id: querySnapshot.id,
          roomId: data.roomId,
          projectName: data.projectName,
          users: data.users,
          maxMenber: data.maxMenber,
          startDate: data.startDate,
          scheduleId: data.scheduleId,
        });
      } else {
        console.log("No such document!");
      }
    };

    loadPrj();
  }, [id]);

  const invite = async (email: string) => {
    try {
      if (!id) return;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("해당 이메일을 가진 유저가 없습니다.");
        return;
      }
      const prjDocRef = doc(db, "projects", id);
      for (const userDoc of querySnapshot.docs) {
        const userRef = doc(db, "users", userDoc.id);
        await updateDoc(userRef, {
          projects: arrayUnion(id),
        });
        await updateDoc(prjDocRef, {
          users: arrayUnion(userDoc.id),
        });
      }
    } catch (error) {
      console.error("유저를 찾는 중 에러:", error);
    }
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>Project</h1>
      <h2 className={style.projectName}>{prj?.projectName}</h2>

      <div className={style.inviteSection}>
        <input
          className={style.inviteInput}
          placeholder="이메일 입력"
          onChange={(e) => setName(e.target.value)}
        />
        <button className={style.inviteButton} onClick={() => invite(name)}>
          초대
        </button>
      </div>

      <div className={style.linkSection}>
        <Link className={style.link} to={`/whiteboard/${prj.roomId}`}>
          화이트 보드
        </Link>
        <Link className={style.link} to={`/schedule/${prj.scheduleId}`}>
          일정관리
        </Link>
      </div>
    </div>
  );
};

export default Project;
