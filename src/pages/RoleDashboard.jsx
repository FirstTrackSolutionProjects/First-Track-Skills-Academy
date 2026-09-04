import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
import { getMyEnrolledCourses } from "../service/enrollmentService";
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
    subtitle: "Your enrolled courses, schedules, and learning materials.",
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
  const navigate = useNavigate();
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
  const isStudent = role === "STUDENT";
  const copy = roleCopy[role];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        if (role === "STUDENT") {
          const enrolledData = await getMyEnrolledCourses();
          setCourses(enrolledData || []);
        } else {
          const courseData = await getCourses(auth.token);
          setCourses(courseData || []);
        }

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
  if (role === "SUPERADMIN" || role === "ADMIN") return <Navigate to="/admin-dashboard" replace />;
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

  const handleCourseSelect = (courseId) => {
    navigate(`/course/${courseId}/classes`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="border-b border-slate-200 bg-white px-4 py-5 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[245px] lg:border-b-0 lg:border-r lg:py-6">
        <Link to="/" className="group mb-6 block" title="Go to Website Homepage">
          <div className="flex items-center gap-3">
            <img
              src="/images/companylogo.jpg"
              alt="First Track"
              className="h-10 w-10 rounded-full border border-blue-600 object-cover shadow-sm transition group-hover:scale-105"
            />
            <div>
              <h1 className="text-xl font-bold text-blue-700 transition group-hover:text-orange-500">First Track</h1>
              <p className="text-xs font-semibold text-slate-500">Skills Academy</p>
            </div>
          </div>
        </Link>

        <div className="mb-6 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-100 hover:text-blue-800"
          >
            <FaHome className="text-base" />
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
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Link
                to="/"
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                title="Return to Website Homepage"
              >
                <FaHome />
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
              <span className="w-fit rounded-full border border-slate-200 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-600">
                {role}
              </span>
            </div>
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
                  <HeroPanel copy={copy} user={auth.user} metrics={metrics} isStudent={isStudent} />
                  <CoursePanel courses={courses} isStudent={isStudent} onSelectCourse={handleCourseSelect} />
                  {role === "MENTOR" && <BatchPanel batches={batches} onOpenBatch={openBatch} />}
                </>
              )}
              {activeMenu === "Courses" && (
                <CoursePanel courses={courses} isStudent={isStudent} onSelectCourse={handleCourseSelect} />
              )}
              {activeMenu === "Batches" && <BatchPanel batches={batches} onOpenBatch={openBatch} />}
              {activeMenu === "Batch Details" && selectedBatch && (
                <BatchDetails batch={selectedBatch} onBack={() => handleMenuClick("Batches")} />
              )}
              {activeMenu === "Batch Timings" && <BatchTimingsPanel batches={batches} />}
              {activeMenu === "Enrollments" && (
                <CoursePanel courses={courses} isStudent={true} onSelectCourse={handleCourseSelect} />
              )}
              {activeMenu === "Profile" && (
                <ProfilePanel user={auth.user} courses={courses} batches={batches} isStudent={isStudent} />
              )}
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

const HeroPanel = ({ copy, user, metrics, isStudent }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,480px)] xl:items-center">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
          {copy.icon}
          {copy.label}
        </span>
        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{copy.title}</h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600">
          Welcome back, <span className="font-bold text-slate-900">{user.first_name || user.name || "Student"}</span>. {isStudent ? "Track your enrolled courses, live interactive class schedules, and hands-on modules below." : "Manage your batches, mentor assignments, and course updates."}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniMetric label={isStudent ? "MY COURSES" : "COURSES"} value={metrics.courses} />
        <MiniMetric label={isStudent ? "COURSE STATUS" : "BATCHES"} value={isStudent ? "Pending Batch" : metrics.batches} />
        <MiniMetric label="ROLE" value={metrics.status} />
      </div>
    </div>
  </section>
);

const MiniMetric = ({ label, value }) => (
  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-700">
    <p className="text-sm font-bold">{label}</p>
    <p className="mt-2 break-words text-2xl font-bold">{value}</p>
  </div>
);

