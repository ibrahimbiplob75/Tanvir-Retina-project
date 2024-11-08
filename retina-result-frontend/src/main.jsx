import React from "react";
import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminUpload from "./Admin/AdminUpload.jsx";
import Home from "./Home/Home.jsx";
import Dasboard from "./Admin/Dasboard.jsx";
import EditResult from "./Admin/EditResult.jsx";
import Result from "./Admin/Result.jsx";
import AdminAuth from "./Admin/AdminAuth.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminAuth>
        <Dasboard></Dasboard>
      </AdminAuth>
    ),
    children: [
      {
        path: "/admin",
        element: <Result></Result>,
      },
      {
        path: "/admin/upload-result",
        element: <AdminUpload></AdminUpload>,
      },
      {
        path: "/admin/results/edit/:_id",
        element: <EditResult></EditResult>,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
