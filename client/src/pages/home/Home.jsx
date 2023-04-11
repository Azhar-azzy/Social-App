// import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect, useState } from "react";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState({});

  // SHARE COMPONENT
  const handlePostAdded = (newPost) => {
    console.log(newPost);
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };
  // END SHARE COMPONENT

  // POSTS COMPONENT FUNCTIONS
  useEffect(() => {
    // console.log("HERE");
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:1201/posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const posts = await response.json();
      setPosts(posts);
      console.log(posts);
    } catch (error) {
      console.log(error);
    }
  };
  // END POSTS COMPONENT FUNCTIONS

  return (
    <div className="home">
      {/* <Stories /> */}
      <Share handlePostAdded={handlePostAdded} />
      <Posts posts={posts} />
    </div>
  );
};

export default Home;
