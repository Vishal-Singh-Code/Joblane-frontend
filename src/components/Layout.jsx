import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

function Layout() {
    return (
        <>
            <Navbar />
            <main >
                <Outlet />
            </main>
            <Footer/>
        </>
    );
}

export default Layout;
