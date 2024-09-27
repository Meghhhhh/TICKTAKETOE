import React from 'react'
import style from '../module/home.module.css'
import image from "../assets/download.png";

const Home = () => {
  return (
    <div className={style.imageContainer} id="secondImage">
      <div className={style.textOverlay}>
        <p>
          Neuralize empowers students to explore and master the realms of
          Python, Artificial Intelligence, and Machine Learning. As part of the
          Neuralize Club community, you'll thrive on curiosity, collaboration,
          and innovation. We offer hands-on workshops, insightful seminars, and
          engaging projects that cater to both beginners and advanced learners.
          Neuralize Club serves as a gateway to becoming a tech expert. Join us
          at Neuralize Club to transform your ideas into groundbreaking
          solutions and shape the future of technology.
        </p>
      </div>
      <img src={image} alt="" className={style.paraImg} />
    </div>
  );
}

export default Home