import "./share.scss";
import Image from "../../assets/img.png";
// import Map from "../../assets/map.png";
// import Friend from "../../assets/friend.png";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";

const Share = ({ handlePostAdded }) => {
  const { currentUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [shareText, setShareText] = useState("");
  const [shareImg, setShareImg] = useState(null);
  const [shareImgUrl, setShareImgUrl] = useState("");

  const handleShareImgChange = (event) => {
    setShareImg(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setShareImgUrl(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleCloseShareImg = () => {
    setShareImg(null);
    setShareImgUrl("");
    fileInputRef.current.value = "";
  };
  const sharePost = async (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("image", shareImg);
    formData.append("text", shareText);
    formData.append("user_id", currentUser.id);

    try {
      const response = await fetch("http://localhost:1201/posts", {
        method: "POST",
        body: formData,
      });
      const post = await response.json();
      console.log(post);
      handlePostAdded(post);
      alert("Posted Successfully!");
    } catch (error) {
      alert("Some error occurrred");
      console.log(error);
    }
    handleCloseShareImg();
    setShareText("");
  };

  return (
    <div className="share">
      <form onSubmit={sharePost} className="container">
        <div className="top">
          <img src={currentUser.profile_img} alt="" />
          {/* <input
            type="text"
            placeholder={`What's on your mind ${currentUser.name}?`}
            required
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
          /> */}
          <textarea
            placeholder={`What's on your mind ${currentUser.name}?`}
            required
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            rows="2"
          />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleShareImgChange}
              ref={fileInputRef}
            />
            {shareImgUrl && (
              <div>
                <button
                  style={{
                    background: "#FFF",
                    padding: "0.3rem 0.5rem",
                    position: "absolute",
                    fontWeight: "bold",
                    borderRadius: "100%",
                    fontSize: "1rem",
                  }}
                  onClick={handleCloseShareImg}
                >
                  X
                </button>
                <img
                  src={shareImgUrl}
                  alt="ShareImg"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>{shareImgUrl ? "Change" : "Add"} Image</span>
              </div>
            </label>

            {/* <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div> */}
          </div>
          <div className="right">
            <button className="themeButton" type="submit">
              Share
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Share;
