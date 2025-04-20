import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
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
      // 여기서 리디렉션 등 추가 가능 (예: window.location.href = "/home")
    } catch (error: any) {
      setError(error.message);
      console.error("로그인 실패:", error.code, error.message);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">로그인</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        아직 계정이 없으신가요? <a href="/signup">회원가입</a>
      </p>
    </div>
  );
};

export default Login;
