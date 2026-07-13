import React, { useEffect} from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import ProgramFees from "./pages/ProgramFees";
import FrontendCourse from "./pages/FrontendCourse";
import BackendCourse from "./pages/BackendCourse";
import FullStackCourse from "./pages/FullStackCourse";
import MarketingCourse from "./pages/MarketingCourse";
import Career from "./pages/Career";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import RefundCancel from "./pages/RefundCancel";
import FAQ from "./pages/FAQ";
import Enroll from "./pages/Enroll";

function App() {
  const { pathname} = useLocation();

  useEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);
  

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/program-details" element={<ProgramFees />} />
        <Route path="/frontend-course" element={<FrontendCourse />} />
        <Route path="/backend-course" element={<BackendCourse />} />
        <Route path="/fullstack-course" element={<FullStackCourse />} />
        <Route path="/marketing-course" element={<MarketingCourse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/refund-cancel" element={<RefundCancel />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/career" element={<Career />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/enroll" element={<Enroll />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;