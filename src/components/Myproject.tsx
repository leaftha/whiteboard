import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
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
                roomId: data.roomId || "",
                scheduleId: data.scheduleId || "",
                projectName: data.projectName || "",
                users: data.users || [],
                maxMenber: data.maxMenber || 1,
                startDate: data.startDate
                  ? new Date(data.startDate.seconds * 1000)
                  : new Date(),
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

  // 프로젝트를 좌우 2열로 나누기
  const mid = Math.ceil(projects.length / 2);
  const leftProjects = projects.slice(0, mid);
  const rightProjects = projects.slice(mid);

  return (
    <div className={style.main}>
      {/* 타이틀 섹션 */}
      <div className={style.titleSection}>
        <div className={style.titleText}>
          <h1>협업을 위한 길</h1>
          <p>답답한 프로그램에서 벗어나 웹에서의 회의</p>
          <p>화상만이 아닌 협업 화이트 보드를 활용한 회의</p>
        </div>

        {/* 버튼 3개 가로 정렬 */}
        <div className={style.titleButtons}>
          <button className={style.modalBtn} onClick={() => logout && logout()}>
            로그아웃
          </button>
          <button className={style.modalBtn}>프로젝트들</button>
          <button
            className={style.modalBtn}
            onClick={() => setIsModal(!isModal)}
          >
            추가
          </button>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <h2 className={style.featureTitle}>프로젝트 목록</h2>
      {loadTime ? (
        <div className={style.featureColumns}>
          <div className={style.featureColumn}>
            {leftProjects.map((project) => (
              <div
                key={project.id}
                className={style.featureItem}
                onClick={() => handleClick(project)}
              >
                <h3>{project.projectName || "제목 없음"}</h3>
                <p>인원수: {project.users.length}</p>
              </div>
            ))}
          </div>
          <div className={style.featureColumn}>
            {rightProjects.map((project) => (
              <div
                key={project.id}
                className={style.featureItem}
                onClick={() => handleClick(project)}
              >
                <h3>{project.projectName || "제목 없음"}</h3>
                <p>인원수: {project.users.length}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Loading />
      )}

      {/* 모달 */}
      {isModal && (
        <AddProject setProjects={setProjects} setIsModal={setIsModal} />
      )}
    </div>
  );
};

export default MyProject;
