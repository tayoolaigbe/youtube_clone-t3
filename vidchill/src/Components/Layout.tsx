import { useState } from "react";
import Menu from "./Icons/Menu";
import { Footer, Sidebar, Navbar } from "./Component";

interface LayoutProps {
  children: JSX.Element;
  closeSidebar?: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Layout = ({ children, closeSidebar }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Navbar>
        <button
          type="button"
          className="mx-2 inline-flex items-center justify-center rounded-md p-2 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6 stroke-gray-400" aria-hidden="true" />
        </button>
      </Navbar>
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={closeSidebar}
        setSidebarOpen={setSidebarOpen}
      ></Sidebar>

      <div className="lg:hidden">
        <Footer />{" "}
      </div>
      <div className={classNames(closeSidebar ? "lg:pl-20" : "lg:pl-56")}>
        <main className="py-24">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-x-4">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
