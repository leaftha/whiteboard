import { Link, useNavigate } from "react-router-dom";
import style from "../style/main.module.css";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import Footer from "./footer";

const Main = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const onLogOut = () => {
    auth.signOut();
    navigate("/");
  };
  return (
    <div className={style.main}>
      <div className={style.titleComponent}>
        <div className={style.titleDescription}>
          <h1 className={style.titleWord}>
            팀 프로젝트 협업을 <br />
            위한 길
          </h1>
          <p>답답한 프로그램에서 벗어나 웹에서의 회의</p>
          <p>화상만이 아닌 협업 화이트 보드를 활용한 회의</p>
          <div className={style.logComponent}>
            {!loading && (
              <>
                {currentUser === null ? (
                  <>
                    <Link className={style.firstBtn} to="/login">
                      로그인
                    </Link>
                    <Link className={style.secondBtn} to="/signup">
                      회원가입
                    </Link>
                  </>
                ) : (
                  <>
                    <h1 onClick={onLogOut} className={style.firstBtn}>
                      로그아웃
                    </h1>
                    <Link className={style.secondBtn} to="/projects">
                      프로젝트들
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <img className={style.titleImg} src="image/main1.jpg" alt="main img" />
      </div>
      <div className={style.subTitle}>
        <h1>주요 기능</h1>
      </div>
      <div className={style.descriptionContainer}>
        <div className={style.descriptionBody}>
          <article className={style.descriptionGridItem}>
            <img
              className={style.descriptionImg}
              src="image/descriptionImg1.gif"
              alt="description Img"
            />
            <div className={style.description}>
              <h1>화이트보드</h1>
              <p>
                팀원들과 아이디어를 시각적으로 공유하고 정리할 수 있는 협업
                도구입니다.
                <br />
                직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.
              </p>
            </div>
          </article>

          <article className={style.descriptionGridItem}>
            <img
              className={style.descriptionImg}
              src="image/descriptionImg2.gif"
              alt="description Img"
            />
            <div className={style.description}>
              <h1>실시간 동기화</h1>
              <p>
                다른 팀원들과 함께 수정할 수 있는 협업 화이트보드입니다.
                <br />
                실시간으로 서로의 의견을 나눌 수 있습니다.
              </p>
            </div>
          </article>

          <article className={style.descriptionGridItemColumn}>
            <img
              className={style.descriptionImg}
              src="image/descriptionImg3.gif"
              alt="description Img"
            />
            <div className={style.descriptionColuem}>
              <h1>일정관리 시스템</h1>
              <p>
                프로젝트 일정을 손쉽게 추가하고 관리하세요.
                <br />
                팀원들과 실시간 대화로 효율적인 협업 환경을 제공합니다.
              </p>
            </div>
          </article>
          <article className={style.descriptionGridItem}>
            <img
              className={style.descriptionImg}
              src="image/descriptionImg4.gif"
              alt="main img"
            />
            <div className={style.description}>
              <h1>프로젝트 팀원 초대</h1>
              <p>
                프로젝트에 함께할 팀원을 이메일로 초대하세요. <br />
                초대한 사용자는 자동으로 프로젝트 목록에 추가되며, 협업이 즉시
                시작됩니다.
              </p>
            </div>
          </article>

          <article className={style.descriptionGridItem}>
            <img
              className={style.descriptionImg}
              src="image/descriptionImg5.gif"
              alt="main img"
            />
            <div className={style.description}>
              <h1>화상통화 기능</h1>
              <p>
                실시간 화상통화를 통해 얼굴을 보며 음성으로 회의할 수 있습니다.{" "}
                <br />
                화이트보드 기능과 함께 사용하면 더욱 정확하고 효율적인 협업이
                가능합니다.
              </p>
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
