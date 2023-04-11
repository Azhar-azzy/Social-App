import User from "../../components/user/User";
import "./users.scss";

const Users = ({ users }) => {
  // console.log(users);

  return (
    <div className="home">
      <div className="posts profileCard">
        {users &&
          users.map((user) => {
            return <User key={user.email} user={user} />;
          })}
      </div>
    </div>
  );
};

export default Users;
