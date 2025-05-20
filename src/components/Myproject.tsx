import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import AddProject from "./Addproject";

type Project = {
  id: string;
  roomId: string;
  projectName: string;
  users: string[];
};

const MyProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModal, setIsMadal] = useState(false);
  const { currentUser, loading } = useAuth();

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
      } catch (error) {
        console.error("프로젝트를 가져오는 중 에러:", error);
      }
    };

    fetchProjects();
  }, [currentUser, loading]);

  return (
    <div>
      <h1>내 프로젝트</h1>
      <button
        onClick={() => {
          setIsMadal(!isModal);
        }}
      >
        새 프로젝트
      </button>
      <ul>
        {projects.map((project) => (
          <Link to={`/project/${project.id}`} key={project.id}>
            {project.projectName || "제목 없음"}
          </Link>
        ))}
      </ul>

      {isModal && <AddProject />}
    </div>
  );
};

export default MyProject;
