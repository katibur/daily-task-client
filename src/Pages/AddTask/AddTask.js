import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthProvider/AuthProvider";

const AddTask = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const user = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();

  const handleAddTask = (data) => {
    const image = data.image[0];
    const formData = new FormData();
    formData.append("image", image);
    fetch(
      `https://api.imgbb.com/1/upload?key=${"3c02ebae27809e5199bba6cfb5fc3b1e"}`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData.success) {
          const myTasks = {
            name: data.taskName,
            img: imgData.data.url,
            description: data.message,
            email: user.user.email,
          };
          console.log(myTasks);
          fetch("http://localhost:5000/task", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(myTasks),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              toast.success("Task added successfully");
              if (data.acknowledged === true) {
                navigate("/myTask", { replace: true });
              }
            });
        }
      });
  };

  return (
    <div className="mx-auto my-10">
      <div className="max-w-4xl p-6 mx-auto bg-gray-700 rounded-md shadow-md mt-12 mb-12">
        <form onSubmit={handleSubmit(handleAddTask)}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1 items-center">
            <div>
              <label htmlFor="taskName" className="block text-white">
                Task Name
              </label>
              <input
                {...register("taskName", {
                  required: "taskName Is Required",
                })}
                type="text"
                name="taskName"
                id="taskName"
                placeholder="Task Name"
                className="w-full px-4 py-3 text-black rounded-md border-2 border-gray-300  dark:text-black focus:dark:border-violet-300"
              />
            </div>
            {errors.taskName && (
              <p className="text-red-600">{errors.taskName?.message}</p>
            )}

            <div>
              <label htmlFor="img" className="block text-white">
                Task Image
              </label>
              <input
                {...register("image")}
                type="file"
                name="image"
                id="image"
                accept="image/*"
                placeholder="Insert Your Product's Image."
                className="w-full text-white px-4 py-3 rounded-md border-2 border-gray-300  dark:text-white focus:dark:border-violet-300"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-white">
                Task Details
              </label>
              <textarea
                {...register("message", { required: "message is Required" })}
                name="message"
                placeholder="Task Details"
                className="w-full text-black px-4 py-3 rounded-md border-2 border-gray-300  dark:text-black focus:dark:border-violet-300"
              />
            </div>

            <input
              className="block rounded-sm bg-white px-8 py-3 text-sm font-medium hover:bg-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
              value="Add Task"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
