import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Shared/Loading/Loading";
import { AuthContext } from "../../Contexts/AuthProvider/AuthProvider";

const CompletedTask = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const {
    data: fetchedData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["fetchedData", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `https://daily-task-server-seven.vercel.app/tasks/${user?.email}`,
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

  const handleUndoComplete = (id) => {
    fetch(`https://daily-task-server-seven.vercel.app/tasks/${id}`, {
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
    fetch(`https://daily-task-server-seven.vercel.app/tasks/${id}`, {
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

  const handleAddComment = (data) => {
    const myComment = {
      comment: data.comment,
      task: data.taskId,
    };
    console.log(myComment);
    fetch("https://daily-task-server-seven.vercel.app/comment", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(myComment),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success("Comment added successfully");
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

                <form
                  className="flex flex-col w-full"
                  onSubmit={handleSubmit(handleAddComment)}
                >
                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-white"
                    ></label>
                    <textarea
                      {...register("comment", {
                        required: "comment is Required",
                      })}
                      name="comment"
                      placeholder="Comment ....."
                      className="w-full text-black px-4 py-3 rounded-md border-2 border-gray-300  dark:text-black focus:dark:border-violet-300"
                    />

                    <div>
                      <label htmlFor="taskId"></label>
                      <input
                        {...register("taskId")}
                        type="text"
                        name="taskId"
                        id="taskId"
                        placeholder={task._id}
                        disabled
                        hidden
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-4 px-3 my-8 font-semibold rounded-md dark:text-gray-900 dark:bg-cyan-400"
                    >
                      Comment On This Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ))}
    </div>
  );
};

export default CompletedTask;
