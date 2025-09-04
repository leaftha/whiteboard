import React from "react";
import { Link } from "react-router-dom";
import style from "../style/titleSection.module.css";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";

interface TitleSectionProps {
  onGoToProjects?: () => void;
}

const TitleSection: React.FC<TitleSectionProps> = ({ onGoToProjects }) => {
  const { currentUser, loading } = useAuth();

  const onLogOut = (): void => {
    auth.signOut();
    window.location.href = "/";
  };

  return (
    <section className={style.titleSection}>
      <div className={style.leftContent}>
        <h1 className={style.title}>협업을 위한 길</h1>
        <p className={style.description}>
          답답한 프로그램에서 벗어나 웹에서의 회의
        </p>
        <p className={style.description}>
          화상만이 아닌 협업 화이트 보드를 활용한 회의
        </p>
        <div className={style.buttons}>
          {!loading &&
            (currentUser ? (
              <>
                <button className={style.primaryBtn} onClick={onLogOut}>
                  로그아웃
                </button>
                <button className={style.secondaryBtn} onClick={onGoToProjects}>
                  프로젝트들
                </button>
              </>
            ) : (
              <>
                <Link className={style.primaryBtn} to="/login">
                  로그인
                </Link>
                <Link className={style.secondaryBtn} to="/signup">
                  회원가입
                </Link>
              </>
            ))}
        </div>
      </div>
      <div className={style.rightImage}>
        <img className={style.image} src="image/main1.jpg" alt="메인 이미지" />
      </div>
    </section>
  );
};

export default TitleSection;
