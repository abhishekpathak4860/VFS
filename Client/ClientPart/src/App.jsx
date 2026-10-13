import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView";
import Register from "./Components/Register";
import Login from "./Components/Login";
import UserPage from "./UserPage";
import AdminManagerLogin from "./Components/AdminManagerLogin";
import ManagerPage from "./ManagerPage";
import StaffRoute from "./Components/StaffRoute";
import StaffLayout from "./Components/StaffLayout";

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
    path: "/admin-manager-login",
    element: <AdminManagerLogin />,
  },
  {
    path: "/admin",
    element: (
      <StaffRoute allowedRole="admin">
        <StaffLayout role="admin">
          <UserPage />
        </StaffLayout>
      </StaffRoute>
    ),
  },
  {
    path: "/manager",
    element: (
      <StaffRoute allowedRole="manager">
        <StaffLayout role="manager">
          <ManagerPage />
        </StaffLayout>
      </StaffRoute>
    ),
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
