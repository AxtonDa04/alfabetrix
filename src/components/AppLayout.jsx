import { Outlet, useLocation } from "react-router-dom";
import { useSettings } from "../lib/useSettings";
import BottomNavigation from "./BottomNavigation";

const ROUTES_WITH_BOTTOM_NAV = [
  "/menu",
  "/modules",
  "/progress",
  "/games",
  "/help",
  "/settings",
];

function shouldShowBottomNav(pathname) {
  return ROUTES_WITH_BOTTOM_NAV.includes(pathname);
}

export default function AppLayout() {
  const { fontClass, contrastClass } = useSettings();
  const location = useLocation();
  const showBottomNav = shouldShowBottomNav(location.pathname);

  return (
    <div
      className={`app-root bg-background font-nunito ${fontClass} ${contrastClass} ${
        showBottomNav ? "has-bottom-nav" : ""
      }`}
    >
      <Outlet />
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
