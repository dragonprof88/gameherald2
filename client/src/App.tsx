import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/common/scroll-to-top";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import News from "@/pages/news";
import Article from "@/pages/article";
import Reviews from "@/pages/reviews";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/news" component={News} />
      <Route path="/article/:id" component={Article} />
      <Route path="/reviews" component={Reviews} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-primary-950 text-white flex flex-col">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
