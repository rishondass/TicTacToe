import Rooms from "./components/Rooms";
import {useState} from "react";



function Lobby() {
  const [errorMessages] = useState("");

  return (
    <>
    {errorMessages && (
        <div className="text-center">
          <span className="bg-red-500 text-white p-2 px-10 rounded-md">
            {errorMessages}
          </span>
        </div>
      )}
      
      <Rooms/>
    </>
  );
}

export default Lobby;
