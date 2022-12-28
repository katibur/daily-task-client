import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthProvider/AuthProvider";

const CompletedTask = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const { data: fetchedData = [], refetch } = useQuery({
    queryKey: ["fetchedData", user?.email],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/tasks/${user?.email}`, {
        headers: {
          authorization: `bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      setTasks(data);
      return data;
    },
  });

  const handleUndoComplete = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        if (data.acknowledged) {
          navigate("/myTask", { replace: true });
          toast.error("Ohhhh!!!!Task Undo Completed.");
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
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

  return (
    <div class="overflow-x-auto my-10 bg-slate-600 text-white">
      {tasks
        ?.filter((data) => data.isCompleted === true)
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
                  <p className="dark:text-gray-100">{task.description}</p>
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
                  onClick={() => handleUndoComplete(task._id)}
                  className="flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md dark:bg-cyan-400 dark:text-gray-900"
                >
                  Undo Complete Task
                </button>
              </div>
            </div>
          </>
        ))}
    </div>
  );
};

export default CompletedTask;
