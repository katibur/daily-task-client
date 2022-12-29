import React from "react";
import { toast } from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";

const UpdateTask = ({ task, setShowEditTask }) => {
  const { _id, name, img, description } = task;

  const updateTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const description = form.details.value;
    const updateData = {
      name,
      description,
    };
    console.log(updateData);

    fetch(`https://daily-task-server-seven.vercel.app/updateTask?id=${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.acknowledged) {
          toast.success(`${name} is updated`);
          setShowEditTask(null);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <div
        className="absolute top-20 bg-cyan-700 left-1/2 card md:w-[35%] w-[80%] p-5 rounded 
            -translate-x-1/2"
      >
        <form action="" className="rounded  relative" onSubmit={updateTask}>
          <div className="form-control">
            <input
              type="text"
              name="name"
              placeholder="Title"
              className="p-2 bg-[#0e0d0d87] w-full rounded"
              defaultValue={name}
            />
          </div>
          <div className="form-control">
            <input
              type="text"
              name="details"
              placeholder="Details"
              className="p-2 bg-[#0e0d0d87] w-full mt-3 rounded"
              defaultValue={description}
            />
          </div>
          <div className="form-control ">
            <input
              type="submit"
              value="Update"
              className="mt-5 flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md dark:bg-cyan-400 dark:text-gray-900"
            />
          </div>
          <div className="absolute -top-4 -right-4">
            <AiFillCloseCircle
              className="text-xl cursor-pointer"
              onClick={() => setShowEditTask()}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;
