import React from "react";
import { Link } from "react-router-dom";
import styles from "../module/PaymentFailed.module.css";
import { FaExclamationCircle } from "react-icons/fa";

const PaymentFailed = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <FaExclamationCircle size={48} color="#FF0000" />
        </div>
        <h1 className={styles.title}>Payment Failed</h1>
        <p className={styles.message}>
          We're sorry, but your payment could not be processed. Please try again
          or contact support for assistance.
        </p>
        <Link to="/">
          <button className={styles.button}>Go back to home</button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailed;
