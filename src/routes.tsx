import { Route, Routes } from "react-router-dom";
import Challenge1 from "./Challenge1";
import Challenge2 from "./Challenge2";
import Challenge3 from "./Challenge3";
import Challenge4 from "./Challenge4";
import Challenge5 from "./Challenge5";
import Home from "./Home";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/challenge1" element={<Challenge1 />} />
            <Route path="/challenge2" element={<Challenge2 />} />
            <Route path="/challenge3" element={<Challenge3 />} />
            <Route path="/challenge4" element={<Challenge4 />} />
            <Route path="/challenge5" element={<Challenge5 />} />
        </Routes>
    );
}
