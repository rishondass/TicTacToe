import Board from './Board';


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
  exitGame: ()=>void;
}

function WaitingRoom({roomData,playerList, exitGame}:Props) {
  
  if(playerList.length > 1){
    return <Board roomData={roomData} playerList={Object.values(roomData.players).sort((playerA, playerB) => playerA.id.localeCompare(playerB.id))}/>;
    
  }
  return <div className="bg-lightBlack h-screen flex items-center justify-center flex-col">
    <div className="text-4xl xl:text-6xl text-white">Waiting for players...</div>
    <button className="bg-rose-500 text-white px-10 mt-10 p-4 rounded-md" onClick={exitGame}>Exit</button>
  </div> 
  
}

export default WaitingRoom