import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import {
  GroupOutlined,
  LogoutOutlined,
  SettingsOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img
            src="http://localhost:3000/assets/img/logo.png"
            alt="logo"
            style={{ height: "35px" }}
          />
        </Link>
        <HomeOutlinedIcon />
        <VerifiedUserOutlined />
        <GroupOutlined />
        <SettingsOutlined />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        {/* <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div> */}
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <LogoutOutlined onClick={logout} />
        <Link to="/profile" className="user" style={{ textDecoration: "none" }}>
          <img src={currentUser ? currentUser.profile_img : null} alt="" />
          <span>{currentUser ? currentUser.name : null}</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
