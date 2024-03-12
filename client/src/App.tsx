import { Route, Routes, Navigate} from "react-router-dom";
import Home from "./Home";
import Lobby from "./Lobby";
import Layout from "./Layout.tsx";
import AuthRequire from "./AuthRequire.tsx";
import RestrictBoard from "./components/RestrictBoard.tsx";
import ErrorMessage from "./components/ErrorMessage.tsx";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Protected Router */}
          <Route element={<AuthRequire />}>
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/board/:id" element={<RestrictBoard/>}/>
          </Route>
          <Route path="/error" element={<ErrorMessage/>}/>
          <Route index path="*" element={<Navigate to={"/"}/>}/>
          
        </Route>
        
      </Routes>
  );
}

export default App;