const CoursePanel = ({ courses, isStudent, onSelectCourse }) => (
  <Panel icon={<FaBookOpen />} title={isStudent ? "My Enrolled Courses" : "Courses"}>
    {courses.length ? (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.enrollment_id || course.id}
            onClick={() => isStudent && onSelectCourse?.(course.course_id || course.id)}
            className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition flex flex-col justify-between ${
              isStudent ? "cursor-pointer hover:border-orange-400 hover:shadow-lg hover:-translate-y-1 group" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  {course.category || "DEVOPS"}
                </span>
                {course.batch_timing && (
                  <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-600 border border-orange-100">
                    {course.batch_timing} BATCH
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-orange-600 transition">
                {course.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                {course.description || `${course.duration_weeks || 12} weeks of practical training & deployment.`}
              </p>
            </div>

            {isStudent ? (
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 inline-block animate-pulse" />
                  Pending - Awaiting Batch Allocation
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-1 transition">
                  View Classes &rarr;
                </span>
              </div>
            ) : (
              <p className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-400">
                Duration: {course.duration_weeks || 12} weeks
              </p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="font-semibold text-slate-700 text-base">
          {isStudent
            ? "You have not enrolled in any courses yet."
            : "No courses found."}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {isStudent
            ? "Explore our career-oriented programs and enroll to access live classrooms and projects."
            : "Courses will appear here once configured."}
        </p>
        {isStudent && (
          <Link
            to="/courses"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white transition shadow-md hover:scale-105"
          >
            Explore Courses
          </Link>
        )}
      </div>
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

const ProfilePanel = ({ user, courses = [], batches = [], isStudent }) => {
  const role = user?.role || (isStudent ? "STUDENT" : "MENTOR");
  const fullNameStr = [user?.first_name, user?.middle_name, user?.last_name].filter(Boolean).join(" ") || user?.name || (isStudent ? "Student User" : "Mentor User");
  const profile = user?.student_profile || {};

  return (
    <Panel icon={isStudent ? <FaUserGraduate /> : <FaUserTie />} title="Personal Profile">
      {/* Profile Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50/80 to-orange-50/60 p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-md">
            {(user?.first_name?.[0] || user?.name?.[0] || "U").toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">{fullNameStr}</h3>
              <span className="rounded-full bg-blue-100 text-blue-700 px-3 py-0.5 text-xs font-bold">
                {role}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700">
            Active Verified Account
          </span>
        </div>
      </div>

      <h4 className="text-base font-bold text-slate-800 mb-4">Personal & Contact Details</h4>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <InfoBox label="Full Name" value={fullNameStr} />
        <InfoBox label="Email Address" value={user?.email || "N/A"} />
        <InfoBox label="Phone Number" value={user?.phone_number || profile?.phone_number || user?.phone || "+91 91234 65569"} />
        {isStudent && (
          <>
            <InfoBox label="Gender" value={profile?.gender || "Not specified"} />
            <InfoBox label="Date of Birth" value={profile?.dob ? profile.dob.slice(0, 10) : "Not specified"} />
            <InfoBox label="District / City" value={profile?.district || "Not specified"} />
            <InfoBox label="State" value={profile?.state || "Not specified"} />
            <InfoBox label="PIN Code" value={profile?.pin || "Not specified"} />
          </>
        )}
        <InfoBox label="Role" value={role} />
        <InfoBox label="Account ID" value={`#${role.slice(0, 3)}-${user?.id || "001"}`} />
        <InfoBox label="Account Status" value="Active" />
      </div>

      {isStudent ? (
        <>
          <h4 className="text-base font-bold text-slate-800 mb-4">Educational Background</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <InfoBox label="Highest Qualification" value={profile?.qualification || "Bachelor's / Pursuing Degree"} />
            <InfoBox label="College / University" value={profile?.college || "First Track Skills Academy"} />
            <InfoBox label="Profile Image" value={profile?.profile_image ? "Uploaded Document" : "Optional / Default"} />
            <InfoBox label="Resume" value={profile?.resume ? "Uploaded Document" : "Optional / Not Attached"} />
          </div>

          <h4 className="text-base font-bold text-slate-800 mb-4">Academic & Enrollment Overview</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoBox label="Enrolled Courses" value={`${courses.length} Active Program${courses.length === 1 ? "" : "s"}`} />
            <InfoBox label="Course Status" value="Pending Batch Allocation" />
            <InfoBox label="Institution" value="First Track Skills Academy" />
          </div>
        </>
      ) : (
        <>
          <h4 className="text-base font-bold text-slate-800 mb-4">Instructor & Mentorship Overview</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoBox label="Assigned Batches" value={`${batches.length} Active Batches`} />
            <InfoBox label="Specialization" value="AWS Cloud, DevOps & CI/CD" />
            <InfoBox label="Instructor Status" value="Official Academy Mentor" />
          </div>
        </>
      )}
    </Panel>
  );
};

const InfoBox = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="mt-2 break-words text-lg font-semibold text-slate-900">{value}</p>
  </div>
);

const Panel = ({ icon, title, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-700">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
    </div>
    {children}
  </section>
);

export default RoleDashboard;
