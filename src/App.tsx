import { lazy, Suspense, useEffect, useSyncExternalStore } from "react";
import { PRIVACY_POLICY } from "./data/legal/privacy.ts";
import { TERMS_AND_CONDITIONS } from "./data/legal/terms.ts";
import { PRIVACY_HASH, TERMS_HASH } from "./lib/routes.ts";
import { HomePage } from "./pages/HomePage.tsx";
import { LegalPage } from "./pages/LegalPage.tsx";

const AdminApp = lazy(() => import("./admin/AdminApp.tsx").then((m) => ({ default: m.AdminApp })));
const ADMIN_BASE = "/0/v1/admin";
const isAdminPath = () => location.pathname === ADMIN_BASE || location.pathname.startsWith(`${ADMIN_BASE}/`);

const HOME_TITLE = document.title;

const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

/** Only the legal pages are routes; every other hash is an anchor on the home page. */
const currentPage = () => (location.hash === PRIVACY_HASH || location.hash === TERMS_HASH ? location.hash : "");

/** Switches between the site's pages by URL hash, so the site needs no server-side routing. */
export function App() {
  if (isAdminPath()) return <Suspense fallback={null}><AdminApp /></Suspense>;
  return <Site />;
}

function Site() {
  const page = useSyncExternalStore(subscribe, currentPage);
  const legal = page === PRIVACY_HASH ? PRIVACY_POLICY : page === TERMS_HASH ? TERMS_AND_CONDITIONS : null;

  // Browsers scroll to a hash before the new page renders, so scroll again once it has.
  useEffect(() => {
    document.title = legal ? `${legal.title} | R&R Glimzo` : HOME_TITLE;
    const target = legal ? null : document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [legal]);

  return legal ? <LegalPage document={legal} hash={page} /> : <HomePage />;
}
