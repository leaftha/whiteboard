import React from "react";
import "./MainPage.css";

const MainPage: React.FC = () => {
  return (
    <div className="main-page">
      <header className="main-header">
        <h1>화이트보드 & 일정 관리</h1>
        <p>효율적인 작업과 일정 관리를 한 곳에서!</p>
      </header>

      <section className="feature-section">
        <div className="feature-card">
          <h2>화이트보드</h2>
          <p>아이디어를 자유롭게 표현하고 공유하세요.</p>
        </div>
        <div className="feature-card">
          <h2>일정 관리</h2>
          <p>스케줄을 한눈에 보고 체계적으로 관리하세요.</p>
        </div>
      </section>

      <footer className="main-footer">
        <small>© 2025 Twokimbakpi All rights reserved.</small>
      </footer>
    </div>
  );
};

export default MainPage;
