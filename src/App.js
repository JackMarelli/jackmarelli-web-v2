import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importing pages
import Landing from "./routes/Landing/Landing";

// Define routes
const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
