import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaBookOpen,
  FaChartBar,
  FaChevronDown,
  FaClock,
  FaFolderOpen,
  FaHome,
  FaLink,
  FaSignOutAlt,
  FaSpinner,
  FaUsers,
  FaUserGraduate,
} from "react-icons/fa";
import useStore, { storeActions } from "../store/useStore";
import { getCollegeDashboard } from "../service/collegeService";

const menuSections = [
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
      { name: "Students", icon: <FaUsers /> },
    ],
  },
  {
    title: "College",
    icon: <FaUserGraduate />,
    items: [
      { name: "Partner Link", icon: <FaLink /> },
      { name: "Profile", icon: <FaUserGraduate /> },
    ],
  },
];

const fullName = (student) =>
  [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(" ");

const CollegeDashboard = () => {
  const { auth } = useStore();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [openSections, setOpenSections] = useState({
    Overview: true,
    Courses: false,
    College: false,
  });
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getCollegeDashboard(auth.token);
        setDashboard(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) loadDashboard();
  }, [auth]);

  const allStudents = useMemo(() => {
    if (!dashboard?.courses) return [];
    return dashboard.courses.flatMap((course) =>
      course.students.map((student) => ({ ...student, course_title: course.title }))
    );
  }, [dashboard]);

  if (!auth) return <Navigate to="/login" replace />;
  if (auth.user.role !== "COLLEGE") return <Navigate to="/" replace />;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f6fa] flex items-center justify-center text-blue-700 font-semibold">
        <FaSpinner className="animate-spin mr-3" />
        Loading dashboard...
      </div>
    );
  }

  const profile = dashboard?.profile;

  if (profile?.status !== "APPROVED") {
    return (
      <div className="min-h-screen bg-[#f3f6fa] flex items-center justify-center p-5">
        <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-8 sm:p-10 text-center">
          <p className="text-blue-700 font-bold tracking-[0.3em] text-sm">COLLEGE PANEL</p>
          <h1 className="text-4xl font-bold mt-3">Awaiting Approval</h1>
          <p className="text-slate-600 mt-4">Your college account has been created. An admin will review it shortly.</p>
          <p className="text-2xl font-bold text-blue-700 mt-6">{profile?.status || "PENDING"}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3 font-semibold text-white transition shadow-sm"
            >
              <FaHome />
              Back to Homepage
            </Link>
            <button
              onClick={storeActions.clearAuth}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-6 py-3 font-semibold text-slate-700 transition shadow-sm"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  const openCourse = (course) => {
    setSelectedCourse(course);
    setActiveMenu("Course Details");
  };

  const handleMenuClick = (name) => {
    setActiveMenu(name);
    setSelectedCourse(null);
  };

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-slate-950">
      <aside className="border-b border-slate-200 bg-white px-4 py-5 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[245px] lg:border-b-0 lg:border-r lg:py-6">
        <Link to="/" className="group mb-6 block" title="Go to Website Homepage">
          <div className="flex items-center gap-3">
            <img
              src="/images/companylogo.jpg"
              alt="First Track"
              className="h-10 w-10 rounded-full border-2 border-orange-500 object-cover shadow-sm transition group-hover:scale-105"
            />
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 transition group-hover:text-orange-500 leading-tight">
                First Track <span className="text-orange-500">Skills</span>
              </h1>
              <p className="text-xs font-semibold text-slate-500">College Portal</p>
            </div>
          </div>
        </Link>

        <div className="mb-6 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700 shadow-sm transition hover:bg-orange-100 hover:text-orange-800"
          >
            <FaHome className="text-base text-orange-500" />
            Back to Homepage
          </Link>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              to="/courses"
              className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-2 font-bold text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition shadow-sm"
            >
              Courses
            </Link>
            <Link
              to="/career"
              className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-2 font-bold text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition shadow-sm"
            >
              Career
            </Link>
          </div>
        </div>

        <nav className="mt-6 space-y-3">
          {menuSections.map((section) => (
            <SidebarSection
              key={section.title}
              section={section}
              activeMenu={activeMenu}
              isOpen={openSections[section.title]}
              onToggle={toggleSection}
              onMenuClick={handleMenuClick}
            />
          ))}
        </nav>

        <div className="mt-8 border-t pt-5 lg:absolute lg:bottom-6 lg:left-4 lg:right-4 lg:mt-0">
          <button
            onClick={storeActions.clearAuth}
            className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-red-600"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:ml-[245px]">
        <header className="sticky top-0 z-20 border-b border-orange-100 bg-white/95 backdrop-blur-md px-4 py-3.5 shadow-sm sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <div className="flex min-w-0 items-center gap-3.5 sm:gap-5">
              {/* Attached Brand Logo on Upper Bar */}
              <Link to="/" className="group flex shrink-0 items-center gap-3" title="First Track Skills Academy">
                <img
                  src="/images/companylogo.jpg"
                  alt="First Track"
                  className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border-2 border-orange-500 object-cover shadow-md transition group-hover:scale-105"
                />
                <div className="leading-tight">
                  <h1 className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">
                    First Track <span className="text-orange-500">Skills Academy</span>
                  </h1>
                  <p className="text-[11px] font-semibold text-gray-500 hidden sm:block">
                    Learn • Grow • Succeed
                  </p>
                </div>
              </Link>

              {/* Vertical divider */}
              <div className="hidden md:block h-10 w-px bg-orange-200"></div>

              {/* Active Menu & Panel Info */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="hidden lg:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-xl text-orange-600 shadow-sm">
                  <FaChartBar />
                </div>
                <div className="min-w-0">
                  <span className="inline-block bg-orange-100 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                    COLLEGE PANEL
                  </span>
                  <h2 className="break-words text-xl sm:text-2xl font-bold text-gray-900 leading-tight mt-0.5">{activeMenu}</h2>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Link
                to="/"
                className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-orange-700 shadow-sm transition hover:bg-orange-100 hover:text-orange-800"
                title="Return to Website Homepage"
              >
                <FaHome className="text-orange-500" />
                <span>Homepage</span>
              </Link>
              <Link
                to="/courses"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                title="Browse Courses"
              >
                <span>Courses</span>
              </Link>
              <Link
                to="/career"
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                title="Explore Career Portal"
              >
                <span>Career</span>
              </Link>
              <div className="w-fit rounded-full border border-orange-200 bg-orange-50/50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-orange-700">
                {auth.user.role}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 space-y-6 sm:p-6">
          {activeMenu === "Dashboard" && (
            <>
              <HeroPanel profile={profile} metrics={dashboard.metrics} />
              <MetricSection dashboard={dashboard} />
              <CourseSummary courses={dashboard.courses} onOpenCourse={openCourse} />
            </>
          )}

          {activeMenu === "Courses" && (
            <CourseSummary courses={dashboard.courses} onOpenCourse={openCourse} />
          )}

          {activeMenu === "Course Details" && selectedCourse && (
            <CourseDetails course={selectedCourse} onBack={() => setActiveMenu("Courses")} />
          )}

          {activeMenu === "Students" && (
            <Panel icon={<FaUsers />} title="Students">
              <PagedStudentTable students={allStudents} showCourse />
            </Panel>
          )}

          {activeMenu === "Partner Link" && <PartnerPanel profile={profile} />}
          {activeMenu === "Profile" && <ProfilePanel profile={profile} />}
        </main>
      </div>
    </div>
  );
};

