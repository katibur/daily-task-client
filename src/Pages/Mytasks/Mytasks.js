import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Shared/Loading/Loading";
import { AuthContext } from "../../Contexts/AuthProvider/AuthProvider";
import UpdateTask from "./UpdateTask";

const Mytasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showEditTask, setShowEditTask] = useState(null);

  const navigate = useNavigate();

  const {
    data: fetchedData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["fetchedData", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `https://daily-task-server-seven.vercel.app/task/${user?.email}`,
        {
          headers: {
            authorization: `bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await res.json();
      setTasks(data);
      refetch();
      return data;
    },
  });
  if (isLoading) {
    return <Loading></Loading>;
  }

  const handleComplete = (id) => {
    fetch(`https://daily-task-server-seven.vercel.app/task/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        console.log(data);
        if (data.acknowledged) {
          navigate("/completed", { replace: true });
          toast.success("Great!!!!Task Completed Successfully");
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (id) => {
    fetch(`https://daily-task-server-seven.vercel.app/task/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.deletedCount > 0) {
          toast.success("Task Deleted successfully");
          refetch();
        }
      });
  };

  const editTask = (task) => {
    console.log(task);
    setShowEditTask(task);
  };

  return (
    <div class="overflow-x-auto my-10 bg-slate-600 text-white grid lg:grid-cols-3 sm:grid-cols-1">
      {tasks
        ?.filter((data) => data.isCompleted !== true)
        .map((task) => (
          <>
            <div className="max-w-xs mx-auto my-5 rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100">
              <img
                src={task.img}
                alt=""
                className="object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500"
              />
              <div className="flex flex-col justify-between p-6 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold tracking-wide">
                    {task.name}
                  </h2>
                  <p className="text-white w-full my-5">{`${task.description}`}</p>
                  <button
                    type="button"
                    onClick={() => editTask(task)}
                    className="flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md dark:bg-cyan-400 dark:text-gray-900"
                  >
                    Update
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(task._id)}
                  className="flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md dark:bg-cyan-400 dark:text-gray-900"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => handleComplete(task._id)}
                  className="flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md dark:bg-cyan-400 dark:text-gray-900"
                >
                  Complete Task
                </button>
              </div>
            </div>
          </>
        ))}
      {showEditTask && (
        <UpdateTask task={showEditTask} setShowEditTask={setShowEditTask} />
      )}
    </div>
  );
};

export default Mytasks;
