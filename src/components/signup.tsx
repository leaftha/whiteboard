import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 링크 이동용

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('회원가입 정보:', formData);
    // 여기에 백엔드 전송 또는 로직 추가 가능
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="이름"
          value={formData.username}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <input
          name="email"
          placeholder="이메일"
          type="email"
          value={formData.email}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <input
          name="password"
          placeholder="비밀번호"
          type="password"
          value={formData.password}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <button type="submit">가입하기</button>
      </form>

      {/* 로그인 페이지로 이동하는 링크 */}
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
};

export default SignUp;
