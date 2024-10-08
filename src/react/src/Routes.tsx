import { Route, Routes } from "react-router-dom";
import ManualTesting from "./pages/ManualTesting";
import Home from "./pages/Home";
import Visualisation from "./pages/Visualisation";
import Experience from "./pages/Experience";
import Annotate from "./pages/Annotate";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="manual-testing" element={<ManualTesting />} />
        <Route path="visualisation" element={<Visualisation />} />
        <Route path="experience" element={<Experience />} />
        <Route path="annotate" element={<Annotate />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
