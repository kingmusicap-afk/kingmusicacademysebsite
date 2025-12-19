import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import RulesAndRegulations from "./pages/RulesAndRegulations";
import Contact from "./pages/Contact";
import Scholarship from "./pages/Scholarship";
import ChurchPackage from "./pages/ChurchPackage";
import AdminBookingsDashboard from "./pages/AdminBookingsDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import EmailNotificationSettings from "./pages/EmailNotificationSettings";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/scholarship"} component={Scholarship} />
      <Route path={"/church-package"} component={ChurchPackage} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/bookings"} component={AdminBookingsDashboard} />
      <Route path={"/admin/analytics"} component={AnalyticsDashboard} />
      <Route path={"/admin/email-settings"} component={EmailNotificationSettings} />
      <Route path={"/rules-and-regulations"} component={RulesAndRegulations} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
