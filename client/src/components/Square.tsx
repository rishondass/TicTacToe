
type Props = {
  index: number;
  value: string;
  selectSquare: (index:number,value:string)=>void;
};

function Square({value,index,selectSquare}: Props) {
  let colors = "bg-buttonBg";
  if(value=="X")
    colors = "bg-rose-500"
  else if(value == "O")
    colors = "bg-amber-500"
  return <button onClick={()=>(selectSquare(index,value))} className={colors + " text-5xl p-4 font-extrabold w-20 h-20 rounded-md"}>
    {value}
  </button>;
  
}

export default Square;
