import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ADMIN_BASE } from "./admin/paths.ts";
import { PRIVACY_POLICY } from "./data/legal/privacy.ts";
import { TERMS_AND_CONDITIONS } from "./data/legal/terms.ts";
import { PRIVACY_PATH, TERMS_PATH } from "./lib/routes.ts";
import { HomePage } from "./pages/HomePage.tsx";
import { LegalPage } from "./pages/LegalPage.tsx";

const AdminApp = lazy(() => import("./admin/AdminApp.tsx").then((m) => ({ default: m.AdminApp })));

const HOME_TITLE = document.title;

/** Old links used #privacy and #terms; send them to the real pages. */
const LEGACY_HASHES: Record<string, string> = { "#privacy": PRIVACY_PATH, "#terms": TERMS_PATH };

/** Resets scroll and the document title on navigation; the browser does neither for client-side routes. */
function PageEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (pathname === PRIVACY_PATH) document.title = `${PRIVACY_POLICY.title} | R&R Glimzo`;
    else if (pathname === TERMS_PATH) document.title = `${TERMS_AND_CONDITIONS.title} | R&R Glimzo`;
    else if (!pathname.startsWith(ADMIN_BASE)) document.title = HOME_TITLE;
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <PageEffects />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={PRIVACY_PATH} element={<LegalPage document={PRIVACY_POLICY} />} />
        <Route path={TERMS_PATH} element={<LegalPage document={TERMS_AND_CONDITIONS} />} />
        <Route
          path={`${ADMIN_BASE}/*`}
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const { hash } = useLocation();
  const legacy = LEGACY_HASHES[hash];
  return legacy ? <Navigate to={legacy} replace /> : <HomePage />;
}
