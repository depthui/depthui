import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import ComponentsPage from "@/pages/components-page";
import DemoPage from "@/pages/demo-page";

/** Scroll to the #hash target (or the top) after each navigation. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section has mounted.
      const t = window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      }, 50);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<DemoPage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/demo" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </>
  );
}
