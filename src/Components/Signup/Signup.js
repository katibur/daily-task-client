import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthProvider/AuthProvider";
import useToken from "../../Hooks/useToken";

const SignUp = () => {
  const { createUser, updateUser, googleSignIn } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [signupError, setSignupError] = useState("");

  const [createdUserEmail, setCreatedUserEmail] = useState("");
  const [token] = useToken(createdUserEmail);

  if (token) {
    navigate("/");
  }

  const signupHandler = (data) => {
    // console.log(data);
    setSignupError("");

    createUser(data.email, data.password)
      .then((Result) => {
        const user = Result.user;
        console.log(user);
        toast.success("Successfully Created.");
        const userInfo = {
          displayName: data.name,
        };
        updateUser(userInfo)
          .then(() => {
            saveUser(data.email, data.name);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        setSignupError(err);
        console.error(err);
      });
  };

  const saveUser = (email, name) => {
    const user = {
      email,
      name,
    };
    // console.log(user);
    fetch("https://daily-task-server-seven.vercel.app/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        setCreatedUserEmail(data.email);
      });
  };

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((res) => {
        const user = res.user;
        console.log(user);
        const userEmail = user.email;
        const name = user.displayName;
        saveSocialUser(userEmail, name);
      })
      .catch((err) => console.error(err));
  };

  const saveSocialUser = (email, name) => {
    const user = {
      email,
      name,
    };
    fetch("https://daily-task-server-seven.vercel.app/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        const userEmail = data.email;
        setCreatedUserEmail(userEmail);
      });
  };

  return (
    <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-gray-900 text-gray-100 mx-auto my-5">
      <h1 className="text-2xl font-bold text-center">SignUp</h1>
      <form
        onSubmit={handleSubmit(signupHandler)}
        action=""
        className="space-y-6 ng-untouched ng-pristine ng-valid"
      >
        <div className="space-y-1 text-sm">
          <label for="name" className="block text-gray-400">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="unknown"
            {...register("name", {
              required: "Name is required.",
            })}
            className="w-full px-4 py-3 rounded-md border-white bg-gray-900 text-gray-100 focus:border-cyan-400"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1 text-sm">
          <label for="email" className="block text-gray-400">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="unknown@gmail.com"
            {...register("email", {
              required: "Email is required.",
            })}
            className="w-full px-4 py-3 rounded-md border-white bg-gray-900 text-gray-100 focus:border-cyan-400"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label for="password" className="block text-gray-400">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="****"
            {...register("password", {
              required: "Password is required.",
              minLength: { value: 6, message: "Password is too short." },
              pattern: {
                value: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                message:
                  "Password is weak.Must Have (lowercase,uppercase,special-character)",
              },
            })}
            className="w-full px-4 py-3 rounded-md border-white bg-gray-900 text-gray-100 focus:border-cyan-400"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>
        <button className="block w-full p-3 text-center rounded-sm text-gray-900 bg-cyan-400">
          SignUp
        </button>
      </form>
      <div className="flex items-center pt-4 space-x-1">
        <div className="flex-1 h-px sm:w-16 bg-gray-700"></div>
        <p className="px-3 text-sm text-gray-400">SignUp with Google</p>
        <div className="flex-1 h-px sm:w-16 bg-gray-700"></div>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          aria-label="Log in with Google"
          className="p-3 rounded-sm"
          onClick={handleGoogleSignIn}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-5 h-5 fill-current"
          >
            <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
          </svg>
        </button>
      </div>
      {signupError && <p className="text-red-500">{signupError}</p>}
      <p className="text-xs text-center sm:px-6 text-gray-400">
        Already have an account?
        <Link
          rel="noopener noreferrer"
          to="/login"
          className="underline text-gray-100"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
