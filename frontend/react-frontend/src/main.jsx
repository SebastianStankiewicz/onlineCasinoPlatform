import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./routes/Root";
import ErrorPage from "./ErrorPage";
import Plinko from "./routes/games/Plinko";
import Upgrade from "./routes/games/Upgrade";
import Game from "./routes/games/Mines/Game";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "plinko",
        element: <Plinko />,
      },
      {
        path: "upgrade",
        element: <Upgrade />,
      },
      {
        path: "mines",
        element: <Game/>,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);