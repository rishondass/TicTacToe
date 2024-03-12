import {AuthData} from "./AuthWrapper"
import {Outlet, Navigate} from "react-router-dom"

function AuthRequire() {
  const {user} = AuthData();

  return (
    user.isAuthenticated&&user.name ? <Outlet/> : <Navigate to="/"/>
  )
}

export default AuthRequire