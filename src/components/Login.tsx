import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import style from "../style/Login.module.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // 에러 메시지 상태

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      console.log("로그인 성공:", user);
      window.location.href = "/";
    } catch (error: any) {
      setError(error.message);
      console.error("로그인 실패:", error.code, error.message);
    }
  };

  return (
    <div className={style.main}>
      <div className={style.body}>
        <h2 className={style.title}>로그인</h2>
        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.formInput}>
            <input
              name="email"
              placeholder="이메일"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="password"
              placeholder="비밀번호"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">로그인</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>

        <p className={style.description}>
          아직 계정이 없으신가요?{" "}
          <Link className={style.link} to="/signup">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
