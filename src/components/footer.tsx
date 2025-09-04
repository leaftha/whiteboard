import React from "react";
import style from "../style/footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer
      className={style.footer}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/image/footer-bg.png)`,
      }}
    >
      {/* content 필요 없으면 빈 div만 남겨도 됨 */}
      <div className={style.content}></div>
    </footer>
  );
};

export default Footer;
