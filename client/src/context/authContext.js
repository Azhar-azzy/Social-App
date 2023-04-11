import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );

  const login = async (email, password) => {
    //TO DO
    try {
      const response = await fetch("http://localhost:1201/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        fetchUser();
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {}
  };

  const logout = async () => {
    // let token = localStorage.getItem("token");

    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const fetchUser = async () => {
    let token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:1201/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      data.token = token;
      console.log(data);
      setCurrentUser(data);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }

    // fetch("http://localhost:1201/users/profile", {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     data.profile_img = "http://localhost:1201" + data.profile_img;
    //     setCurrentUser(data);
    //     localStorage.setItem("user", JSON.stringify(data));
    //   })
    //   .catch((error) => console.log(error));
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, currentUser, setCurrentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*
setCurrentUser({
  id: 1,
  name: "John Doe",
  profilePic:
    "https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600",
});
  // useEffect(() => {
  //   localStorage.setItem("user", JSON.stringify(currentUser));
  // }, [currentUser]);
  */
