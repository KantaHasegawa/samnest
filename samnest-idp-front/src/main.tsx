import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SpIniticatedLogin } from "./SpIniticatedLogin.tsx";

document.title = "認証基盤";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "sp-initicated-login/",
    element: <SpIniticatedLogin />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
