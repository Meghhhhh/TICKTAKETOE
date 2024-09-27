import React from "react";
import style from "../module/loader.module.css";

const Loader = () => {
  return (
    <div className={style.outer}>
      <div className={style.container}>
        <div className={style.slice}></div>
        <div className={style.slice}></div>
        <div className={style.slice}></div>
        <div className={style.slice}></div>
        <div className={style.slice}></div>
        <div className={style.slice}></div>
      </div>
    </div>
  );
};

export default Loader;
