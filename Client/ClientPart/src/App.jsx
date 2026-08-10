import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView";
import Register from "./Components/Register";
import Login from "./Components/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/*",
    element: <DirectoryView />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
