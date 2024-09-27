import React, { useRef, useState } from "react";
import style from "../module/contact.module.css";
import { Link } from "react-router-dom";
import { IoLogoInstagram, IoLogoLinkedin } from "react-icons/io";
import { FaWhatsapp, FaDiscord } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import axios from "axios";
import Loader from "./Loader";
import { toast, ToastContainer } from "react-toastify";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const nameRef = useRef("");
  const emailRef = useRef("");
  const messageRef = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const message = messageRef.current.value;

    axios
      .post(`/contact/api/v1/sendQuery`, {
        name,
        email,
        query: message,
      })
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        
        if (res.data.success) {
          toast.success(res.data.message, {
            autoClose: 1500,
            closeButton: false,
          });
        } else {
          toast.error(res.data.message, {
            autoClose: 1500,
            closeButton: false,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response.data.message, {
          autoClose: 1500,
          closeButton: false,
        });
      });
  };

  if (loading) {
    return <Loader />;
  }


  return (
    <>
      <ToastContainer />
  
        <title>Contact</title>


      <section id="contact" className={style.contactBody}>
        <div className={style.contactWrapper}>
          <form
            id="contact-form"
            className={style.contactForm}
            onSubmit={handleSubmit}
          >
            <div className={style.formGroup}>
              <div className={style.formControlWrapper}>
                <input
                  type="text"
                  className={style.formControl}
                  ref={nameRef}
                  id="name"
                  placeholder="NAME"
                  name="name"
                  required
                />
              </div>
            </div>
            <div className={style.formGroup}>
              <div className={style.formControlWrapper}>
                <input
                  type="email"
                  className={style.formControl}
                  id="email"
                  ref={emailRef}
                  placeholder="EMAIL"
                  name="email"
                  required
                />
              </div>
            </div>
            <textarea
              className={style.formControl}
              rows={10}
              placeholder="MESSAGE"
              name="message"
              ref={messageRef}
              required
            />
            <button>SEND</button>
          </form>
          <div className={style.directContactContainer}>
            <ul className={style.contactList}>
              <li className={style.listItem}>
                <Link
                  to="https://maps.app.goo.gl/maGsPTxSYLHVUrUo8"
                  target="_blank"
                  className={style.contactText}
                >
                  Vadodara, Gujarat
                </Link>
              </li>
              <li className={style.listItem}>
                <Link
                  className={style.contactText}
                  to="mailto:neuralize@msubaroda.ac.in"
                >
                  neuralize@msubaroda.ac.in
                </Link>
              </li>
            </ul>
            <hr />
            <ul className={style.socialMediaList}>
              <li>
                <Link
                  to="https://github.com/neuralize-club"
                  target="_blank"
                  className={style.socialIcon}
                >
                  <FaSquareGithub size={35} />
                </Link>
              </li>
              <li>
                <Link
                  to="https://chat.whatsapp.com/JVldc40f3UVHCmN9S8CWNf"
                  target="_blank"
                  className={style.socialIcon}
                >
                  <FaWhatsapp size={35} />
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.instagram.com/neuralizeclub"
                  target="_blank"
                  className={style.socialIcon}
                >
                  <IoLogoInstagram size={35} />
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.linkedin.com/company/neuralizeclub"
                  target="_blank"
                  className={style.socialIcon}
                >
                  <IoLogoLinkedin size={35} />
                </Link>
              </li>
              <li>
                <Link
                  to="https://discord.gg/644d6EmQ7R"
                  target="_blank"
                  className={style.socialIcon}
                >
                  <FaDiscord size={35} />
                </Link>
              </li>
            </ul>
            <hr />
            <div className={style.copyright}>© ALL RIGHTS RESERVED</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
