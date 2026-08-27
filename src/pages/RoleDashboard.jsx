import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaBookOpen,
  FaChevronDown,
  FaClock,
  FaHome,
  FaLayerGroup,
  FaSignOutAlt,
  FaSpinner,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { getCourses } from "../services/api";
import useStore, { storeActions } from "../store/useStore";

const roleCopy = {
  MENTOR: {
    label: "MENTOR PANEL",
    title: "Mentor Dashboard",
    subtitle: "Batches, courses, and mentor activity mapped to your access.",
    icon: <FaUserTie />,
  },
  STUDENT: {
    label: "STUDENT PANEL",
    title: "Student Dashboard",
    subtitle: "Courses and learning activity available for your account.",
    icon: <FaUserGraduate />,
  },
};

const menuByRole = {
  MENTOR: [
    {
      title: "Overview",
      icon: <FaHome />,
      items: [{ name: "Dashboard", icon: <FaHome /> }],
    },
    {
      title: "Batches",
      icon: <FaLayerGroup />,
      items: [
        { name: "Batches", icon: <FaLayerGroup /> },
        { name: "Batch Timings", icon: <FaClock /> },
      ],
    },
    {
      title: "Courses",
      icon: <FaBookOpen />,
      items: [{ name: "Courses", icon: <FaBookOpen /> }],
    },
    {
      title: "Account",
      icon: <FaUserTie />,
      items: [{ name: "Profile", icon: <FaUserTie /> }],
    },
  ],
  STUDENT: [
    {
      title: "Overview",
      icon: <FaHome />,
      items: [{ name: "Dashboard", icon: <FaHome /> }],
    },
    {
      title: "Courses",
      icon: <FaBookOpen />,
      items: [
        { name: "Courses", icon: <FaBookOpen /> },
        { name: "Enrollments", icon: <FaLayerGroup /> },
      ],
    },
    {
      title: "Account",
      icon: <FaUserGraduate />,
      items: [{ name: "Profile", icon: <FaUserGraduate /> }],
    },
  ],
};

const RoleDashboard = () => {
  const { auth } = useStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [openSections, setOpenSections] = useState({
    Overview: true,
    Batches: true,
    Courses: true,
    Account: true,
  });

  const role = auth?.user?.role;
  const copy = roleCopy[role];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses(auth.token);
        setCourses(data || []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (copy && auth?.token) {
      loadCourses();
    }
  }, [auth, copy]);

  const metrics = useMemo(
    () => ({
      courses: courses.length,
      batches: role === "MENTOR" ? 0 : "N/A",
      status: role || "USER",
    }),
    [courses, role]
  );

  if (!auth) return <Navigate to="/login" replace />;
  if (role === "SUPERADMIN" || role === "ADMIN") return <Navigate to="/admin/approvals" replace />;
  if (role === "COLLEGE") return <Navigate to="/college-dashboard" replace />;
  if (!copy) return <Navigate to="/" replace />;

  const sections = menuByRole[role] || menuByRole.STUDENT;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed left-0 top-0 h-screen w-[245px] border-r border-slate-200 bg-white px-4 py-6">
        <h1 className="text-2xl font-bold text-blue-700">First Track</h1>
        <p className="mt-1 text-xs font-semibold text-slate-500">Skills Academy</p>

        <nav className="mt-8 space-y-3">
          {sections.map((section) => (
            <SidebarSection
              key={section.title}
              section={section}
              activeMenu={activeMenu}
              isOpen={openSections[section.title]}
              onToggle={(title) => setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }))}
              onMenuClick={setActiveMenu}
            />
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 border-t border-slate-200 pt-5">
          <button
            onClick={storeActions.clearAuth}
            className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <section className="ml-[245px] min-h-screen">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-xl text-blue-700">
                {copy.icon}
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.28em] text-blue-700">{copy.label}</p>
                <h2 className="text-2xl font-bold leading-tight">{activeMenu}</h2>
                <p className="text-sm text-slate-500">{copy.subtitle}</p>
              </div>
            </div>
            <span className="rounded-full border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600">
              {role}
            </span>
          </div>
        </header>

        <main className="space-y-6 p-6">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center gap-3 font-semibold text-blue-700">
              <FaSpinner className="animate-spin" />
              Loading dashboard...
            </div>
          ) : (
            <>
              {activeMenu === "Dashboard" && (
                <>
                  <HeroPanel copy={copy} user={auth.user} metrics={metrics} />
                  <CoursePanel courses={courses} />
                </>
              )}
              {activeMenu === "Courses" && <CoursePanel courses={courses} />}
              {["Batches", "Batch Timings", "Enrollments"].includes(activeMenu) && (
                <PlaceholderPanel
                  icon={activeMenu === "Batch Timings" ? <FaClock /> : <FaLayerGroup />}
                  title={activeMenu}
                  description="This section is ready in the UI. Data will appear here when the backend endpoint is available."
                />
              )}
              {activeMenu === "Profile" && <ProfilePanel user={auth.user} />}
            </>
          )}
        </main>
      </section>
    </div>
  );
};

