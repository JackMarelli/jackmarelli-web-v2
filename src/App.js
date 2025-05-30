import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importing pages
import Landing from "./routes/Landing/Landing";
import Works from "./routes/Works/Works";
import WorkDetail from "./routes/WorkDetail/WorkDetail";

// Define routes
const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/work", element: <Works /> },
  { path: "/work/:slug", element: <WorkDetail /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;