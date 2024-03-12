import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../SocketConn";
import { AuthData } from "../AuthWrapper";
import { memo, useEffect, useState} from "react";
import IndicatorButton from "./IndicatorButton";
import Square from "./Square";
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

type Props = {
  roomData: Room;
  playerList: Player[];
};
const Board = memo(({ roomData, playerList}: Props) => {
  const params = useParams();
  const { user } = AuthData();
  const Navigate = useNavigate();
  const [board, setBoard] = useState(roomData.board);
  const [currentPlayer, setCurrentPlayer] = useState(roomData.firstPlayer);
  const [winner,setWinner] = useState("");
  useEffect(() => {
    
    socket.on("update-board-data", (player, board) => {
      setBoard(board);
        
        if (player == 0) {
          setCurrentPlayer(1);
        } else {
          setCurrentPlayer(0);
        }
        
    });

    socket.on('end-game-room',(board,winner)=>{
      setBoard(board);
      if(winner != "TIE"){
        setWinner(playerList[winner].name);
      }else{
        setWinner("TIE");
      }
      setTimeout(() =>{
        sessionStorage.removeItem("currentRoom");
        socket.emit('leave-room',params.id);
        Navigate('/lobby')
      }, 6000);

    })

    return () => {
      socket.off("update-board-data");
    };
  }, []);

  function handleSquareChange(index: number, value: string) {
    if(value != "") return;
    if (user.id == playerList[currentPlayer].id) {
      const tempBoard = board;
      tempBoard[index] = currentPlayer == 0 ? "X" : "O";
      setBoard(tempBoard);
      socket.emit("update-board-data", params.id, currentPlayer, tempBoard);
      currentPlayer == 0 ? setCurrentPlayer(1) : setCurrentPlayer(0);
    }
  
  }

  return (
    <div className="bg-lightBlack min-h-screen text-white">
      <div className="text-center">
        <div className="pt-10 p-2 font-bold text-lg md:text-3xl">
          <h1>{playerList[0].name} VS {playerList[1].name}</h1>
        </div>
        { winner?
          <div className="pt-5 flex justify-center">
          <div className="bg-emerald-500 p-4 rounded-md text-white">
            <div>Winner:</div>
            <span className="text-3xl">{winner}</span>
          </div>
          
        </div>:
        <div className="pt-5">
          {playerList.map((player,i) => {
            if(user.id == player.id){
              if(i==0){
                return <IndicatorButton key={i} playerType={i} currentPlayer={currentPlayer}/>
              }else{
                return <IndicatorButton key={i} playerType={i} currentPlayer={currentPlayer}/>
              }
            }
          })}
        </div>
        }
        
        
        {/* <button className="bg-red-400 p-4 rounded-md" onClick={exitGame}>
          Exit
        </button> */}
      </div>
      <div className="flex flex-col justify-center items-center pt-10">
        <div className="bg-[#6649C0] grid grid-cols-3 grid-rows-3 gap-3 rounded-lg p-3">
          {board.map((value, index) => {
            if (value)
              return (
                <Square
                  key={index}
                  index={index}
                  value={value}
                  selectSquare={handleSquareChange}
                />
              );
            else
              return (
                <Square
                  key={index}
                  index={index}
                  value={""}
                  selectSquare={handleSquareChange}
                />
              );
          })}
        </div>
      </div>
    </div>
  );
});

export default Board;
