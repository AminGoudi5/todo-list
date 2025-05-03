// Register.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== password2) {
            setError("رمز عبور و تأیید رمز عبور یکسان نیستند");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                username,
                password,
                password2
            },
                { withCredentials: true });

            if (response.data.message === 'User registered successfully') {
                setSuccessMessage('ثبت نام با موفقیت انجام شد!');
                setUsername('');
                setPassword('');
                setPassword2('');
                navigate('/panel');
            } else if (response.data.message === 'Username already exists') {
                setError('این نام کاربری قبلاً ثبت شده است');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    // در صورت دریافت وضعیت 409
                    setError('این نام کاربری قبلاً ثبت شده است');
                } else {
                    // در صورت بروز هر خطای دیگری
                    setError('خطا در ثبت نام، لطفا دوباره تلاش کنید.');
                }
            } else {
                setError('خطای ناشناخته');
            }
        }
    };


    return (
        <div className="flex justify-center items-center h-screen">

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-1/3 flex flex-col">
                <h2 className=" text-xl font-bold mb-4 text-black">ثبت نام</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-black">نام کاربری</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded mt-1 text-black"
                        required
                    />
                </div>


                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-black">رمز عبور</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded mt-1 text-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password2" className="block text-sm font-medium text-black">تأیید رمز عبور</label>
                    <input
                        type="password"
                        id="password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded mt-1 text-black"
                        required
                    />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer">ثبت نام</button>
                <button
                    onClick={() => navigate("/")}
                    className="bg-red-500 text-white px-4 py-1 rounded cursor-pointer mt-4 w-40 self-center"
                >
                    صفحه اصلی
                </button>
            </form>
        </div>
    );
};

export default Register;
