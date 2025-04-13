
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContactProvider } from "./context/ContactContext";
import { LanguageProvider } from "./context/LanguageContext";
import HomePage from "./pages/HomePage";
import AddContactPage from "./pages/AddContactPage";
import ContactDetailsPage from "./pages/ContactDetailsPage";
import SearchPage from "./pages/SearchPage";
import TranslationEditorPage from "./pages/TranslationEditorPage";
import ParametersPage from "./pages/ParametersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <ContactProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/add-contact" element={<AddContactPage />} />
              <Route path="/contact/:id" element={<ContactDetailsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/translations" element={<TranslationEditorPage />} />
              <Route path="/parameters" element={<ParametersPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ContactProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
