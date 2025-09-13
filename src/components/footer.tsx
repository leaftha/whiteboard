<<<<<<< Updated upstream
import React from "react";
=======
import Contact from "./contact";
>>>>>>> Stashed changes
import style from "../style/Footer.module.css";

function Footer() {
  return (
<<<<<<< Updated upstream
    <footer
      className={style.footer}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/image/footer-bg.png)`,
      }}
    >
      <div className={style.content}></div>
    </footer>
=======
    <div className={style.footerContainer}>
      <div className={style.footerWrapper}>
        <div className={style.footerContent}>
          <Contact />
        </div>
      </div>
    </div>
>>>>>>> Stashed changes
  );
}

export default Footer;
