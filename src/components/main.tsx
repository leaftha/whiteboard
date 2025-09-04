import React from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "../style/main.module.css";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import Footer from "./footer";
import TitleSection from "./TitleSection";

const Main: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const onLogOut = () => {
    auth.signOut();
    navigate("/");
  };

  const goToProjects = () => {
    navigate("/projects");
  };

  return (
    <div className={style.main}>
      {/* 타이틀 영역 */}
      <TitleSection onGoToProjects={goToProjects} />

      {/* 주요 기능 제목 */}
      <div className={style.subTitle}>
        <h1>주요 기능</h1>
      </div>

      {/* 주요 기능 2x2 그리드 */}
      <div className={style.descriptionContainer}>
        <div className={style.descriptionBody}>
          <article className={style.descriptionGridItem}>
            <img
              className={style.descriptionImg}
              src="image/descriptionImg1.gif"
              alt="화이트보드"
            />
            <div className={style.description}>
              <h1>화이트보드</h1>
              <p>
                팀원들과 아이디어를 시각적으로 공유하고 정리할 수 있는 협업
                도구입니다.
              </p>
            </div>
          </article>

          <article className={style.descriptionGridItem}>
            <img
              className={style.descriptionImg}
              src="image/descriptionImg2.gif"
              alt="실시간 동기화"
            />
            <div className={style.description}>
              <h1>실시간 동기화</h1>
              <p>
                다른 팀원들과 동시에 수정 가능하며 의견을 실시간으로 공유합니다.
              </p>
            </div>
          </article>

          <article className={style.descriptionGridItem}>
            <img
              className={style.descriptionImg}
              src="image/descriptionImg3.gif"
              alt="일정 관리"
            />
            <div className={style.description}>
              <h1>일정관리 시스템</h1>
              <p>
                프로젝트 일정 추가 및 관리, 팀원과 실시간 공유가 가능합니다.
              </p>
            </div>
          </article>

          <article className={style.descriptionGridItem}>
            <img
              className={style.descriptionImg}
              src="image/main1.jpg"
              alt="기타 기능"
            />
            <div className={style.description}>
              <h1>기타 기능</h1>
              <p>추가적인 팀 협업 기능을 제공합니다.</p>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Main;
