import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import Users from "./pages/users/Users";

function App() {
  const { currentUser, isLoggedIn } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState(null);

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:1201/activity", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await response.json();
      setActivities(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("http://localhost:1201/users/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const users = await response.json();
      setUsers(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadUsers();
    fetchActivities();
    // eslint-disable-next-line
  }, [currentUser]);

  const Layout = () => {
    if (!isLoggedIn) return <Navigate to="/login" />;
    else
      return (
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <RightBar users={users} activities={activities} />
          </div>
        </div>
      );
  };

  const UserLayout = () => {
    return (
      <div>
        <Users users={users} />
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/users" element={<UserLayout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id?" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
