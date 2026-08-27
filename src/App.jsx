import { useEffect} from "react";
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
import Login from "./pages/Login";
import CollegeOnboarding from "./pages/CollegeOnboarding";
import AdminOnboarding from "./pages/AdminOnboarding";
import PartnerJoin from "./pages/PartnerJoin";
import AdminApprovals from "./pages/AdminApprovals";
import CollegeDashboard from "./pages/CollegeDashboard";
import RoleDashboard from "./pages/RoleDashboard";
import PartnerEnroll from "./pages/PartnerEnroll";
import { ToastContainer } from 'react-toastify';

function App() {
  const { pathname} = useLocation();
  const isDashboardRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/college-dashboard") || pathname.startsWith("/admin/approvals");

  useEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);
  

  return (
    <>
      <ToastContainer />
      {!isDashboardRoute && <Navbar />}
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
        <Route path="/login" element={<Login />} />
        <Route path="/college-onboarding" element={<CollegeOnboarding />} />
        <Route path="/admin-onboarding" element={<AdminOnboarding />} />
        <Route path="/admin/approvals" element={<AdminApprovals />} />
        <Route path="/college-dashboard" element={<CollegeDashboard />} />
        <Route path="/dashboard" element={<RoleDashboard />} />
        <Route path="/join/:partnerCode/enroll" element={<PartnerEnroll />} />
        <Route path="/join/:partnerCode" element={<PartnerJoin />} />
      </Routes>

      {!isDashboardRoute && <Footer />}
    </>
  );
}

export default App;
