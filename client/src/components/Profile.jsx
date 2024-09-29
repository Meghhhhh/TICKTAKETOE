import React, { useRef, useEffect, useState } from "react";
import styles from "../module/profile.module.css";
import images from "../assets";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoBookmark } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { logoutUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";

const Profile = () => {
  const currentPassword = useRef("");
  const newPassword = useRef("");
  const repeatPassword = useRef("");
  const nameRef = useRef("");
  const phoneNumberRef = useRef("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    profilePicture: "",
    authType: "",
    phoneNumber: "",
  });

  const [overdueDetails, setOverdueDetails] = useState(null); // New state for overdue details

  useEffect(() => {
    axios
      .get("/users/api/v1/getUser", { withCredentials: true })
      .then((response) => {
        const { name, email, profilePicture, authType, phoneNumber } =
          response.data.data;
        setUserDetails({ name, email, profilePicture, authType, phoneNumber });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch user details");
      });
  }, []);

  const handleDelete = () => {
    axios
      .post("/users/api/v1/deleteUser", { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          toast.success("Account Deleted successfully!");
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 1500);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to delete account");
      });
  };
  const handleClick = () => {
    const currentPass = currentPassword.current.value;
    const newPass = newPassword.current.value;
    const repeatPass = repeatPassword.current.value;
    if (currentPass && newPass && repeatPass) {
      if (newPass !== repeatPass) {
        toast.error("New password and confirm password do not match");
        return;
      }

      axios
        .post(
          "/auth/api/v1/local/resetPassword",
          {
            currentPassword: currentPass,
            newPassword: newPass,
            repeatPassword: repeatPass,
          },
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res);
          toast.success("Password changed successfully");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to change password");
        });
    }
  };

  const handleLogout = () => {
    axios
      .post(
        `/auth/api/v1/${userDetails.authType}/logout`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Logged out successfully!");
          setTimeout(() => {
            window.location.href = "/auth/login";
            dispatch(logoutUser());
          }, 1500);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to log out");
      });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;

    // Check if the phone number is exactly 10 digits
    if (phoneNumber.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    // Check if current data is different from edited data
    if (name === userDetails.name && phoneNumber === userDetails.phoneNumber) {
      toast.info("No changes detected");
      return;
    }

    axios
      .put(
        "/users/api/v1/updateUser",
        { name, phoneNumber },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          toast.success("Profile updated successfully");
          setUserDetails((prevDetails) => ({
            ...prevDetails,
            name: response.data.data.name,
            phoneNumber: response.data.data.phoneNumber,
          }));
        } else {
          toast.error("Failed to update profile");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update profile");
      });
  };

  const handleFetchOverdueFees = () => {
    axios
      .get("/users/api/v1/calculateOverdueFees", { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.data);

          setOverdueDetails(response.data.data);
          toast.success(response.data.message);
        } else {
          toast.error("Failed to fetch overdue fees");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch overdue fees");
      });
  };

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51PWtVZDuAWgKsNtLWlTBbBMPiEHIo9hs4ChscB7WaDf8MwCaKradFm0r7TE5gfT4r1AlVEvbI13RsmeM0ECu6RBA004zi06fDH"
    );

    // Hardcoded dummy data
    const dummyProducts = [
      {
        name: "Books",
        image:
          "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
        price: overdueDetails?.overallFee, // Price in cents
        quantity: 1,
      },
    ];

    const body = {
      products: dummyProducts,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch("/payment/api/v1/create-checkout-session", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error);
        toast.error(`user must be logged in to checkout`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`user must be logged in to checkout`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.avatarUpload}>
          <div className={styles.avatarPreview}>
            <div id="imagePreview">
              <img src={images.profile} className={`${styles.photo}`} alt="" />
            </div>
          </div>
        </div>
        <div className={styles.formContainer}>
          <div className={`${styles.passwordUser}`}>
            <div className={styles.inputField}>
              <input
                type="text"
                required
                defaultValue={userDetails.email}
                readOnly
              />
              <label>EmailId</label>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.tabs}>
          <div className={styles.tab}>
            <input
              type="checkbox"
              name="accordion"
              id="chck2"
              className={styles.accordianInput}
            />
            <label className={styles.tabLabel} htmlFor="chck2">
              Edit Profile
            </label>
            <div className={styles.tabContent}>
              <div className={`${styles.password}`}>
                <form onSubmit={handleUpdateProfile}>
                  <div className={styles.inputField}>
                    <input
                      type="text"
                      required
                      defaultValue={userDetails.name}
                      ref={nameRef}
                    />
                    <label>UserName</label>
                  </div>

                  <div className={styles.inputField}>
                    <input
                      type="text"
                      required
                      defaultValue={userDetails.phoneNumber}
                      ref={phoneNumberRef}
                    />
                    <label>Phone Number</label>
                  </div>
                  <button type="submit" className={styles.button}>
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {userDetails.authType === "local" && (
          <div className={styles.tabs}>
            <div className={styles.tab}>
              <input
                type="checkbox"
                name="accordion"
                id="chck1"
                className={styles.accordianInput}
              />
              <label className={styles.tabLabel} htmlFor="chck1">
                Change Password
              </label>
              <div className={styles.tabContent}>
                <div className={`${styles.password}`}>
                  <div className={styles.inputField}>
                    <input type="password" required ref={currentPassword} />
                    <label>Current Password</label>
                  </div>
                  <div className={styles.inputField}>
                    <input type="password" required ref={newPassword} />
                    <label>New Password</label>
                  </div>
                  <div className={styles.inputField}>
                    <input type="password" required ref={repeatPassword} />
                    <label>Confirm Password</label>
                  </div>
                </div>

                <button
                  onClick={handleClick}
                  className={styles.button}
                  type="submit"
                  style={{ width: "100%" }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        <div className={styles.btnContainer}>
          <Link
            to="/bookmarks"
            className={styles.button}
            style={{ width: "100%", textDecoration: "none" }}
          >
            <IoBookmark size={20} style={{ padding: "0 5px" }} /> Bookmarks
          </Link>
        </div>
        <div className={styles.btnContainer}>
          <Link
            to="/addresources"
            className={styles.button}
            style={{ width: "100%", textDecoration: "none" }}
          >
            Add Resource
          </Link>
        </div>
        <div className={styles.btnContainer}>
          <Link
            to="/dashboard"
            className={styles.button}
            style={{ width: "100%", textDecoration: "none"}}
          >
            Dashboard
          </Link>
        </div>
        <div className={styles.btnContainer}>
          <button onClick={handleDelete} className={styles.button}>
            Delete Account
          </button>

          <button onClick={handleLogout} className={styles.button}>
            Logout
          </button>
        </div>
        {/* New button for paying overdue fees */}
        <div className={styles.btnContainer}>
          <button onClick={handleFetchOverdueFees} className={styles.button}>
            Overdue Fees
          </button>
          {overdueDetails && overdueDetails.overallFee !== 0 && (
            <button
              className={styles.button}
              onClick={makePayment}
              type="button"
            >
              Pay ₹{overdueDetails.overallFee}
            </button>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default Profile;
