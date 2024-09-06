import { useState } from "react";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
}
export interface LoginForm {
  surat: string;
  sandi: string;
}

export default function Login() {
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    password: "",
    name: "",
  });
  const [formLogin, setFormLogin] = useState<LoginForm>({
    surat: "",
    sandi: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log(`id: ${id}, value: ${value}`);
    setForm({ ...form, [id]: value });
  };
  const handleChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log(`id: ${id}, value: ${value}`);
    setFormLogin({ ...formLogin, [id]: value });
  };

  const handleClick = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const responseData = await response.json();
        navigate("/login");
        console.log(responseData.message);
      } else {
        console.log("Registrasi gagal");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  return (
    <div className="section">
      <div className="container">
        <div className="row full-height justify-content-center">
          <div className="col-12 text-center align-self-center py-5">
            <div className="section pb-5 pt-5 pt-sm-2 text-center">
              <h6 className="mb-0 pb-3">
                <span>Log In </span>
                <span>Register</span>
              </h6>
              <input
                className="checkbox"
                type="checkbox"
                id="reg-log"
                name="reg-log"
              />
              <label htmlFor="reg-log"></label>
              <button onClick={handleClick} className="py-5 rounded">
                <IoArrowBackCircle className="w-28 h-10" />
                <span>Home</span>
              </button>
              <div className="card-3d-wrap mx-auto">
                <div className="card-3d-wrapper">
                  <div className="card-front">
                    <div className="center-wrap">
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();

                          try {
                            const url = new URL(
                              "http://localhost:8082/api/auth/sign-in"
                            );
                            url.searchParams.append("surat", formLogin.surat);
                            url.searchParams.append("sandi", formLogin.sandi);

                            const response = await fetch(url.toString(), {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                            });

                            if (response.ok) {
                              const token = await response.text();
                              localStorage.setItem("token", token);

                              alert("Login Berhasil");
                              setCookie("token", token, 7);
                              const userResponse = await fetch(
                                "http://localhost:8082/api/auth/me",
                                {
                                  method: "GET",
                                  credentials: "include",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                }
                              );

                              if (userResponse.ok) {
                                const userData = await userResponse.json();
                                if (userData.role === "admin") {
                                  navigate("/admin");
                                } else {
                                  navigate("/");
                                }
                              } else {
                                alert("Failed to fetch user details.");
                              }
                            } else {
                              const message = await response.text();
                              alert(message);
                            }
                          } catch (error) {
                            alert(
                              error instanceof Error
                                ? error.message
                                : "Terjadi kesalahan."
                            );
                          }
                        }}
                        className="section text-center"
                      >
                        <h4 className="mb-4 pb-3">Log In</h4>
                        <div className="relative block m-0 p-0">
                          <input
                            type="email"
                            id="surat"
                            placeholder="Email"
                            value={formLogin.surat}
                            required
                            onChange={handleChangeLogin}
                            className="text-black border p-2 rounded w-full mb-4"
                          />
                        </div>
                        <div className="relative block m-0 p-0 mt-2">
                          <input
                            type="password"
                            id="sandi"
                            placeholder="Password"
                            value={formLogin.sandi}
                            required
                            onChange={handleChangeLogin}
                            className="text-black border p-2 rounded w-full mb-4"
                          />
                        </div>
                        <button
                          className="btn rounded-4px h-11 text-xs font-semibold uppercase pt-0 pb-30px tracking-1px inline-flex  items-center mt-4"
                          type="submit"
                        >
                          Login
                        </button>
                        <p className="mb-0 mt-4 text-center">
                          <a
                            href="https://www.web-leb.com/code"
                            className="link"
                          >
                            Forgot your password?
                          </a>
                        </p>
                      </form>
                    </div>
                  </div>
                  <div className="card-back">
                    <div className="center-wrap">
                      <form
                        onSubmit={handleSubmit}
                        className="section text-center"
                      >
                        <h4 className="mb-3 pb-3">Register</h4>
                        <div className="relative block m-0 p-0">
                          <input
                            type="text"
                            id="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="text-black border p-2 rounded w-full mb-4"
                          />
                        </div>
                        <div className="relative block m-0 p-0 mt-2">
                          <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="text-black border p-2 rounded w-full mb-4"
                          />
                        </div>
                        <div className="relative block m-0 p-0 mt-2">
                          <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="text-black border p-2 rounded w-full mb-4"
                          />
                        </div>
                        <button
                          className="btn rounded-4px h-11 text-xs font-semibold uppercase pt-0 pb-30px tracking-1px inline-flex  items-center mt-4"
                          type="submit"
                        >
                          Register
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
