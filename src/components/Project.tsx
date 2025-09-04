import React, { useEffect, useRef, useState } from "react";
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
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import styles from "../style/Project.module.css";
type Project = {
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
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState(false);
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

  const invite = async () => {
    try {
      if (!id) return;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("해당 이메일을 가진 유저가 없습니다.");
        return;
      }
      const prjDocRef = doc(db, "project", id);
      for (const userDoc of querySnapshot.docs) {
        const userRef = doc(db, "users", userDoc.id);
        await updateDoc(userRef, {
          projects: arrayUnion(id),
        });
        await updateDoc(prjDocRef, {
          users: arrayUnion(userDoc.id),
        });
      }
      setSuccess(true);
    } catch (error) {
      console.error("유저를 찾는 중 에러:", error);
    }
  };
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h2 className={styles.projectName}>
          {prj.projectName
            ? `${prj.projectName}에 함께 참여해보세요!`
            : "프로젝트 정보를 불러오는 중..."}
        </h2>
        <h1 className={styles.title}>프로젝트 초대</h1>

        <div className={styles.inviteSection}>
          <input
            className={styles.inviteInput}
            placeholder="초대할 이메일 입력"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            aria-label="초대할 이메일 입력"
            type="email"
          />
          <button
            className={styles.inviteButton}
            onClick={invite}
            aria-label="초대하기"
          >
            초대
          </button>
        </div>

        {success && <p className={styles.success}>초대완료!</p>}

        <div className={styles.linkSection}>
          <Link className={styles.link} to={`/whiteboard/${prj.roomId}`}>
            🧑‍🎨 화이트보드
          </Link>
          <Link className={styles.link} to={`/schedule/${prj.scheduleId}`}>
            📅 일정관리
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Project;
