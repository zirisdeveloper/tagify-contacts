
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContactProvider } from "./context/ContactContext";
import HomePage from "./pages/HomePage";
import AddContactPage from "./pages/AddContactPage";
import ContactDetailsPage from "./pages/ContactDetailsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ContactProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-contact" element={<AddContactPage />} />
            <Route path="/contact/:id" element={<ContactDetailsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ContactProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
