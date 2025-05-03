import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
type Task = {
  id: number;
  description: string;
};

type Contact = {
  phone: string;
  city: string;
};

const Panel = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [contact, setContact] = useState<Contact>({ phone: "", city: "" });
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks", { withCredentials: true })
      .then((res) => {
        setTasks(res.data.tasks);
        setUserName(res.data.user);
        setContact(res.data.contact || { phone: "", city: "" });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          console.error("User not logged in or session expired");
          // Redirect to login page or show error
        } else {
          console.error("خطا در دریافت اطلاعات", err);
        }
      });
  }, []);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    axios
      .post(
        "http://localhost:5000/api/add",
        { description: newTask },
        { withCredentials: true }
      )
      .then((res) => {
        setTasks([...tasks, { id: res.data.task_id, description: newTask }]);
        setNewTask("");
      })
      .catch((err) => console.error("خطا در افزودن تسک", err));
  };

  const handleDelete = (id: number) => {
    axios
      .post("http://localhost:5000/api/remove", { id }, { withCredentials: true })
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((err) => console.error("خطا در حذف تسک", err));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditedText(task.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedText("");
  };

  const saveEdit = (id: number) => {
    if (!editedText.trim()) return;
    axios
      .post(
        "http://localhost:5000/api/edit",
        { id, description: editedText },
        { withCredentials: true }
      )
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, description: editedText } : task
          )
        );
        setEditingId(null);
        setEditedText("");
      })
      .catch((err) => console.error("خطا در ویرایش تسک", err));
  };

  const handleSaveContact = () => {
    if (!contact.phone || !contact.city) return;
    axios
      .post("http://localhost:5000/api/edit-contact", contact, {
        withCredentials: true,
      })
      .then(() => {
        setShowContactForm(false);
        alert("اطلاعات تماس ذخیره شد");
      })
      .catch((err) => console.error("خطا در ذخیره اطلاعات تماس", err));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => navigate("/")}
          className="w-30 bg-red-600 text-white py-2 rounded self-center mt-1.5 cursor-pointer"
        >
          خروج
        </button>
        <h1 className="text-xl">تسک‌های من</h1>
        <button
          onClick={() => setShowContactForm(!showContactForm)}
          className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
        >
          {userName}
        </button>
      </div>

      {showContactForm && (
        <div className="border rounded p-3 mb-4">
          <h2 className="mb-2 font-bold">ویرایش اطلاعات تماس</h2>
          <input
            type="text"
            placeholder="شماره تماس"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            className="w-full mb-2 border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="شهر"
            value={contact.city}
            onChange={(e) => setContact({ ...contact, city: e.target.value })}
            className="w-full mb-2 border px-2 py-1 rounded"
          />
          <button
            onClick={handleSaveContact}
            className="bg-green-500 text-white px-4 py-1 rounded cursor-pointer"
          >
            ذخیره اطلاعات تماس
          </button>
        </div>
      )}

      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 border px-2 py-1 rounded"
          placeholder="تسک جدید"
        />
        <button
          onClick={handleAddTask}
          className="ml-2 px-4 py-1 bg-green-500 text-white rounded cursor-pointer"
        >
          اضافه
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center mb-2">
            {editingId === task.id ? (
              <>
                <input
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="flex-1 border px-2 py-1 rounded"
                />
                <div className="ml-2 space-x-2">
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="text-blue-600 cursor-pointer"
                  >
                    ذخیره
                  </button>
                  <button onClick={cancelEdit} className="text-gray-500 cursor-pointer">
                    لغو
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>{task.description}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => startEdit(task)}
                    className="text-blue-600 cursor-pointer"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 cursor-pointer"
                  >
                    حذف
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Panel;
