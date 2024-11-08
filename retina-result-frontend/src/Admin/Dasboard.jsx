
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
  

  return (
    <div>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-base-300 w-full">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <Link to={"/admin"} className="mx-2 flex-1 px-2">
              Retina Result Dashboard
            </Link>
            <div className="hidden flex-none lg:block">
              <ul className="menu menu-horizontal">
                <Link className="m-5" to={"/"}>
                  Home
                </Link>
                <Link className="m-5" to={"/admin/upload-result"}>
                  Result Upload
                </Link>
              </ul>
            </div>
          </div>
          
          <Outlet />
        </div>

        {/* Sidebar */}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            <Link className="m-5" to={"/"}>
              Home
            </Link>
            <Link className="m-5" to={"/admin/upload-result"}>
              Result Upload
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
