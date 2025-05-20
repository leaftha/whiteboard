import { Link } from "react-router-dom";
import style from "./main.module.css";

const Main = () => {
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
            <Link className={style.login} to="/login">
              로그인
            </Link>
            <Link className={style.signup} to="/signup">
              회원가입
            </Link>
          </div>
        </div>
        <img className={style.titleImg} src="image/main1.jpg" alt="main img" />
      </div>

      <div>
        <h1>설명</h1>
      </div>
    </div>
  );
};

export default Main;
