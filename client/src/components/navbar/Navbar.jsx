import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import {
  GroupOutlined,
  LogoutOutlined,
  SettingsOutlined,
} from "@mui/icons-material";

import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <>
      <div className="navbar">
        <div className="left" style={{ display: "contents" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src="http://localhost:3000/assets/img/logo.png"
              alt="logo"
              style={{ height: "35px" }}
            />
          </Link>
        </div>
        <div className="centerMenu desktop">
          <Link to="/" style={{ textDecoration: "none" }}>
            <HomeOutlinedIcon
              className={
                location.pathname === "/" ? "centerIcon active" : "centerIcon"
              }
            />
          </Link>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <GroupOutlined
              className={
                location.pathname === "/users"
                  ? "centerIcon active"
                  : "centerIcon"
              }
            />
          </Link>
          {darkMode ? (
            <WbSunnyOutlinedIcon className="centerIcon" onClick={toggle} />
          ) : (
            <DarkModeOutlinedIcon className="centerIcon" onClick={toggle} />
          )}
          <Link to="/" style={{ textDecoration: "none" }}>
            <NotificationsOutlinedIcon className="centerIcon" />
          </Link>
          <Link to="/" style={{ textDecoration: "none" }}>
            <SettingsOutlined className="centerIcon" />
          </Link>
        </div>
        <div className="right">
          <LogoutOutlined onClick={logout} />
          <Link
            to="/profile"
            className="user"
            style={{ textDecoration: "none" }}
          >
            <img src={currentUser ? currentUser.profile_img : null} alt="" />
            <span>{currentUser ? currentUser.name : null}</span>
          </Link>
        </div>
      </div>
      <div className="navbarExtended">
        <div className="centerMenu mobile">
          <Link to="/" style={{ textDecoration: "none" }}>
            <HomeOutlinedIcon
              className={
                location.pathname === "/" ? "centerIcon active" : "centerIcon"
              }
            />
          </Link>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <GroupOutlined
              className={
                location.pathname === "/users"
                  ? "centerIcon active"
                  : "centerIcon"
              }
            />
          </Link>
          {darkMode ? (
            <WbSunnyOutlinedIcon className="centerIcon" onClick={toggle} />
          ) : (
            <DarkModeOutlinedIcon className="centerIcon" onClick={toggle} />
          )}
          <Link to="/" style={{ textDecoration: "none" }}>
            <NotificationsOutlinedIcon className="centerIcon" />
          </Link>
          <Link to="/" style={{ textDecoration: "none" }}>
            <SettingsOutlined className="centerIcon" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
