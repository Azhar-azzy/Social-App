import { Link } from "react-router-dom";
import "./rightBar.scss";
import { formatDistanceToNow } from "date-fns";
import enUS from "date-fns/locale/en-US";

const RightBar = ({ activities, users }) => {
  // console.log(activities);
  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {Array.isArray(users) &&
            users.map((user) => {
              return (
                <div key={user.name} className="user">
                  <div className="userInfo">
                    <img src={user.profile_img} alt="User" />
                    <span>{user.name}</span>
                  </div>
                  <div className="buttons">
                    <Link to={`/profile/${user.id}`}>
                      <button>View Profile</button>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="item">
          <span>Latest Activities</span>
          {Array.isArray(activities) &&
            activities.map((row) => {
              return (
                <div key={row.id} className="user d-block">
                  <div className="userInfo">
                    <img src={row.user.profile_img} alt="User" />
                    <p>
                      <span>{row.user.name}</span> {row.activity}
                    </p>
                  </div>
                  <span style={{ fontSize: "small", float: "right" }}>
                    {formatDistanceToNow(new Date(row.created_at), {
                      includeSeconds: true,
                      addSuffix: false,
                      locale: enUS,
                    }).replace("about", "")}{" "}
                    ago
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