const HeroPanel = ({ profile, metrics }) => (
  <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 sm:p-6">
    <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(280px,520px)] gap-6 items-center">
      <div>
        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-4 py-2 text-sm font-bold">
          <FaChartBar />
          LIVE COLLEGE OPERATIONS
        </span>
        <h1 className="break-words text-3xl font-bold mt-6 sm:text-4xl">{profile.college_name}</h1>
        <p className="text-lg text-slate-600 mt-4">
          Monitor enrolled students, course movement, batch activity, and partner link performance.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <MiniMetric label="TOTAL STUDENTS" value={metrics.total_students} tone="blue" />
        <MiniMetric label="COURSES" value={metrics.total_courses} tone="green" />
        <MiniMetric label="BATCHES" value={metrics.active_batches} tone="amber" />
        <MiniMetric label="STATUS" value={profile.status} tone="violet" />
      </div>
    </div>
  </section>
);

const MiniMetric = ({ label, value, tone }) => {
  const styles = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    green: "bg-emerald-50 border-emerald-100 text-emerald-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    violet: "bg-indigo-50 border-indigo-100 text-indigo-700",
  };

  return (
    <div className={`border rounded-lg p-4 ${styles[tone]}`}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

const MetricSection = ({ dashboard }) => (
  <Panel icon={<FaFolderOpen />} title="Course And Student Metrics">
    <div className="grid gap-5 md:grid-cols-3">
      <MetricCard label="TOTAL STUDENTS" value={dashboard.metrics.total_students} icon={<FaUsers />} tone="blue" />
      <MetricCard label="COURSES WITH STUDENTS" value={dashboard.metrics.total_courses} icon={<FaBookOpen />} tone="green" />
      <MetricCard label="ACTIVE BATCH TIMINGS" value={dashboard.metrics.active_batches} icon={<FaClock />} tone="amber" />
    </div>
  </Panel>
);

const MetricCard = ({ label, value, icon, tone }) => {
  const styles = {
    blue: "text-blue-700 bg-blue-50 border-blue-100",
    green: "text-emerald-700 bg-emerald-50 border-emerald-100",
    amber: "text-amber-700 bg-amber-50 border-amber-100",
  };

  return (
    <div className="border border-slate-200 rounded-lg p-5 shadow-sm bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-wide text-slate-500">{label}</p>
          <p className="text-4xl font-bold mt-4">{value}</p>
        </div>
        <div className={`h-14 w-14 rounded-xl border flex items-center justify-center text-2xl ${styles[tone]}`}>
          {icon}
        </div>
      </div>
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
                ? "bg-orange-50 text-orange-600 font-bold border-r-4 border-orange-500"
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

const CourseSummary = ({ courses, onOpenCourse }) => (
  <Panel icon={<FaBookOpen />} title="Courses">
    {courses.length === 0 ? (
      <p className="text-slate-600">No students enrolled yet.</p>
    ) : (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => onOpenCourse(course)}
            className="text-left border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition"
          >
            <p className="text-xs font-bold tracking-wide text-blue-700">{course.category}</p>
            <h3 className="text-xl font-bold mt-2">{course.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{course.duration_weeks} weeks</p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">ENROLLED STUDENTS</p>
                <p className="text-4xl font-bold mt-2">{course.students_count}</p>
              </div>
              <span className="rounded-md bg-blue-50 border border-blue-100 text-blue-700 px-3 py-2 text-sm font-bold">
                View Details
              </span>
            </div>
          </button>
        ))}
      </div>
    )}
  </Panel>
);

