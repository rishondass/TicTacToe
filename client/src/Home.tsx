import { useState, ChangeEvent, memo, useEffect } from "react";
import { socket } from "./SocketConn";
import { useNavigate } from "react-router-dom";
import { AuthData } from "./AuthWrapper";
import dice from "./assets/images/dice.png";
import { nouns, adjectives } from "./Nouns";

const Home = memo(() => {
  const authData = AuthData();

  const [nameInput, setNameInput] = useState<string>(
    authData.user.name ? authData.user.name : ""
  );
  const [classes, setClasses] = useState<string>(
    "md:ml-11 ml-8 border-2 rounded-md outline-none p-2"
  );
  const [errorMessages, setErrorMessages] = useState<string>("");

  const Navigate = useNavigate();

 

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    event.target.value
      ? (setNameInput(event.target.value),
        setClasses("ml-11 border-2 rounded-md outline-none p-2"))
      : (setNameInput(event.target.value),
        setClasses(
          "ml-11 border-2 border-red-400 rounded-md outline-none p-2"
        ));
  }
  function handleNext() {
    if (nameInput) {
      setErrorMessages("");
      authData
        .login(nameInput)
        .then(() => {
          socket.emit(
            "change-username",
            { ...authData.user, name: nameInput },
            (message: string) => {
              message === "200" ? Navigate("lobby") : setErrorMessages(message);
            }
          );
        })
        .catch((error: string) => {
          console.log(error);
        });
    } else {
      setClasses("ml-11 border-2 border-red-400 rounded-md outline-none p-2");
    }
  }
  function handleRandomName() {
    setNameInput(
      adjectives[Math.floor(Math.random() * adjectives.length)] +
        "_" +
        nouns[Math.floor(Math.random() * nouns.length)]
    );
    setClasses("ml-11 border-2 rounded-md outline-none p-2");
  }

  useEffect(() => {
    authData.user?.name != "" &&
      authData.user.isAuthenticated &&
      (socket.emit("remove-player", authData.user),
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...authData.user, name: "", isAuthenticated: true })
      ));
  }, []);

  return (
    <div className="bg-lightBlack h-screen flex flex-col justify-center items-center">
      {errorMessages && (
        <div className="text-center">
          <span className="bg-red-500 text-white p-2 px-10 rounded-md">
            {errorMessages}
          </span>
        </div>
      )}

      <h1 className="text-emerald-400 text-5xl font-semibold text-center pt-10 pb-5">
        Tic Tac Toe
      </h1>
      <div className="p-5 flex items-center justify-center">
        <input
          type="text"
          name=""
          placeholder="name"
          className={classes}
          onChange={handleInput}
          value={nameInput}
        />
        <img
          className="object-contain ml-2 justify-self-end cursor-pointer"
          alt="dice_img"
          src={dice}
          onClick={handleRandomName}
        />
      </div>
      <div className="text-center">
        <button
          className="bg-emerald-400 rounded-md p-3 px-10 text-white"
          onClick={handleNext}
        >
          next
        </button>
      </div>
    </div>
  );
});

export default Home;
