import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import HomeAdmin from "./pages/Admin/HomeAdmin.tsx";
import Login from "./pages/Login.tsx";
import Profil from "./pages/Profil.tsx";
import MyVideos from "./pages/MyVideos.tsx";
import Footer from "./pages/components/Footer.tsx";
import AllVideo from "./pages/Admin/AllVideo.tsx";
import UserProfile from "./pages/Admin/UserProfile.tsx";
import VideosAdmin from "./pages/Admin/VideosAdmin.tsx";
import ScrollToTopButton from "./pages/components/ButtonScroll.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profil",
        element: <Profil />,
      },
      {
        path: "/myvideos",
        element: <MyVideos />,
      },
      {
        path: "/footer",
        element: <Footer />,
      },
      {
        path: "/admin",
        element: <HomeAdmin />,
      },
      {
        path: "/user-profile/:id",
        element: <UserProfile />,
      },
      {
        path: "/all",
        element: <AllVideo />,
      },
      {
        path: "/videoAdmin",
        element: <VideosAdmin />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
