import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setConnect,
  setNickName,
  setRole,
} from "../../redux/slices/personalSlice";
import { setRoomId } from "../../redux/slices/roomSlice";
import socket from "../../socket";
import styles from "./Main.module.scss";

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [disableBut, setDisableBut] = React.useState(false);

  const onClickCreate = () => {
    socket.connect();
    setDisableBut(true);
    const hash = Math.random().toString(30).substring(2);
    const name = `User#${hash.substring(hash.length / 2)}`;
    dispatch(setNickName(name));
    socket.emit("createRoom", { name });
  };

  React.useEffect(() => {
    socket.on("created", ({ roomId }) => {
      dispatch(setRoomId(roomId));
      dispatch(setConnect());
      navigate(`/${roomId}`);
      dispatch(setRole("admin"));
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header} onClick={() => navigate("/")}>
        <span>YouTube Cinema</span>
      </div>
      <div className={styles.create_room}>
        <button onClick={onClickCreate} disabled={disableBut}>
          Создать комнату
        </button>
      </div>
      <div className={styles.info}>
        <p>Что такое YouTube Cinema?</p>
        <div className={styles.info_container}>
          <div className={styles.create}>
            <svg
              data-name="Livello 1"
              id="Livello_1"
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title />
              <path d="M64,0a64,64,0,1,0,64,64A64.07,64.07,0,0,0,64,0Zm0,122a58,58,0,1,1,58-58A58.07,58.07,0,0,1,64,122Z" />
              <path d="M90,61H67V38a3,3,0,0,0-6,0V61H38a3,3,0,0,0,0,6H61V90a3,3,0,0,0,6,0V67H90a3,3,0,0,0,0-6Z" />
            </svg>
            <span>Создай комнату для совместного просмотра</span>
          </div>
          <div className={styles.share}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span>Поделись ссылкой на комнату с друзьями</span>
          </div>
          <div className={styles.watch}>
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <g data-name="Streaming _System" id="Streaming__System">
                <path d="M392.1436,339.0046a53.9948,53.9948,0,0,0-52.7676-65.42q-1.3623,0-2.7383.0712a93.1387,93.1387,0,0,0-175.5156,43.4493q0,1.248.0341,2.5014-1.0209-.0315-2.0371-.0312a68.9929,68.9929,0,0,0-58.2734,105.9487,8,8,0,0,0,6.7529,3.7109H408.5908a8,8,0,0,0,7.3135-4.7578,69.3583,69.3583,0,0,0,5.9824-28.2866A70.1254,70.1254,0,0,0,392.1436,339.0046Zm10.9814,74.23H112.2a52.9989,52.9989,0,0,1,46.9189-77.66,51.1817,51.1817,0,0,1,5.1968.2715,18.8332,18.8332,0,0,1,5.3406,1.372,53.0291,53.0291,0,0,1,7.5593,3.82,7.9973,7.9973,0,0,0,11.1507-2.645,8.2236,8.2236,0,0,0-2.93-11.0864,62.9688,62.9688,0,0,0-8.0742-4.2393c-.1536-1.9926-.24-3.9863-.24-5.9633a77.14,77.14,0,0,1,147.4941-31.6236,8.005,8.005,0,0,0,8.584,4.6114,38.4262,38.4262,0,0,1,6.1758-.5083,38.0332,38.0332,0,0,1,37.99,37.9907c0,1.13-.0537,2.2547-.1533,3.3745a71.6333,71.6333,0,0,0-43.7871-3.0452,8,8,0,1,0,3.84,15.5323,55.72,55.72,0,0,1,13.3643-1.6187,55.14,55.14,0,0,1,29.1919,8.3186l.0185-.06a54.067,54.067,0,0,1,26.0464,46.114A53.4965,53.4965,0,0,1,403.125,413.235Z" />
                <path d="M227.58,189.0007a8,8,0,0,0,11.3144,11.3134,31.362,31.362,0,0,1,44.3018,0,8,8,0,0,0,11.3144-11.3134A47.3818,47.3818,0,0,0,227.58,189.0007Z" />
                <path d="M319.1377,172.3723a8,8,0,0,0,5.6572-13.6568,90.1559,90.1559,0,0,0-127.499,0A8,8,0,1,0,208.61,170.029a74.1546,74.1546,0,0,1,104.87,0A7.974,7.974,0,0,0,319.1377,172.3723Z" />
                <path d="M173.53,134.9494a123.9055,123.9055,0,0,1,175.03,0,8,8,0,1,0,11.3145-11.3135c-54.4941-54.4941-143.1611-54.4951-197.6592,0A8,8,0,1,0,173.53,134.9494Z" />
                <path d="M305.2324,330.9333,241.31,296.9455a7.5,7.5,0,0,0-11.02,6.6221v67.9756a7.4994,7.4994,0,0,0,11.02,6.622l63.9228-33.9878a7.4994,7.4994,0,0,0,0-13.2441Z" />
              </g>
            </svg>
            <span>Выберите ролик и наслаждайтесь просмотром</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
