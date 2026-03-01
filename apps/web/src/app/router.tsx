import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { guardAuth, guardGuest } from "@/app/guard";
import LandingPage from "@/features/landing/pages/page";
import NotFoundPage from "@/features/errors/NotFoundPage";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";

// ── Lazy pages ──
const LoginPage = lazy(() => import("@/features/auth/pages/page"));
const CallbackPage = lazy(() => import("@/features/auth/pages/callback"));
const OverviewPage = lazy(() => import("@/features/dashboard/pages/page"));

// Placeholder pages
const ResumesPage = lazy(() => import("@/features/resumes/pages/page"));
const JobsPage = lazy(() => import("@/features/jobs/pages/page"));
const InterviewsPage = lazy(() => import("@/features/interviews/pages/page"));
const ResultsPage = lazy(() => import("@/features/results/pages/page"));
const NewSessionPage = lazy(() => import("@/features/session/pages/new"));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-100">
      <div className="w-5 h-5 rounded-full border-2 border-brand/30 border-t-brand animate-spin" />
    </div>
  );
}

function LazyPage({
  component: Component,
}: {
  component: React.ComponentType;
}) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// Root
const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});

//  Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: guardGuest,
  component: () => <LazyPage component={LoginPage} />,
});

const callbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/callback",
  component: () => <LazyPage component={CallbackPage} />,
});

//  Dashboard
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: guardAuth,
  component: DashboardLayout,
});

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: () => <LazyPage component={OverviewPage} />,
});

const resumesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/resumes",
  component: () => <LazyPage component={ResumesPage} />,
});

const jobsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/jobs",
  component: () => <LazyPage component={JobsPage} />,
});

const interviewsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/interviews",
  component: () => <LazyPage component={InterviewsPage} />,
});

const resultsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/results",
  component: () => <LazyPage component={ResultsPage} />,
});

const newSessionRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/session/new",
  component: () => <LazyPage component={NewSessionPage} />,
});

// Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  callbackRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    resumesRoute,
    jobsRoute,
    interviewsRoute,
    resultsRoute,
    newSessionRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadDelay: 100,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
