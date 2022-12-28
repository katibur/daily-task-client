import { createBrowserRouter } from "react-router-dom";

import Home from "../../Pages/Home/Home";
import Login from "../../Components/Login/Login";
import Signup from "../../Components/Signup/Signup";
import Main from "../../Layouts/Main/Main";
import AddTask from "../../Pages/AddTask/AddTask";
import Mytasks from "../../Pages/Mytasks/Mytasks";
import CompletedTask from "../../Pages/CompletedTask/CompletedTask";
import PrivateRouter from "../PrivateRoutes/PrivateRouter";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/addTask",
        element: (
          <PrivateRouter>
            <AddTask></AddTask>
          </PrivateRouter>
        ),
      },
      {
        path: "/myTask",
        element: (
          <PrivateRouter>
            <Mytasks></Mytasks>
          </PrivateRouter>
        ),
      },
      {
        path: "/completed",
        element: (
          <PrivateRouter>
            <CompletedTask></CompletedTask>
          </PrivateRouter>
        ),
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
    ],
  },
]);