const CourseDetails = ({ course, onBack }) => (
  <Panel icon={<FaBookOpen />} title={course.title}>
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <p className="text-sm font-bold text-blue-700">{course.category}</p>
        <p className="text-slate-500 mt-1">
          {course.duration_weeks} weeks · {course.students_count} enrolled students
        </p>
      </div>
      <button
        onClick={onBack}
        className="rounded-md border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
      >
        Back to Courses
      </button>
    </div>
    <PagedStudentTable students={course.students} showCourse={false} />
  </Panel>
);

const PartnerPanel = ({ profile }) => (
  <Panel icon={<FaLink />} title="Partner Link">
    <div className="grid gap-5">
      <InfoBox label="Student Join Link" value={profile.partner_link} />
      <InfoBox label="Partner Code" value={profile.partner_code} />
    </div>
  </Panel>
);

const ProfilePanel = ({ profile }) => (
  <Panel icon={<FaUserGraduate />} title="College Profile">
    <div className="grid md:grid-cols-2 gap-5">
      <InfoBox label="College Name" value={profile.college_name} />
      <InfoBox label="College Code" value={profile.college_code || "N/A"} />
      <InfoBox label="Location" value={`${profile.city}, ${profile.state}`} />
      <InfoBox label="Contact Number" value={profile.contact_number} />
      <InfoBox label="Designation" value={profile.designation} />
      <InfoBox label="Website" value={profile.website || "N/A"} />
    </div>
  </Panel>
);

const InfoBox = ({ label, value }) => (
  <div className="border border-slate-200 rounded-lg bg-white p-5 shadow-sm">
    <p className="text-sm font-bold text-slate-500">{label}</p>
    <p className="text-lg font-semibold text-slate-900 break-all mt-2">{value}</p>
  </div>
);

const Panel = ({ icon, title, children }) => (
  <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 sm:p-6">
    <div className="flex min-w-0 items-center gap-4 mb-6">
      <div className="h-11 w-11 shrink-0 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-lg">
        {icon}
      </div>
      <h2 className="break-words text-xl font-bold sm:text-2xl">{title}</h2>
    </div>
    {children}
  </section>
);

const PagedStudentTable = ({ students, showCourse }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;

    return students.filter((student) =>
      [fullName(student), student.email, student.course_title, student.batch_timing]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [search, students]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search students, email, batch..."
          className="w-full md:max-w-md border border-slate-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <p className="text-sm font-semibold text-slate-500">
          Showing {visibleStudents.length} of {filteredStudents.length}
        </p>
      </div>

      <StudentTable students={visibleStudents} showCourse={showCourse} />

      {filteredStudents.length > pageSize && (
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-slate-200 px-4 py-2 font-semibold text-slate-700 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm font-semibold text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-slate-200 px-4 py-2 font-semibold text-slate-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const StudentTable = ({ students, showCourse }) => {
  if (!students.length) return <p className="text-slate-600 mt-5">No students found.</p>;

  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-slate-500 text-sm">
            <th className="py-3 pr-4">STUDENT</th>
            <th className="py-3 pr-4">EMAIL</th>
            {showCourse && <th className="py-3 pr-4">COURSE</th>}
            <th className="py-3 pr-4">BATCH</th>
            <th className="py-3 pr-4">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={`${student.id}-${student.course_title || student.batch_timing}`} className="border-b last:border-b-0">
              <td className="py-4 pr-4 font-semibold">{fullName(student)}</td>
              <td className="py-4 pr-4 text-slate-600">{student.email}</td>
              {showCourse && <td className="py-4 pr-4 text-slate-600">{student.course_title}</td>}
              <td className="py-4 pr-4 text-slate-600">{student.batch_timing}</td>
              <td className="py-4 pr-4">
                <span className="bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-sm font-bold">
                  {student.enrollment_status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeDashboard;
