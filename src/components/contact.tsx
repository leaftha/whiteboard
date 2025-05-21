import style from "../style/contact.module.css";

function Contact() {
  return (
    <footer className={style.main}>
      <div className={style.title}>
        <h1>
          협업을 위한 실시간 플랫폼
          <br />
          아이디어를 나누는 화이트보드
        </h1>
        <p>언제 어디서나 팀과 함께 아이디어를 시각화하세요.</p>
        <div className={style.info}>
          <p>Email: yourname@example.com</p>
          <p>GitHub: github.com/yourusername</p>
          <p>© 2025 YourName. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Contact;
