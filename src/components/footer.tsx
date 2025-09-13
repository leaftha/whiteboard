import React from "react";
import style from "../style/Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer
      className={style.footer}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/image/footer-bg.png)`,
      }}
    >
      <div className={style.content}></div>
    </footer>
  );
};

export default Footer;
