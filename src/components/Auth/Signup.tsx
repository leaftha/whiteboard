import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SignUp.module.css';

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
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>회원가입</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            name="username"
            placeholder="이름"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            name="email"
            type="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>가입하기</button>
        </form>
        <p className={styles.linkText}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
