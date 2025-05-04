import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // برای ارسال داده به صورت JSON
        },
        body: JSON.stringify(form), // تبدیل داده‌ها به JSON
        credentials: "include", // برای ارسال کوکی‌ها (در صورت نیاز)
      });

      const data = await res.json();
      console.log("Response Status:", data);
      if (res.ok && data.message === "Login successful") {
        navigate("/panel");
      } else if(data.error==="Invalid username or password") {

        setError("رمز عبور یا نام کاربری اشتباه است");
      }
    } catch (err) {
      console.error(err);
      setError("خطا در ارتباط با سرور");
    }
  };

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen">
      
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm p-4 bg-white shadow-md rounded">
      
        <h2 className="text-xl text-black mb-4 text-center">ورود به حساب</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-black">نام کاربری</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-black border-gray-300 "
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-black">رمز عبور</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-black border-gray-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          ورود
        </button>
        
        <button
            onClick={() => navigate("/register")}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-1.5 cursor-pointer"
          >
            ثبت‌نام
          </button>
          
          <a href="#" className="text-blue-600 text-[10px] cursor-pointer m-4">رمز عبور خود را فراموش کرده ام</a>
          <button
            onClick={() => navigate("/")}
            className="w-40 bg-red-600 text-white py-2 rounded self-center mt-1.5 cursor-pointer"
          >
            صفحه اصلی
          </button>
      </form>
    </div>
  );
};

export default Login;
