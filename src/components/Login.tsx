// src/components/Login.tsx
import React, { useState } from "react";

const Login = () => {
  // 상태 관리: 이메일, 비밀번호
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 입력값 변화 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 로그인 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 정보:", formData);
    // 여기에 백엔드 전송 또는 로직 추가 가능 (예: 인증 API 호출)
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
      </form>

      {/* 회원가입 페이지로 이동하는 링크 */}
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        아직 계정이 없으신가요? <a href="/signup">회원가입</a>
      </p>
    </div>
  );
};

export default Login;
