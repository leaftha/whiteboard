import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import AddProject from "./Addproject";

const MyProject = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (loading) return;
      if (!currentUser) return;

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const projectIds: string[] = userData.projects || [];

          const projectPromises = projectIds.map(async (projectId) => {
            const projectDocRef = doc(db, "project", projectId);
            const projectDocSnap = await getDoc(projectDocRef);
            console.log(projectId, projectDocSnap.data());
            return projectDocSnap.exists()
              ? { id: projectDocSnap.id, ...projectDocSnap.data() }
              : null;
          });

          const projectDataList = await Promise.all(projectPromises);
          const filteredProjects = projectDataList.filter(
            (project) => project !== null
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
      <AddProject />
      <h1>내 프로젝트</h1>
      <ul>
        {projects.map((project) => (
          <Link to={`./project/${project.id}`} key={project.id}>
            {project.projectName || "제목 없음"}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default MyProject;
