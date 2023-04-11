import "./user.scss";
import { Link } from "react-router-dom";

const User = ({ user }) => {
  return (
    <div className="card">
      <div
        className="banner"
        style={{ backgroundImage: `url(${user.bg_img.replace(/\\/g, "/")})` }}
      >
        <img className="profileImg" alt="PROFILE" src={user.profile_img} />
      </div>
      <h2 className="name">{user.name}</h2>
      <div className="title">{user.email}</div>
      <div className="actions">
        <div className="follow-btn">
          <Link to={`/profile/${user.id}`}>
            <button>View Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default User;
