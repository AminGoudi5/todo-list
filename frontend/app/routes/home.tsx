import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

type UserInfo = {
  user_name: string;
  city?: string;
  task_count?: number;
};

const Home = () => {
  const [newUsers, setNewUsers] = useState<UserInfo[]>([]);
  const [topUsers, setTopUsers] = useState<UserInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/home-data`).then((res) => {
      setNewUsers(res.data.new_users);
      setTopUsers(res.data.top_users);
    }).catch((err) => {
      console.error("خطا در دریافت اطلاعات صفحه اصلی", err);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">به سامانه تسک من خوش آمدید</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 text-white px-4 py-1 rounded cursor-pointer"
          >
            ورود
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer"
          >
            ثبت‌نام
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">کاربران تازه ثبت‌نام‌شده</h2>
        <ul className="border rounded p-4 space-y-1">
          {newUsers.length === 0 ? (
            <li>هنوز کاربری ثبت‌نام نکرده است.</li>
          ) : (
            newUsers.map((user, i) => (
              <li key={i} className="flex justify-between border-b pb-2">
                <span>{user.user_name}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">فعال‌ترین کاربران</h2>
        <ul className="border rounded p-4 space-y-2">
          {topUsers.length === 0 ? (
            <li>داده‌ای وجود ندارد.</li>
          ) : (
            topUsers.map((user, i) => (
              <li key={i} className="flex justify-between border-b pb-2">
                <span>{user.user_name}</span>
                <span>{user.city || ""} - {user.task_count} تسک</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
