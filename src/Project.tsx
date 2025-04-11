import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { Link } from "react-router-dom";

type ProjectType = {
  id: string;
  roomId: string;
  projectName: string;
};

const Project = () => {
  const [prj, setPrj] = useState<ProjectType | null>(null);
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

  console.log(prj);
  return (
    <div>
      <h1>Project</h1>
      <h1>{prj?.projectName}</h1>
      <Link to="/whiteboard" state={{ roomeId: prj?.roomId }}>
        화이트 보드
      </Link>
    </div>
  );
};

export default Project;
