import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import AddProject from "./Addproject";
import style from "../style/Myproject.module.css";
import Loading from "./loading";

type Project = {
  id: string;
  roomId: string;
  scheduleId: string;
  projectName: string;
  users: string[];
  maxMenber: number;
  startDate: Date;
};

const MyProject: React.FC = () => {
  const { currentUser, loading, logout } = useAuth(); // logout optional
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [loadTime, setLoadTime] = useState(false);

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
                startDate: data.startDate,
                maxMenber: data.maxMenber,
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
    <>
      {loadTime ? (
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
                <p>
                  인원수 : {project.users.length} / {project.maxMenber}
                </p>
                <p>
                  프로젝트 시작일 :
                  {project.startDate
                    ? (project.startDate instanceof Timestamp
                        ? project.startDate.toDate()
                        : project.startDate
                      ).toLocaleDateString()
                    : "시작일 없음"}
                </p>
              </div>
            ))}
          </div>

          {isModal && (
            <AddProject setProjects={setProjects} setIsMadal={setIsMadal} />
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default MyProject;
