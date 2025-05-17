import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import style from "./nav.module.css";

const Nav = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();
  const onLogOut = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div className={style.main}>
      <div className={style.title}>
        <h1>WhiteBoard</h1>
      </div>
      <div className={style.menu}>
        {currentUser === null ? (
          <Link to="/login" className={style.link}>
            Login
          </Link>
        ) : (
          <h1 onClick={onLogOut}>LogOut</h1>
        )}
      </div>
    </div>
  );
};

export default Nav;
