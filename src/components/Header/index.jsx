import React from "react";

import { useNavigate } from "react-router-dom";

import styles from "./Header.module.scss";
import { useDispatch } from "react-redux";
import { setShowTutorial } from "../../redux/slices/tutorialSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <div onClick={() => navigate("/")} className={styles.header_title}>
        <p>YouTube Cinema</p>
      </div>
      <div className={styles.help}>
        <svg
          onClick={() => {
            localStorage.setItem("infoTutorial", true);
            dispatch(setShowTutorial(true));
          }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#ffffff"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M12 8V8.5M12 12V16M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Header;
