import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./routes/Root";
import ErrorPage from "./ErrorPage";

import Upgrade from "./routes/games/Upgrade";
import Game from "./routes/games/Mines/Game";
import GamePlinko from "./routes/games/Plinko/GamePlinko";

import Withdraw from "./routes/wallet/Withdraw";
import Deposit from "./routes/wallet/Deposit";
import GameHistory from "./routes/games/GameHistory";







const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "plinko",
        element: <GamePlinko />,
      },
      {
        path: "upgrade",
        element: <Upgrade />,
      },
      {
        path: "mines",
        element: <Game/>,
      },
      {
        path: "deposit",
        element: <Deposit/>,
      },
      {
        path: "withdraw",
        element: <Withdraw/>,
      },
      {
        path: "gameHistory",
        element: <GameHistory/>,
      }


    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);