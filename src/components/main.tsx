import { Link, useNavigate } from "react-router-dom";
import style from "../style/main.module.css";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import IntroduceTitle from "./introduceTitle";

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

      <IntroduceTitle />

      <div className={style.descriptionContainer}>
        <div className={style.descriptionBody}>
          <article className={style.descriptionGridItem}>
            <div>
              <h1>title</h1>
            </div>
            <div>
              <img
                className={style.titleImg}
                src="image/main1.jpg"
                alt="main img"
              />
            </div>
            <div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
                illum explicabo odio aliquam consequatur, doloremque, vitae quas
                est voluptates dignissimos quaerat ut commodi in. Architecto
                atque quam quo molestiae provident?
              </p>
            </div>
          </article>

          <article className={style.descriptionGridItem}>
            <div>
              <h1>title</h1>
            </div>
            <div>
              <img
                className={style.titleImg}
                src="image/main1.jpg"
                alt="main img"
              />
            </div>
            <div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
                illum explicabo odio aliquam consequatur, doloremque, vitae quas
                est voluptates dignissimos quaerat ut commodi in. Architecto
                atque quam quo molestiae provident?
              </p>
            </div>
          </article>
          <article className={style.descriptionGridItemColumn}>
            <div>
              <h1>title</h1>
            </div>
            <div>
              {/* <img
                className={style.titleImg}
                src="image/main1.jpg"
                alt="main img"
              /> */}
            </div>
            <div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
                illum explicabo odio aliquam consequatur, doloremque, vitae quas
                est voluptates dignissimos quaerat ut commodi in. Architecto
                atque quam quo molestiae provident?
              </p>
            </div>
          </article>
          <article className={style.descriptionGridItem}>
            <div>
              <h1>title</h1>
            </div>
            <div>
              <img
                className={style.titleImg}
                src="image/main1.jpg"
                alt="main img"
              />
            </div>
            <div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
                illum explicabo odio aliquam consequatur, doloremque, vitae quas
                est voluptates dignissimos quaerat ut commodi in. Architecto
                atque quam quo molestiae provident?
              </p>
            </div>
          </article>
          <article className={style.descriptionGridItem}>
            <div>
              <h1>title</h1>
            </div>
            <div>
              <img
                className={style.titleImg}
                src="image/main1.jpg"
                alt="main img"
              />
            </div>
            <div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
                illum explicabo odio aliquam consequatur, doloremque, vitae quas
                est voluptates dignissimos quaerat ut commodi in. Architecto
                atque quam quo molestiae provident?
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default Main;
