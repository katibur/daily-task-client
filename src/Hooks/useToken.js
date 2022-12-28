import { useEffect, useState } from "react";

const useToken = (email) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (email) {
      if (email.accessToken) {
        localStorage.setItem("accessToken", email.accessToken);
        setToken(email.accessToken);
      }
    }
  }, [email]);
  return [token];
};

export default useToken;
