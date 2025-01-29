import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
