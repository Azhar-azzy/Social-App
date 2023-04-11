import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
// import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { formatDistanceToNow } from "date-fns";
import enUS from "date-fns/locale/en-US";

const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [postState, setPostState] = useState(post);

  const togglePostLike = async (post_id, is_liked) => {
    try {
      await fetch("http://localhost:1201/activity/togglePostLike", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id }),
      });
      // const data = await response.json();
      // console.log(data);
      if (is_liked) {
        setPostState({
          ...postState,
          is_liked: !is_liked,
          like_count: postState.like_count - 1,
        });
      } else {
        setPostState({
          ...postState,
          is_liked: !is_liked,
          like_count: postState.like_count + 1,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // TO Add New Comment On Website
  const handleCommentAdded = (newComment) => {
    console.log(newComment);
    setPostState((prevPost) => ({
      ...prevPost,
      post_comments: [newComment, ...prevPost.post_comments],
    }));
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.user.profile_img} alt="" />
            <div className="details">
              <Link
                to={`/profile/${postState.user.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{postState.user.name}</span>
              </Link>
              <span className="date">
                {formatDistanceToNow(new Date(postState.upload_datetime), {
                  includeSeconds: true,
                  addSuffix: false,
                  locale: enUS,
                }).replace("about", "")}{" "}
                ago
              </span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{postState.text}</p>
          <img src={postState.image} alt="" />
        </div>
        <div className="info">
          <div
            className="item"
            onClick={() => togglePostLike(postState.id, postState.is_liked)}
          >
            {postState.is_liked ? (
              <FavoriteOutlinedIcon className="favouriteIcon" />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
            {postState.like_count} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {postState.post_comments.length} Comments
          </div>
        </div>
        {commentOpen && (
          <Comments
            post_id={postState.id}
            handleCommentAdded={handleCommentAdded}
            comments={postState.post_comments}
          />
        )}
      </div>
    </div>
  );
};

export default Post;
