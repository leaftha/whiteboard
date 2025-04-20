import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

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
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="이름"
          value={formData.username}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <input
          name="email"
          placeholder="이메일"
          type="email"
          value={formData.email}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <input
          name="password"
          placeholder="비밀번호"
          type="password"
          value={formData.password}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <button type="submit">가입하기</button>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </form>

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
};

export default SignUp;
