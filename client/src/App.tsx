import { useState, useEffect } from "react";
import { applyTheme } from "./lib/theme";
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
    <>
      {loading ? (
        <Loader onComplete={() => setLoading(false)} />
      ) : (
        <div className="relative">
          <CustomCursor />
          <ParticleBackground />
          
          <Navbar onMenuToggle={handleMenuToggle} />
          <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
          <ThemeSelector />
          
          <main>
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <ExperienceSection />
            <AchievementsSection />
            <ResumeSection />
            <ContactSection />
          </main>
          
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
