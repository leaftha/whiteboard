import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import style from "./signup.module.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
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
    // const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      console.log("회원가입 성공:", user);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: formData.email,
        name: formData.username,
        createdAt: new Date(),
      });
    } catch (error: any) {
      setError(error.message);
      console.error("회원가입 실패:", error.code, error.message);
    }
  };

  return (
    <div className={style.main}>
      <div className={style.body}>
        <h2 className={style.title}>회원가입</h2>
        <form className={style.form} onSubmit={handleSubmit}>
          <div className={style.formInput}>
            <input
              name="username"
              placeholder="이름"
              value={formData.username}
              onChange={handleChange}
            />
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
          <button type="submit">가입하기</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>

        <p className={style.description}>
          이미 계정이 있으신가요?{" "}
          <Link className={style.link} to="/login">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