const SidebarSection = ({ section, activeMenu, isOpen, onToggle, onMenuClick }) => (
  <div>
    <button
      onClick={() => onToggle(section.title)}
      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 hover:bg-slate-50"
    >
      <span className="flex items-center gap-2">
        {section.icon}
        {section.title}
      </span>
      <FaChevronDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
    </button>
    {isOpen && (
      <div className="mt-1 grid gap-1.5">
        {section.items.map((item) => (
          <button
            key={item.name}
            onClick={() => onMenuClick(item.name)}
            className={`flex items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-semibold transition ${
              activeMenu === item.name
                ? "bg-blue-50 text-blue-800"
                : "text-slate-800 hover:bg-slate-100"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </div>
    )}
  </div>
);

const HeroPanel = ({ copy, user, metrics }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <div className="grid gap-6 xl:grid-cols-[1fr_480px] xl:items-center">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
          {copy.icon}
          {copy.label}
        </span>
        <h1 className="mt-6 text-4xl font-bold">{copy.title}</h1>
        <p className="mt-4 text-lg text-slate-600">
          Welcome {user.first_name || user.name || "back"}. Your menu is limited to the role and permissions on your account.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniMetric label="COURSES" value={metrics.courses} />
        <MiniMetric label="BATCHES" value={metrics.batches} />
        <MiniMetric label="ROLE" value={metrics.status} />
      </div>
    </div>
  </section>
);

const MiniMetric = ({ label, value }) => (
  <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-700">
    <p className="text-sm font-bold">{label}</p>
    <p className="mt-2 break-words text-2xl font-bold">{value}</p>
  </div>
);

const CoursePanel = ({ courses }) => (
  <Panel icon={<FaBookOpen />} title="Courses">
    {courses.length ? (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-blue-700">{course.category}</p>
            <h3 className="mt-2 text-xl font-bold">{course.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{course.duration_weeks} weeks</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-slate-600">No courses found.</p>
    )}
  </Panel>
);

const ProfilePanel = ({ user }) => (
  <Panel icon={<FaUserGraduate />} title="Profile">
    <div className="grid gap-4 md:grid-cols-3">
      <InfoBox label="Name" value={[user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ") || user.name || "N/A"} />
      <InfoBox label="Email" value={user.email} />
      <InfoBox label="Role" value={user.role} />
    </div>
  </Panel>
);

const PlaceholderPanel = ({ icon, title, description }) => (
  <Panel icon={icon} title={title}>
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center font-semibold text-slate-500">
      {description}
    </div>
  </Panel>
);

const InfoBox = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-bold text-slate-500">{label}</p>
    <p className="mt-2 break-words text-lg font-semibold text-slate-900">{value}</p>
  </div>
);

const Panel = ({ icon, title, children }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-lg text-slate-700">
        {icon}
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    {children}
  </section>
);

export default RoleDashboard;
