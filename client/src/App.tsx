import { useState, useEffect, Suspense } from "react";
import { applyTheme } from "./lib/theme";
import { Router, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import "./i18n"; // Import i18n initialization

// Components
import CustomCursor from "./components/CustomCursor";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import MobileMenu from "./components/MobileMenu";
import ThemeSelector from "./components/ThemeSelector";
import ParticleBackground from "./components/ParticleBackground";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import SkillsSection from "./components/sections/SkillsSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import ExperienceSection from "./components/sections/ExperienceSection";
import AchievementsSection from "./components/sections/AchievementsSection";
import ResumeSection from "./components/sections/ResumeSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/sections/Footer";

// Features
import LanguageSwitcher from "./components/features/LanguageSwitcher";
import AIChatbot from "./components/features/AIChatbot";


// Pages
import NotFound from "./pages/not-found";

function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Apply default theme (gold)
    applyTheme('gold');

    // Disable scrolling when menu is open
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<div className="h-screen w-screen bg-black"></div>}>
          {loading ? (
            <Loader onComplete={() => setLoading(false)} />
          ) : (
            <div className="relative">
              <CustomCursor />
              <ParticleBackground />

              <Navbar onMenuToggle={handleMenuToggle} />
              <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

              {/* UI Controls */}
              <div className="fixed z-40 bottom-8 right-8 flex flex-col space-y-4">
                <ThemeSelector />
                <LanguageSwitcher />
              </div>

              <main>
                <Route path="/">
                  <HeroSection />
                  <AboutSection />
                  <SkillsSection />
                  <ProjectsSection />
                  <ExperienceSection />
                  <AchievementsSection />
                  <ResumeSection />
                  <ContactSection />
                </Route>
                <Route path="/404" component={NotFound} />
              </main>

              <Footer />

              {/* Features */}
              <AIChatbot />
            </div>
          )}
          <Toaster />
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}

export default App;