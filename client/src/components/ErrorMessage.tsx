
import {Link} from "react-router-dom"

function ErrorMessage() {
  return <div className="items-center flex flex-col gap-4 justify-center w-full h-screen text-3xl bold bg-blue-400 text-white">
    <div>ERROR COULDN'T FIND YOUR ROOM!</div>
    <div><Link className="bg-red-500 text-white rounded-lg text-xl p-3" to="/lobby">Lobby</Link></div>
    </div>;
}

export default ErrorMessage;
