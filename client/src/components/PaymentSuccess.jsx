import React, { useEffect } from "react";
import styles from "../module/paymentsuccess.module.css";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios"; // Import axios to make API requests
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  useEffect(() => {
    // Call the paymentsuccess API on component render
    axios
      .get("/payment/api/v1/paymentsuccess", { withCredentials: true })
      .then((response) => {
        console.log("Payment Success API called:", response);
        toast.success("Your payment has been processed successfully!");
      })
      .catch((error) => {
        console.error("Error calling Payment Success API:", error);
        toast.error("There was an issue processing your payment.");
      });
  }, []); // Empty dependency array to run this effect only once after the component renders

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
          <button className={styles.button}>Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
