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
import { getBatches, getCourses } from "../service/courseService";
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
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [openSections, setOpenSections] = useState({
    Overview: true,
    Batches: false,
    Courses: false,
    Account: false,
  });

  const role = auth?.user?.role;
  const copy = roleCopy[role];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courseData = await getCourses(auth.token);
        setCourses(courseData || []);

        if (role === "MENTOR") {
          const batchData = await getBatches();
          setBatches(batchData || []);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (copy && auth?.token) {
      loadCourses();
    }
  }, [auth, copy, role]);

  const metrics = useMemo(
    () => ({
      courses: courses.length,
      batches: role === "MENTOR" ? batches.length : "N/A",
      status: role || "USER",
    }),
    [batches, courses, role]
  );

  if (!auth) return <Navigate to="/login" replace />;
  if (role === "SUPERADMIN" || role === "ADMIN") return <Navigate to="/admin/approvals" replace />;
  if (role === "COLLEGE") return <Navigate to="/college-dashboard" replace />;
  if (!copy) return <Navigate to="/" replace />;

  const sections = menuByRole[role] || menuByRole.STUDENT;

  const handleMenuClick = (name) => {
    setActiveMenu(name);
    if (name !== "Batch Details") {
      setSelectedBatch(null);
    }
  };

  const openBatch = (batch) => {
    setSelectedBatch(batch);
    setActiveMenu("Batch Details");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="border-b border-slate-200 bg-white px-4 py-5 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[245px] lg:border-b-0 lg:border-r lg:py-6">
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
              onMenuClick={handleMenuClick}
            />
          ))}
        </nav>

        <div className="mt-8 border-t border-slate-200 pt-5 lg:absolute lg:bottom-6 lg:left-4 lg:right-4 lg:mt-0">
          <button
            onClick={storeActions.clearAuth}
            className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <section className="min-h-screen lg:ml-[245px]">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-xl text-blue-700">
                {copy.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-[0.2em] text-blue-700 sm:tracking-[0.28em]">{copy.label}</p>
                <h2 className="break-words text-2xl font-bold leading-tight">{activeMenu}</h2>
                <p className="text-sm text-slate-500">{copy.subtitle}</p>
              </div>
            </div>
            <span className="w-fit rounded-full border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600">
              {role}
            </span>
          </div>
        </header>

        <main className="space-y-6 p-4 sm:p-6">
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
                  {role === "MENTOR" && <BatchPanel batches={batches} onOpenBatch={openBatch} />}
                </>
              )}
              {activeMenu === "Courses" && <CoursePanel courses={courses} />}
              {activeMenu === "Batches" && <BatchPanel batches={batches} onOpenBatch={openBatch} />}
              {activeMenu === "Batch Details" && selectedBatch && (
                <BatchDetails batch={selectedBatch} onBack={() => handleMenuClick("Batches")} />
              )}
              {activeMenu === "Batch Timings" && <BatchTimingsPanel batches={batches} />}
              {activeMenu === "Enrollments" && (
                <PlaceholderPanel
                  icon={<FaLayerGroup />}
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,480px)] xl:items-center">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
          {copy.icon}
          {copy.label}
        </span>
        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{copy.title}</h1>
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

const BatchPanel = ({ batches, onOpenBatch }) => (
  <Panel icon={<FaLayerGroup />} title="Batches">
    {batches.length ? (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {batches.map((batch) => (
          <button
            key={batch.id}
            onClick={() => onOpenBatch(batch)}
            className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/30"
          >
            <p className="text-xs font-bold text-blue-700">{batch.course?.category || "COURSE"}</p>
            <h3 className="mt-2 text-xl font-bold">{batch.batch_name}</h3>
            <p className="mt-2 text-sm font-semibold text-slate-700">{batch.course?.title || "Course not found"}</p>
            <div className="mt-5 grid gap-2 text-sm text-slate-500">
              <p>{batch.batch_timing}</p>
              <p>{batch.start_date || "Start date not added"}</p>
            </div>
            <span className="mt-5 inline-flex rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
              View Details
            </span>
          </button>
        ))}
      </div>
    ) : (
      <p className="text-slate-600">No batches assigned yet.</p>
    )}
  </Panel>
);

const BatchDetails = ({ batch, onBack }) => (
  <Panel icon={<FaLayerGroup />} title={batch.batch_name}>
    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-bold text-blue-700">{batch.course?.title || "Course not found"}</p>
        <p className="mt-1 text-slate-500">{batch.course?.duration_weeks || "N/A"} weeks</p>
      </div>
      <button
        onClick={onBack}
        className="rounded-md border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
      >
        Back to Batches
      </button>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <InfoBox label="Batch Timing" value={batch.batch_timing} />
      <InfoBox label="Start Date" value={batch.start_date || "N/A"} />
      <InfoBox label="End Date" value={batch.end_date || "N/A"} />
      <InfoBox label="Status" value={batch.status} />
      <InfoBox label="Course Category" value={batch.course?.category || "N/A"} />
      <InfoBox label="Mentor Email" value={batch.mentor?.email || "N/A"} />
    </div>
  </Panel>
);

const BatchTimingsPanel = ({ batches }) => (
  <Panel icon={<FaClock />} title="Batch Timings">
    {batches.length ? (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {batches.map((batch) => (
          <InfoBox
            key={batch.id}
            label={batch.batch_name}
            value={`${batch.batch_timing} | ${batch.start_date || "No start date"}`}
          />
        ))}
      </div>
    ) : (
      <p className="text-slate-600">No batch timings found.</p>
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
  <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
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
