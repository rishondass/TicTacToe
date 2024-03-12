import { useState, useEffect, memo } from "react";
import { socket } from "../SocketConn";
import { v4 as uuidv4 } from "uuid";
import { AuthData } from "../AuthWrapper";
import { useNavigate } from "react-router-dom";

type Player = {
  id: string;
  name: string;
  isAuthenticated: boolean;
};

interface Room {
  id: string;
  players: Player[];
  board: string[];
}

function Rooms() {
  const Navigate = useNavigate();
  const { user } = AuthData();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [createClick, setCreateClick] = useState(false);

  useEffect(() => {
    socket.emit("get-rooms-data", (rooms: []) => {
      if (rooms.length > 0) {
        setRooms(rooms);
      }
      if (rooms.length < 1 && sessionStorage.getItem("currentRoom")) {
        sessionStorage.removeItem("currentRoom");
      }
    });
    sessionStorage.getItem("currentRoom") &&
      Navigate("/board/" + sessionStorage.getItem("currentRoom"));
  }, []);

  useEffect(() => {
    const handleReceiveRooms = (data: Room[]) => {
      setRooms(data);
      if (data.length < 1 && sessionStorage.getItem("currentRoom")) {
        sessionStorage.removeItem("currentRoom");
      }
    };

    socket.on("receive-rooms", handleReceiveRooms);

    return () => {
      socket.off("receive-rooms", handleReceiveRooms);
    };
  }, [rooms]);

  function handleClick() {
    socket.emit("create-room", {
      id: uuidv4(),
      players: {},
      board: Array(9).fill(null),
    });
    setCreateClick(true);
  }
  const RoomInfo = memo(
    ({
      index,
      roomID,
      pCount,
    }: {
      index: number;
      roomID: string;
      pCount: number;
    }) => {
      const [playerCount, setPlayerCount] = useState(pCount || 0);

      function handleRoomJoin(roomID: string) {
        if (sessionStorage.getItem("currentRoom")) {
          console.error(
            "You're already in a room: " + sessionStorage.getItem("currentRoom")
          );
        } else {
          socket.emit(
            "join-room",
            roomID,
            user,
            (err: string, players: Player) => {
              if (err) {
                console.error(err);
              } else {
                setPlayerCount(Object.keys(players).length);
                Navigate("/board/" + roomID);
              }
            }
          );
        }
      }

      useEffect(() => {
        socket.on("join-room", (room: Room, index: number) => {
          setRooms((prevRooms) => {
            const arr = [...prevRooms];
            arr[index] = room;
            return arr;
          });
        });

        return () => {
          socket.off("join-room");
        };
      }, [rooms]);

      return (
        <div className="bg-orange-400 text-center p-2 w-full py-12 md:p-8 rounded-lg text-white">
          <div className="text-4xl md:text-2xl">Room #{index}</div>
          <div className="">Players: {playerCount}</div>
          <div>
            {playerCount < 2 ? (
              <button
                className="bg-emerald-400 text-white rounded-md px-10 py-7 md:px-10 md:py-3 mt-4"
                onClick={() => {
                  handleRoomJoin(roomID);
                }}
              >
                Join
              </button>
            ) : (
              <button className="bg-gray-300 text-white rounded-md p-4 mt-4">
                Join
              </button>
            )}
          </div>
        </div>
      );
    }
  );

  return (
    <div className="bg-lightBlack h-screen">
      <div className="flex xl:justify-center xl:gap-48 justify-between p-10">
        <button
          className="bg-rose-500 text-lg xl:w-36 w-28 rounded text-white p-4"
          onClick={() => {
            Navigate("/");
          }}
        >
          Back
        </button>
        {!createClick ? (
          <button
            className="bg-blue-500 xl:w-36 text-lg rounded text-white p-4"
            onClick={handleClick}
          >
            Add room
          </button>
        ) : (
          <button className="bg-gray-400 xl:w-36 text-lg rounded text-white p-4">
            Add room
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full p-4 gap-6 xl:gap-20">
        {rooms.map((room, index) => {
          return (
            <div key={room.id}>
              <RoomInfo
                index={++index}
                roomID={room.id}
                pCount={Object.keys(room.players).length}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Rooms;
