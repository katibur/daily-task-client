import React, { useEffect, useState } from "react";

const Toggle = () => {
  const [theme, setTheme] = useState(null);

  const [toggle, setToggle] = useState(true);
  const toggleClass = " transform translate-x-6";

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <div>
      <div
        className="md:w-14 md:h-7 w-12 h-6 flex items-center bg-gray-500 rounded-full p-1 cursor-pointer"
        onClick={() => {
          setToggle(!toggle);
          handleThemeSwitch();
        }}
      >
        <div
          className={
            "bg-black md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform duration-300 ease-in-out" +
            (toggle ? null : toggleClass)
          }
        ></div>
      </div>
    </div>
  );
};

export default Toggle;
