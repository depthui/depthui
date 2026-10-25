import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

// Every page is its own chunk, so a visit downloads only the code it needs.
const DemoPage = lazy(() => import("@/pages/demo-page"));
const ComponentsLayout = lazy(() => import("@/pages/components-layout"));
const ComponentsIndex = lazy(() => import("@/pages/components-index"));
const ComponentDoc = lazy(() => import("@/pages/component-doc"));

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

function PageFallback() {
  return <div aria-busy aria-label="Loading" className="min-h-screen bg-depth-bg" />;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<DemoPage />} />
          <Route path="/components" element={<ComponentsLayout />}>
            <Route index element={<ComponentsIndex />} />
            <Route path=":slug" element={<ComponentDoc />} />
          </Route>
          <Route path="/demo" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Analytics />
    </>
  );
}
