
type Props = {
  currentPlayer: number;
  playerType: number;
};

function IndicatorButton({playerType, currentPlayer}:Props) {
  let bgClientPlayer = "bg-buttonBg";
  let bgOpponent = "bg-buttonBg";
  if(playerType == currentPlayer){
    if(playerType == 0)
      bgClientPlayer = "bg-rose-500"
    else
      bgClientPlayer = "bg-amber-500"
  }else{
    if(playerType == 0)
      bgOpponent = "bg-amber-500"
    else
      bgOpponent = "bg-rose-500"
  }
  return (
    <div className="flex justify-center gap-10">
      <div className={bgClientPlayer + " p-4 px-10 rounded-lg"}>
          <div className="text-xs pb-4">You</div>
          <div className="text-3xl">{playerType==0? "X" : "O"}</div>
        </div>
      
      <div className={bgOpponent+" p-4 px-6 rounded-lg"}>
        <div className="text-xs pb-4">Opponent</div>
        <div className="text-3xl">{playerType==0? "O" : "X"}</div>
      </div>
    </div>
  );
}

export default IndicatorButton;
