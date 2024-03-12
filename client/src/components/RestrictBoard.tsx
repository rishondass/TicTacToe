import { useEffect, useState } from "react";
import { socket } from "../SocketConn";
import { useParams, useNavigate } from "react-router-dom";
import { AuthData } from "../AuthWrapper";
import WaitingRoom from "./WaitingRoom";

type Player = {
  id: string;
  name: string;
  isAuthenticated: boolean;
};

type Room = {
  id: string;
  players: Record<string, Player>;
  board: string[];
  firstPlayer: number;
};

const updateRoom = (params: string, user: string): Promise<Room> => {
  return new Promise((resolve, reject) => {
    socket.emit("get-rooms-data", (cb: Room[]) => {
      const foundRoom = cb.find((room) => room.id == params && room.players[user]);
      if (foundRoom) {
        resolve(foundRoom);
      } else {
        reject("Room not found");
      }
    });
  });
};

const RestrictBoard = () => {
  const [room, setRoom] = useState<Room>();
  const params = useParams();
  const { user } = AuthData();
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      socket.emit("exit-room", params.id, user);
      navigate('/lobby');
    });
  }, []);
  
  useEffect(() => {
    updateRoom(params.id || "", user.id)
      .then((nRoom) => {
        setRoom(nRoom);
        sessionStorage.setItem("currentRoom", nRoom.id);
      })
      .catch((err) => {
        console.log(err);
        navigate("/error");
      });
  }, []);

  useEffect(() => {
    const handleUpdateRoom = (nRoom: Room) => {
      setRoom(nRoom);
    };

    socket.on("update-room", handleUpdateRoom);

    return () => {
      socket.off("update-room", handleUpdateRoom);
    };
  }, []);

  useEffect(()=>{
    const sessionUser = sessionStorage.getItem("user");
    const sessionRoom = sessionStorage.getItem("currentRoom");
  
    if (sessionUser && sessionRoom) {
      socket.emit("reconnect-room", sessionRoom, JSON.parse(sessionUser), (err: string, room: Room) => {
        if(err) console.error(err);
        if(room){
          setRoom(room);
          
        } 
        
      });
    }
  },[])

  function exitGame() {
    socket.emit("exit-room", params.id, user);
    sessionStorage.removeItem("currentRoom");
    navigate("/lobby");
  }

  if (room) {
    return <WaitingRoom roomData={room} playerList={Object.values(room.players)} exitGame={exitGame} />;
  }
};

export default RestrictBoard;
