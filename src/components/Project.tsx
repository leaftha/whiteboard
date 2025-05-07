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
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import VideoCall from "./VideoCall";

type ProjectType = {
  id: string;
  roomId: string;
  projectName: string;
};

const Project = () => {
  const [prj, setPrj] = useState<ProjectType>({
    id: "",
    roomId: "",
    projectName: "",
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
        });
      } else {
        console.log("No such document!");
      }
    };

    loadPrj();
  }, [id]);

  const invite = async (email: string) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        for (const userDoc of querySnapshot.docs) {
          console.log("찾은 유저:", userDoc.id, userDoc.data());

          const userRef = doc(db, "users", userDoc.id);
          await updateDoc(userRef, {
            projects: arrayUnion(id),
          });
        }
      } else {
        console.log("해당 이메일을 가진 유저가 없습니다.");
      }
    } catch (error) {
      console.error("유저를 찾는 중 에러:", error);
    }
  };

  return (
    <div>
      <h1>Project</h1>
      <h1>{prj?.projectName}</h1>
      <div>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <button
          onClick={() => {
            invite(name);
          }}
        >
          초대
        </button>
      </div>
      <Link to="/whiteboard" state={{ roomeId: prj.roomId }}>
        화이트 보드
      </Link>

      <VideoCall />
    </div>
  );
};

export default Project;
