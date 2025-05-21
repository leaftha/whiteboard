import Contact from "./contact";
import style from "../style/Footer.module.css";

function Footer() {
  return (
    <div className={style.footerContainer}>
      <div className={style.footerWrapper}>
        <div className={style.footerContent}>
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default Footer;
