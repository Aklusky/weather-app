import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/sonner";
import { WeatherDashboard } from "./pages/weather-dashboard";
import { Layout } from "./components/layout";
import { ThemeProvider } from "./context/theme-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CityPage } from "./pages/city-page";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}version.json?v=${Date.now()}`,
          { cache: "no-store" }
        );

        const data = await response.json();
        const savedVersion = localStorage.getItem("app-version");

        if (savedVersion && savedVersion !== data.version) {
          localStorage.setItem("app-version", data.version);
          window.location.reload();
          return;
        }

        localStorage.setItem("app-version", data.version);
      } catch {
        // Ignore if version check fails
      }
    };

    checkVersion();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark">
          <Layout>
            <Routes>
              <Route path="/" element={<WeatherDashboard />} />
              <Route path="/city/:cityName" element={<CityPage />} />
            </Routes>
          </Layout>
          <Toaster richColors />
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;