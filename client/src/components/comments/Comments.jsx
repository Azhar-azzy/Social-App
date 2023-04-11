import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { formatDistanceToNow } from "date-fns";
import enUS from "date-fns/locale/en-US";

const Comments = ({ post_id, comments, handleCommentAdded }) => {
  const { currentUser } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  //Temporary

  const handlePostComment = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:1201/activity/postComment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post_id, comment }),
        }
      );
      console.log(response);
      const newComment = {
        comment,
        created_at: new Date(),
        user: {
          id: currentUser.id,
          name: currentUser.name,
          profile_img: currentUser.profile_img,
        },
      };
      setComment("");
      handleCommentAdded(newComment);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="comments">
      <form onSubmit={handlePostComment} className="write">
        <img src={currentUser.profile_img} alt="" />
        <input
          type="text"
          placeholder="Write a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
      {comments.map((comment) => (
        <div key={`comment-${comment.id}`} className="comment">
          <img src={comment.user.profile_img} alt="" />
          <div className="info">
            <span>{comment.user.name}</span>
            <p>{comment.comment}</p>
          </div>
          <span className="date">
            {formatDistanceToNow(new Date(comment.created_at), {
              includeSeconds: true,
              addSuffix: false,
              locale: enUS,
            }).replace("about", "")}{" "}
            ago
          </span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
