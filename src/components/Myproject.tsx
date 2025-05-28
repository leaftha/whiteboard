import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import AddProject from "./Addproject";
import style from "../style/Myproject.module.css";
import Loading from "./loading";

type Project = {
  id: string;
  roomId: string;
  projectName: string;
  users: string[];
};

const MyProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModal, setIsMadal] = useState(false);
  const [loadTime, setLoadTime] = useState(false);
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      if (loading || !currentUser) return;

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const projectIds: string[] = userData.projects || [];

          const projectPromises = projectIds.map(async (projectId) => {
            const projectDocRef = doc(db, "project", projectId);
            const projectDocSnap = await getDoc(projectDocRef);
            if (projectDocSnap.exists()) {
              const data = projectDocSnap.data();
              return {
                id: projectDocSnap.id,
                roomId: data.roomId,
                projectName: data.projectName,
                users: data.users,
              } as Project;
            }
            return null;
          });

          const projectDataList = await Promise.all(projectPromises);
          const filteredProjects = projectDataList.filter(
            (project): project is Project => project !== null
          );
          setProjects(filteredProjects);
        }
        setLoadTime(true);
      } catch (error) {
        console.error("프로젝트를 가져오는 중 에러:", error);
      }
    };

    fetchProjects();
  }, [currentUser, loading]);
  const handleClick = (project: Project) => {
    navigate(`/project/${project.id}`);
  };
  return (
    <div className={style.main}>
      <div className={style.titleContainer}>
        <h1>프로젝트</h1>
      </div>
      <div className={style.modalContainer}>
        <button
          className={style.modalBtn}
          onClick={() => {
            setIsMadal(!isModal);
          }}
        >
          추가
        </button>
      </div>
      {loadTime ? (
        <div className={style.grid}>
          {projects.map((project) => (
            <div
              key={project.id}
              className={style.gridItem}
              onClick={() => {
                handleClick(project);
              }}
            >
              <h1>{project.projectName || "제목 없음"}</h1>
              <p>인원수 : {project.users.length}</p>
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}

      {isModal && <AddProject />}
    </div>
  );
};

export default MyProject;
