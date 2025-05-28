import style from "../style/loading.module.css";

export default function Loading() {
  return (
    <div className={style.container}>
      <span className={style.loader}></span>
    </div>
  );
}
