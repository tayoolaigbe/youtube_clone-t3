import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import {
  ClockRewind,
  Folder,
  Home,
  ThumbsUp,
  UserCheck,
  VideoRecorder,
} from "./Icons/Icons";
import Link from "next/link";

interface SidebarProps {
  // isOpen: boolean;
  // setSidebarOpen: (open: boolean) => void;
  closeSidebar?: boolean;
}

interface NavigationItem {
  name: string;
  path?: string;
  icon: (className: string) => JSX.Element;
  current: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const Sidebar = ({
  // isOpen, setSidebarOpen,
  closeSidebar,
}: SidebarProps) => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  const router = useRouter();

  const DesktopNavigation: NavigationItem[] = [
    {
      name: "Home",
      path: "/",
      icon: (className) => <Home className={className} />,
      current: router.pathname === "/",
    },
    {
      name: "Liked Videos",
      path: userId ? "/playlist/LikedVideos" : "sign-in",
      icon: (className) => <ThumbsUp className={className} />,
      current: router.pathname === "/playlist/LikedVideos",
    },
    {
      name: "History",
      path: userId ? "/playlist/History" : "sign-in",
      icon: (className) => <ClockRewind className={className} />,
      current: router.pathname === "/playlist/History",
    },
    {
      name: "Your Videos",
      path: userId ? `/${String(userId)}/ProfileVideos` : "sign-in",
      icon: (className) => <VideoRecorder className={className} />,
      current: router.pathname === `/${String(userId)}/ProfileVideos`,
    },
    {
      name: "`Library`",
      path: userId ? `/${String(userId)}/ProfilePlaylists` : "sign-in",
      icon: (className) => <Folder className={className} />,
      current: router.pathname === `/${String(userId)}/ProfilePlaylists`,
    },
    {
      name: "`Following`",
      path: userId ? `/${String(userId)}/ProfileFollowing` : "sign-in",
      icon: (className) => <UserCheck className={className} />,
      current: router.pathname === `/${String(userId)}/ProfileFollowing`,
    },
  ];
  return (
    <>
      <div
        className={classNames(
          closeSidebar ? "lg:w-20" : "lg:w-56",
          "bottom-0 top-16 hidden lg:fixed lg:z-40 lg:flex lg:flex-col",
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border border-gray-200 bg-white px-6 pb-4">
          <nav className="flex flex-1 flex-col pt-8">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {DesktopNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href="#"
                        className={classNames(
                          item.current
                            ? "bg-gray-50 text-primary-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-primary-600",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                        )}
                      >
                        {item.current
                          ? item.icon("h-5 w-5 shrink-0 stroke-primary-600")
                          : item.icon(
                              "h-5 w-5 shrink-0 stroke-gray-500 group:hover:stroke-primary-600",
                            )}
                        <p className={classNames(closeSidebar ? "hideen" : "")}>
                          {item.name}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto"></li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
