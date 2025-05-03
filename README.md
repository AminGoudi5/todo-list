
# 📝 FullStack ToDo List App (React + Flask)

این پروژه یک برنامه‌ی مدیریت کارها (ToDo List) است که با استفاده از **React** در سمت فرانت‌اند و **Flask** در سمت بک‌اند پیاده‌سازی شده است. کاربران می‌توانند ثبت‌نام و ورود انجام دهند، کارهای روزانه‌ی خود را مدیریت کنند و اطلاعات تماس ثبت کنند.

---

## 📁 ساختار پروژه

```
todo-list/
├── backend/           # پروژه Flask
│   ├── app.py
│   ├── models/
│   ├── routes/
│   ├── extensions.py
│   ├── .env
│   └── ...
├── frontend/          # پروژه React
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md
```

---

## 🚀 ویژگی‌ها

- ثبت‌نام و ورود کاربران با رمز عبور هش‌شده
- ایجاد، ویرایش و حذف تسک‌ها (Tasks)
- ذخیره اطلاعات تماس (تلفن و شهر)
- احراز هویت با استفاده از session
- پشتیبانی از CORS برای اتصال بین دو سمت فرانت و بک
- رابط کاربری ساده و ریسپانسیو با Tailwind CSS (در صورت استفاده)

---

## 🛠 راه‌اندازی پروژه

### 🔧 بک‌اند (Flask)

1. وارد پوشه backend شوید:
   ```bash
   cd backend
   ```

2. محیط مجازی بسازید و فعال کن:
   ```bash
   python -m venv venv
   source venv/bin/activate     # لینوکس یا مک
   venv\Scripts\activate        # ویندوز
   ```

3. پکیج‌ها را نصب کن:
   ```bash
   pip install -r requirements.txt
   ```

4. سرور را اجرا کن:
   ```bash
   flask run
   ```


```bash
pip freeze > requirements.txt
```

---

### 💻 فرانت‌اند (React)

1. وارد پوشه frontend شو:
   ```bash
   cd frontend
   ```

2. پکیج‌ها را نصب کن:
   ```bash
   npm install
   ```

3. پروژه را اجرا کن:
   ```bash
   npm start
   ```

> اطمینان حاصل کن که آدرس درخواست‌ها در فایل‌های axios (`http://localhost:5000/...`) به درستی تنظیم شده باشد و `withCredentials: true` فعال باشد.

---

## 🌐 دیپلوی

### ✅ فرانت‌اند:
- می‌تونی از [**Vercel**](https://vercel.com/) یا [**Netlify**](https://www.netlify.com/) استفاده کنی.

### ✅ بک‌اند:
- می‌تونی از [**Render**](https://render.com/) یا [**Railway**](https://railway.app/) برای اجرای Flask استفاده کنی.

---

## 🧑‍💻 توسعه‌دهنده

- 👤 امین گودرزی
- 📧 godarziamin86772@gmail.com
---
