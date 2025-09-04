import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import style from "../style/signup.module.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // 에러 메시지 상태
  const [loading, setLoading] = useState(false); // 로딩 상태

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 유효성 검사
    if (!formData.username.trim()) {
      setError("이름을 입력하세요.");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("이메일을 입력하세요.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      setLoading(false);
      return;
    }

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
        projects: [], // AddProject에서 사용하는 필드
      });

      console.log("사용자 문서 생성 완료");

      // 회원가입 성공 후 홈페이지로 이동
      window.location.href = "/";
    } catch (error: any) {
      console.error("회원가입 실패:", error.code, error.message);

      // 사용자 친화적인 에러 메시지
      switch (error.code) {
        case "auth/email-already-in-use":
          setError(
            "이미 사용 중인 이메일입니다. 다른 이메일을 사용하거나 로그인하세요."
          );
          break;
        case "auth/weak-password":
          setError("비밀번호는 최소 6자 이상이어야 합니다.");
          break;
        case "auth/invalid-email":
          setError("유효하지 않은 이메일 형식입니다.");
          break;
        default:
          setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
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
              disabled={loading}
              required
            />
            <input
              name="email"
              placeholder="이메일"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <input
              name="password"
              placeholder="비밀번호 (최소 6자)"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "가입 중..." : "가입하기"}
          </button>
          {error && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>
              {error}
            </p>
          )}
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
