import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useState, useEffect } from "react";
import axios from "axios";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const Home = () => {
  const [newUsers, setNewUsers] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:5000/api/home-data").then((res) => {
      setNewUsers(res.data.new_users);
      setTopUsers(res.data.top_users);
    }).catch((err) => {
      console.error("خطا در دریافت اطلاعات صفحه اصلی", err);
    });
  }, []);
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-3xl mx-auto p-6",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex justify-between mb-6",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-2xl font-bold",
        children: "به سامانه تسک من خوش آمدید"
      }), /* @__PURE__ */ jsxs("div", {
        className: "space-x-2",
        children: [/* @__PURE__ */ jsx("button", {
          onClick: () => navigate("/login"),
          className: "bg-green-500 text-white px-4 py-1 rounded cursor-pointer",
          children: "ورود"
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => navigate("/register"),
          className: "bg-blue-500 text-white px-4 py-1 rounded cursor-pointer",
          children: "ثبت‌نام"
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "mb-8",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-xl font-semibold mb-2",
        children: "کاربران تازه ثبت‌نام‌شده"
      }), /* @__PURE__ */ jsx("ul", {
        className: "border rounded p-4 space-y-1",
        children: newUsers.length === 0 ? /* @__PURE__ */ jsx("li", {
          children: "هنوز کاربری ثبت‌نام نکرده است."
        }) : newUsers.map((user, i) => /* @__PURE__ */ jsx("li", {
          className: "flex justify-between border-b pb-2",
          children: /* @__PURE__ */ jsx("span", {
            children: user.user_name
          })
        }, i))
      })]
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-xl font-semibold mb-2",
        children: "فعال‌ترین کاربران"
      }), /* @__PURE__ */ jsx("ul", {
        className: "border rounded p-4 space-y-2",
        children: topUsers.length === 0 ? /* @__PURE__ */ jsx("li", {
          children: "داده‌ای وجود ندارد."
        }) : topUsers.map((user, i) => /* @__PURE__ */ jsxs("li", {
          className: "flex justify-between border-b pb-2",
          children: [/* @__PURE__ */ jsx("span", {
            children: user.user_name
          }), /* @__PURE__ */ jsxs("span", {
            children: [user.city || "", " - ", user.task_count, " تسک"]
          })]
        }, i))
      })]
    })]
  });
};
const home = withComponentProps(Home);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home
}, Symbol.toStringTag, { value: "Module" }));
const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // برای ارسال داده به صورت JSON
        },
        body: JSON.stringify(form),
        // تبدیل داده‌ها به JSON
        credentials: "include"
        // برای ارسال کوکی‌ها (در صورت نیاز)
      });
      const data = await res.json();
      console.log("Response Status:", data);
      if (res.ok && data.message === "Login successful") {
        navigate("/panel");
      } else if (data.error === "Invalid username or password") {
        setError("رمز عبور یا نام کاربری اشتباه است");
      }
    } catch (err) {
      console.error(err);
      setError("خطا در ارتباط با سرور");
    }
  };
  return /* @__PURE__ */ jsx("div", {
    className: "flex flex-col items-center justify-center min-h-screen",
    children: /* @__PURE__ */ jsxs("form", {
      onSubmit: handleSubmit,
      className: "flex flex-col w-full max-w-sm p-4 bg-white shadow-md rounded",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-xl text-black mb-4 text-center",
        children: "ورود به حساب"
      }), error && /* @__PURE__ */ jsx("p", {
        className: "text-red-500 text-sm",
        children: error
      }), /* @__PURE__ */ jsxs("div", {
        className: "mb-4",
        children: [/* @__PURE__ */ jsx("label", {
          className: "block mb-1 text-black",
          children: "نام کاربری"
        }), /* @__PURE__ */ jsx("input", {
          type: "text",
          name: "username",
          value: form.username,
          onChange: handleChange,
          className: "w-full border px-3 py-2 rounded text-black border-gray-300 ",
          required: true
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "mb-4",
        children: [/* @__PURE__ */ jsx("label", {
          className: "block mb-1 text-black",
          children: "رمز عبور"
        }), /* @__PURE__ */ jsx("input", {
          type: "password",
          name: "password",
          value: form.password,
          onChange: handleChange,
          className: "w-full border px-3 py-2 rounded text-black border-gray-300",
          required: true
        })]
      }), /* @__PURE__ */ jsx("button", {
        type: "submit",
        className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer",
        children: "ورود"
      }), /* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/register"),
        className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-1.5 cursor-pointer",
        children: "ثبت‌نام"
      }), /* @__PURE__ */ jsx("a", {
        href: "#",
        className: "text-blue-600 text-[10px] cursor-pointer m-4",
        children: "رمز عبور خود را فراموش کرده ام"
      }), /* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/"),
        className: "w-40 bg-red-600 text-white py-2 rounded self-center mt-1.5 cursor-pointer",
        children: "صفحه اصلی"
      })]
    })
  });
};
const login = withComponentProps(Login);
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: login
}, Symbol.toStringTag, { value: "Module" }));
const Panel = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [contact, setContact] = useState({
    phone: "",
    city: ""
  });
  const [showContactForm, setShowContactForm] = useState(false);
  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks", {
      withCredentials: true
    }).then((res) => {
      setTasks(res.data.tasks);
      setUserName(res.data.user);
      setContact(res.data.contact || {
        phone: "",
        city: ""
      });
    }).catch((err) => {
      if (err.response.status === 401) {
        console.error("User not logged in or session expired");
      } else {
        console.error("خطا در دریافت اطلاعات", err);
      }
    });
  }, []);
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    axios.post("http://localhost:5000/api/add", {
      description: newTask
    }, {
      withCredentials: true
    }).then((res) => {
      setTasks([...tasks, {
        id: res.data.task_id,
        description: newTask
      }]);
      setNewTask("");
    }).catch((err) => console.error("خطا در افزودن تسک", err));
  };
  const handleDelete = (id) => {
    axios.post("http://localhost:5000/api/remove", {
      id
    }, {
      withCredentials: true
    }).then(() => setTasks(tasks.filter((task) => task.id !== id))).catch((err) => console.error("خطا در حذف تسک", err));
  };
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditedText(task.description);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditedText("");
  };
  const saveEdit = (id) => {
    if (!editedText.trim()) return;
    axios.post("http://localhost:5000/api/edit", {
      id,
      description: editedText
    }, {
      withCredentials: true
    }).then(() => {
      setTasks(tasks.map((task) => task.id === id ? {
        ...task,
        description: editedText
      } : task));
      setEditingId(null);
      setEditedText("");
    }).catch((err) => console.error("خطا در ویرایش تسک", err));
  };
  const handleSaveContact = () => {
    if (!contact.phone || !contact.city) return;
    axios.post("http://localhost:5000/api/edit-contact", contact, {
      withCredentials: true
    }).then(() => {
      setShowContactForm(false);
      alert("اطلاعات تماس ذخیره شد");
    }).catch((err) => console.error("خطا در ذخیره اطلاعات تماس", err));
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "p-4 max-w-xl mx-auto",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex justify-between mb-4",
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/"),
        className: "w-30 bg-red-600 text-white py-2 rounded self-center mt-1.5 cursor-pointer",
        children: "خروج"
      }), /* @__PURE__ */ jsx("h1", {
        className: "text-xl",
        children: "تسک‌های من"
      }), /* @__PURE__ */ jsx("button", {
        onClick: () => setShowContactForm(!showContactForm),
        className: "bg-blue-500 text-white px-3 py-1 rounded cursor-pointer",
        children: userName
      })]
    }), showContactForm && /* @__PURE__ */ jsxs("div", {
      className: "border rounded p-3 mb-4",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "mb-2 font-bold",
        children: "ویرایش اطلاعات تماس"
      }), /* @__PURE__ */ jsx("input", {
        type: "text",
        placeholder: "شماره تماس",
        value: contact.phone,
        onChange: (e) => setContact({
          ...contact,
          phone: e.target.value
        }),
        className: "w-full mb-2 border px-2 py-1 rounded"
      }), /* @__PURE__ */ jsx("input", {
        type: "text",
        placeholder: "شهر",
        value: contact.city,
        onChange: (e) => setContact({
          ...contact,
          city: e.target.value
        }),
        className: "w-full mb-2 border px-2 py-1 rounded"
      }), /* @__PURE__ */ jsx("button", {
        onClick: handleSaveContact,
        className: "bg-green-500 text-white px-4 py-1 rounded cursor-pointer",
        children: "ذخیره اطلاعات تماس"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex mb-4",
      children: [/* @__PURE__ */ jsx("input", {
        type: "text",
        value: newTask,
        onChange: (e) => setNewTask(e.target.value),
        className: "flex-1 border px-2 py-1 rounded",
        placeholder: "تسک جدید"
      }), /* @__PURE__ */ jsx("button", {
        onClick: handleAddTask,
        className: "ml-2 px-4 py-1 bg-green-500 text-white rounded cursor-pointer",
        children: "اضافه"
      })]
    }), /* @__PURE__ */ jsx("ul", {
      children: tasks.map((task) => /* @__PURE__ */ jsx("li", {
        className: "flex justify-between items-center mb-2",
        children: editingId === task.id ? /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx("input", {
            value: editedText,
            onChange: (e) => setEditedText(e.target.value),
            className: "flex-1 border px-2 py-1 rounded"
          }), /* @__PURE__ */ jsxs("div", {
            className: "ml-2 space-x-2",
            children: [/* @__PURE__ */ jsx("button", {
              onClick: () => saveEdit(task.id),
              className: "text-blue-600 cursor-pointer",
              children: "ذخیره"
            }), /* @__PURE__ */ jsx("button", {
              onClick: cancelEdit,
              className: "text-gray-500 cursor-pointer",
              children: "لغو"
            })]
          })]
        }) : /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx("span", {
            children: task.description
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-x-2",
            children: [/* @__PURE__ */ jsx("button", {
              onClick: () => startEdit(task),
              className: "text-blue-600 cursor-pointer",
              children: "ویرایش"
            }), /* @__PURE__ */ jsx("button", {
              onClick: () => handleDelete(task.id),
              className: "text-red-600 cursor-pointer",
              children: "حذف"
            })]
          })]
        })
      }, task.id))
    })]
  });
};
const panel = withComponentProps(Panel);
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: panel
}, Symbol.toStringTag, { value: "Module" }));
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    var _a;
    e.preventDefault();
    if (password !== password2) {
      setError("رمز عبور و تأیید رمز عبور یکسان نیستند");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        password,
        password2
      }, {
        withCredentials: true
      });
      if (response.data.message === "User registered successfully") {
        setSuccessMessage("ثبت نام با موفقیت انجام شد!");
        setUsername("");
        setPassword("");
        setPassword2("");
        navigate("/panel");
      } else if (response.data.message === "Username already exists") {
        setError("این نام کاربری قبلاً ثبت شده است");
      }
    } catch (error2) {
      if (axios.isAxiosError(error2)) {
        if (((_a = error2.response) == null ? void 0 : _a.status) === 409) {
          setError("این نام کاربری قبلاً ثبت شده است");
        } else {
          setError("خطا در ثبت نام، لطفا دوباره تلاش کنید.");
        }
      } else {
        setError("خطای ناشناخته");
      }
    }
  };
  return /* @__PURE__ */ jsx("div", {
    className: "flex justify-center items-center h-screen",
    children: /* @__PURE__ */ jsxs("form", {
      onSubmit: handleSubmit,
      className: "bg-white p-6 rounded shadow-md w-1/3 flex flex-col",
      children: [/* @__PURE__ */ jsx("h2", {
        className: " text-xl font-bold mb-4 text-black",
        children: "ثبت نام"
      }), error && /* @__PURE__ */ jsx("div", {
        className: "text-red-500 mb-4",
        children: error
      }), successMessage && /* @__PURE__ */ jsx("div", {
        className: "text-green-500 mb-4",
        children: successMessage
      }), /* @__PURE__ */ jsxs("div", {
        className: "mb-4",
        children: [/* @__PURE__ */ jsx("label", {
          htmlFor: "username",
          className: "block text-sm font-medium text-black",
          children: "نام کاربری"
        }), /* @__PURE__ */ jsx("input", {
          type: "text",
          id: "username",
          value: username,
          onChange: (e) => setUsername(e.target.value),
          className: "w-full px-4 py-2 border border-gray-300 rounded mt-1 text-black",
          required: true
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "mb-4",
        children: [/* @__PURE__ */ jsx("label", {
          htmlFor: "password",
          className: "block text-sm font-medium text-black",
          children: "رمز عبور"
        }), /* @__PURE__ */ jsx("input", {
          type: "password",
          id: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          className: "w-full px-4 py-2 border border-gray-300 rounded mt-1 text-black",
          required: true
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "mb-4",
        children: [/* @__PURE__ */ jsx("label", {
          htmlFor: "password2",
          className: "block text-sm font-medium text-black",
          children: "تأیید رمز عبور"
        }), /* @__PURE__ */ jsx("input", {
          type: "password",
          id: "password2",
          value: password2,
          onChange: (e) => setPassword2(e.target.value),
          className: "w-full px-4 py-2 border border-gray-300 rounded mt-1 text-black",
          required: true
        })]
      }), /* @__PURE__ */ jsx("button", {
        type: "submit",
        className: "w-full bg-blue-500 text-white py-2 rounded cursor-pointer",
        children: "ثبت نام"
      }), /* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/"),
        className: "bg-red-500 text-white px-4 py-1 rounded cursor-pointer mt-4 w-40 self-center",
        children: "صفحه اصلی"
      })]
    })
  });
};
const register = withComponentProps(Register);
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: register
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CXTXZdwR.js", "imports": ["/assets/chunk-AYJ5UCUI-D02hIfpQ.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-Bts_PIYx.js", "imports": ["/assets/chunk-AYJ5UCUI-D02hIfpQ.js", "/assets/with-props-BiQABcLS.js"], "css": ["/assets/root-DP_YvRq7.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-DONfAkXs.js", "imports": ["/assets/with-props-BiQABcLS.js", "/assets/chunk-AYJ5UCUI-D02hIfpQ.js", "/assets/index-xsH4HHeE.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/login-B8QgBX2t.js", "imports": ["/assets/with-props-BiQABcLS.js", "/assets/chunk-AYJ5UCUI-D02hIfpQ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/panel": { "id": "routes/panel", "parentId": "root", "path": "panel", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/panel-ChVSeY7k.js", "imports": ["/assets/with-props-BiQABcLS.js", "/assets/chunk-AYJ5UCUI-D02hIfpQ.js", "/assets/index-xsH4HHeE.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/register": { "id": "routes/register", "parentId": "root", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/register-CmEJa9PG.js", "imports": ["/assets/with-props-BiQABcLS.js", "/assets/chunk-AYJ5UCUI-D02hIfpQ.js", "/assets/index-xsH4HHeE.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-f82e4f6c.js", "version": "f82e4f6c", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/panel": {
    id: "routes/panel",
    parentId: "root",
    path: "panel",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/register": {
    id: "routes/register",
    parentId: "root",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
