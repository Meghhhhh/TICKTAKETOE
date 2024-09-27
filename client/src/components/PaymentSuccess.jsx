import React from "react";
import styles from "../module/paymentsuccess.module.css";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <FaCheckCircle size={48} color="#00FF00" />
        </div>
        <h1 className={styles.title}>Payment Successful</h1>
        <p className={styles.message}>
          Great news! Your payment has been processed successfully. Thank you
          for your purchase.
        </p>
        <Link to="/">
        <button className={styles.button}> Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
