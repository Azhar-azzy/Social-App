import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
// import PlaceIcon from "@mui/icons-material/Place";
// import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useParams } from "react-router";

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(currentUser);
  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);

  const [posts, setPosts] = useState({});

  const [myProfile, setMyProfile] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (!id || parseInt(id) === parseInt(currentUser.id)) {
      setMyProfile(true);
      setProfile(currentUser);
    } else fetchProfile(id);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [profile]);

  const fetchProfile = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:1201/users/profile/" + id,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      const user = await response.json();
      console.log(user);
      setProfile(user);
    } catch (error) {}
  };

  const handleProfileImgChange = (event) => {
    setProfileImg(event.target.files[0]);
    // updateProfileImg();
  };

  const handleCoverImgChange = (event) => {
    setCoverImg(event.target.files[0]);
  };

  useEffect(() => {
    if (profileImg) updateProfileImg();
    // eslint-disable-next-line
  }, [profileImg]);

  const updateProfileImg = async () => {
    const formData = new FormData();
    formData.append("user_id", currentUser.id);
    formData.append("profile_img", profileImg);

    console.log(profileImg);
    try {
      const response = await fetch(
        "http://localhost:1201/users/updateProfileImage",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setCurrentUser({ ...currentUser, profile_img: data.profile_img });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // console.log(coverImg);
    if (coverImg) updateCoverImg();
    // eslint-disable-next-line
  }, [coverImg]);

  const updateCoverImg = async () => {
    const formData = new FormData();
    formData.append("user_id", currentUser.id);
    formData.append("bg_img", coverImg);

    try {
      const response = await fetch(
        "http://localhost:1201/users/updateCoverImage",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setCurrentUser({ ...currentUser, bg_img: data.bg_img });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  // POSTS COMPONENT FUNCTIONS

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:1201/posts/${profile.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      const posts = await response.json();
      setPosts(posts);
      // console.log(posts);
    } catch (error) {
      console.log(error);
    }
  };

  // END POSTS COMPONENT FUNCTIONS
  return (
    <div className="profile">
      <div className="images">
        {/* {myProfile ? "MY Profile" : "User Profile"} */}
        <label htmlFor="bg_img">
          <img src={profile.bg_img} alt="Cover" className="cover" />
        </label>
        {myProfile && (
          <input
            type="file"
            onChange={handleCoverImgChange}
            id="bg_img"
            style={{ display: "none" }}
          />
        )}

        <label htmlFor="profile_img">
          <img src={profile.profile_img} alt="Profile" className="profilePic" />
        </label>
        {myProfile && (
          <input
            type="file"
            onChange={handleProfileImgChange}
            id="profile_img"
            style={{ display: "none" }}
          />
        )}
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{profile.name}</span>
            {!myProfile && <button>Follow</button>}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts posts={posts} />
      </div>
    </div>
  );
};

export default Profile;
