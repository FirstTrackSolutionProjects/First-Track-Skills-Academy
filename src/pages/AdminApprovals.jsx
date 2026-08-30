import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaBuilding,
  FaCheck,
  FaChevronDown,
  FaClipboardList,
  FaHome,
  FaSearch,
  FaSignOutAlt,
  FaSpinner,
  FaTimes,
  FaUserGraduate,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import useStore, { storeActions } from "../store/useStore";
import {
  getColleges,
  getSuperadminColleges,
  getSuperadminStudents,
  updateCollegeStatus,
} from "../service/collegeService";
import { getUsers } from "../service/userService";
import { collegeProfileIdParamSchema, updateCollegeProfileStatusSchema } from "../validator/collegeProfileSchema";
import { mapZodIssuesToFieldErrors } from "../validator/validation";

const statusColors = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-100",
  ENROLLED: "bg-blue-50 text-blue-700 border-blue-100",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-100",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-100",
};

const initialStudentFilters = {
  search: "",
  college_id: "",
  course_id: "",
  batch_timing: "",
  enrollment_status: "",
  sort_by: "joined_at",
  sort_direction: "desc",
  page: 1,
  limit: 20,
};

const menuSections = (role) =>
  role === "SUPERADMIN"
    ? [
        { title: "Overview", icon: <FaHome />, items: [{ name: "Dashboard", icon: <FaHome /> }] },
        { title: "Admin", icon: <FaUserShield />, items: [{ name: "Admin Data", icon: <FaUserShield /> }] },
        { title: "Colleges", icon: <FaBuilding />, items: [{ name: "College Names", icon: <FaBuilding /> }] },
        { title: "Students", icon: <FaUserGraduate />, items: [{ name: "Students", icon: <FaUsers /> }] },
        { title: "Account", icon: <FaUserShield />, items: [{ name: "Profile", icon: <FaUserShield /> }] },
      ]
    : [
        { title: "Overview", icon: <FaHome />, items: [{ name: "Dashboard", icon: <FaHome /> }] },
        {
          title: "College",
          icon: <FaBuilding />,
          items: [
            { name: "Pending", icon: <FaClipboardList /> },
            { name: "Approved", icon: <FaCheck /> },
            { name: "Rejected", icon: <FaTimes /> },
            { name: "All Colleges", icon: <FaBuilding /> },
          ],
        },
        { title: "Account", icon: <FaUserShield />, items: [{ name: "Profile", icon: <FaUserShield /> }] },
      ];

const AdminApprovals = () => {
  const { auth } = useStore();
  const [colleges, setColleges] = useState([]);
  const [users, setUsers] = useState([]);
  const [superColleges, setSuperColleges] = useState([]);
  const [studentsPage, setStudentsPage] = useState({ data: [], page: 1, limit: 20, totalPages: 1, count: 0 });
  const [studentFilters, setStudentFilters] = useState(initialStudentFilters);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [openSections, setOpenSections] = useState({
    Overview: true,
    Admin: true,
    Colleges: true,
    Students: true,
    College: true,
    Account: true,
  });
  const [openCollegeIds, setOpenCollegeIds] = useState({});
  const [openCourseIds, setOpenCourseIds] = useState({});
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);

  const role = auth?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const isSuperadmin = role === "SUPERADMIN";

  const loadBaseData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [collegeData, userData, superCollegeData] = await Promise.all([
        getColleges(auth.token),
        getUsers(auth.token, { limit: 100 }),
        isSuperadmin ? getSuperadminColleges(auth.token) : Promise.resolve([]),
      ]);
      setColleges(collegeData || []);
      setUsers(userData?.data || []);
      setSuperColleges(superCollegeData || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [auth, isSuperadmin]);

  const loadStudents = useCallback(async () => {
    if (!isSuperadmin) return;
    try {
      setStudentsLoading(true);
      const data = await getSuperadminStudents(auth.token, studentFilters);
      setStudentsPage(data || { data: [], page: 1, limit: 20, totalPages: 1, count: 0 });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setStudentsLoading(false);
    }
  }, [auth, isSuperadmin, studentFilters]);

  useEffect(() => {
    if (isAdmin) {
      Promise.resolve().then(() => loadBaseData(false));
    }
  }, [isAdmin, loadBaseData]);

  useEffect(() => {
    if (activeMenu === "Students") {
      Promise.resolve().then(loadStudents);
    }
  }, [activeMenu, loadStudents]);

  const metrics = useMemo(() => {
    const pending = colleges.filter((college) => college.status === "PENDING").length;
    const approved = colleges.filter((college) => college.status === "APPROVED").length;
    const rejected = colleges.filter((college) => college.status === "REJECTED").length;
    return {
      total: colleges.length,
      pending,
      approved,
      rejected,
      totalUsers: users.length,
      admins: users.filter((user) => user.role === "ADMIN" || user.role === "SUPERADMIN").length,
      students: studentsPage.count,
    };
  }, [colleges, studentsPage.count, users]);

  const visibleColleges = useMemo(() => {
    const statusByMenu = { Pending: "PENDING", Approved: "APPROVED", Rejected: "REJECTED" };
    const status = statusByMenu[activeMenu];
    const term = search.trim().toLowerCase();
    return colleges.filter((college) => {
      const matchesStatus = !status || college.status === status;
      const text = `${college.college_name || ""} ${college.city || ""} ${college.state || ""} ${college.user?.email || ""}`.toLowerCase();
      return matchesStatus && (!term || text.includes(term));
    });
  }, [activeMenu, colleges, search]);

  const courseOptions = useMemo(() => {
    const map = new Map();
    superColleges.forEach((college) => {
      college.courses?.forEach((course) => map.set(course.id, course.title));
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [superColleges]);

  const handleStatus = async (collegeId, status) => {
    const parsedParams = collegeProfileIdParamSchema.safeParse({ college_id: collegeId });
    const parsedBody = updateCollegeProfileStatusSchema.safeParse({ status });

    if (!parsedParams.success || !parsedBody.success) {
      const errors = {
        ...(!parsedParams.success ? mapZodIssuesToFieldErrors(parsedParams.error) : {}),
        ...(!parsedBody.success ? mapZodIssuesToFieldErrors(parsedBody.error) : {}),
      };
      toast.error(Object.values(errors)[0] || "Please fix the highlighted errors");
      return;
    }

    try {
      setUpdatingId(collegeId);
      await updateCollegeStatus(parsedParams.data.college_id, parsedBody.data.status, auth.token);
      toast.success(`College ${status.toLowerCase()}`);
      await loadBaseData(false);
      if (selectedCollege?.id === collegeId) {
        setSelectedCollege((college) => ({ ...college, status }));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMenuClick = (name) => {
    setActiveMenu(name);
    if (name !== "College Details") setSelectedCollege(null);
  };

  const updateStudentFilter = (name, value) => {
    setStudentFilters((prev) => ({ ...prev, [name]: value, page: name === "page" ? value : 1 }));
  };

  if (!auth) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed left-0 top-0 h-screen w-[245px] overflow-y-auto border-r border-slate-200 bg-white px-5 py-7">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-sky-700">First Track</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">{isSuperadmin ? "Superadmin Panel" : "Admin Panel"}</p>
        </div>

        <nav className="space-y-3">
          {menuSections(role).map((section) => (
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

        <div className="mt-10 border-t border-slate-200 pt-5">
          <button
            onClick={storeActions.clearAuth}
            className="flex h-12 w-full items-center gap-4 rounded-lg px-4 text-left text-base font-semibold text-red-600 hover:bg-red-50"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <section className="ml-[245px] min-h-screen">
        <header className="sticky top-0 z-10 flex min-h-[92px] items-center justify-between border-b border-slate-200 bg-white px-9 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-xl text-blue-700">
              <FaUserShield />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.35em] text-blue-700">{isSuperadmin ? "SUPERADMIN" : "ADMIN"} PANEL</p>
              <h2 className="text-3xl font-bold">{activeMenu}</h2>
              <p className="mt-1 text-slate-500">Role-based data and permissions for Skills Academy.</p>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600">{role}</span>
        </header>

        <main className="p-8">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center gap-3 font-semibold text-blue-700">
              <FaSpinner className="animate-spin" />
              Loading dashboard...
            </div>
          ) : (
            <div className="space-y-6">
              {activeMenu === "Dashboard" && (
                <>
                  <HeroPanel metrics={metrics} isSuperadmin={isSuperadmin} />
                  <MetricSection metrics={metrics} isSuperadmin={isSuperadmin} />
                </>
              )}

              {activeMenu === "Admin Data" && <AdminDataPanel admins={users.filter((user) => ["ADMIN", "SUPERADMIN"].includes(user.role))} />}

              {activeMenu === "College Names" && (
                <CollegeDrilldown
                  colleges={superColleges}
                  openCollegeIds={openCollegeIds}
                  openCourseIds={openCourseIds}
                  onToggleCollege={(id) => setOpenCollegeIds((prev) => ({ ...prev, [id]: !prev[id] }))}
                  onToggleCourse={(key) => setOpenCourseIds((prev) => ({ ...prev, [key]: !prev[key] }))}
                />
              )}

              {activeMenu === "Students" && (
                <StudentsPanel
                  colleges={superColleges}
                  courseOptions={courseOptions}
                  filters={studentFilters}
                  studentsPage={studentsPage}
                  loading={studentsLoading}
                  onFilterChange={updateStudentFilter}
                />
              )}

              {["Pending", "Approved", "Rejected", "All Colleges"].includes(activeMenu) && (
                <Panel>
                  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{activeMenu}</h3>
                      <p className="mt-1 text-slate-500">Open a college to view details or update its approval status.</p>
                    </div>
                    <SearchBox value={search} onChange={setSearch} placeholder="Search colleges" />
                  </div>
                  <CollegeList
                    colleges={visibleColleges}
                    updatingId={updatingId}
                    onOpen={(college) => {
                      setSelectedCollege(college);
                      setActiveMenu("College Details");
                    }}
                    onStatus={handleStatus}
                    emptyText="No colleges found."
                  />
                </Panel>
              )}

              {activeMenu === "College Details" && selectedCollege && (
                <CollegeDetails
                  college={selectedCollege}
                  updatingId={updatingId}
                  onBack={() => handleMenuClick("All Colleges")}
                  onStatus={handleStatus}
                />
              )}

              {activeMenu === "Profile" && (
                <Panel>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <FaUserShield />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Profile</h3>
                      <p className="text-slate-500">Current signed in account.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <InfoBox label="Name" value={auth.user.name || auth.user.first_name || "Admin"} />
                    <InfoBox label="Email" value={auth.user.email} />
                    <InfoBox label="Role" value={auth.user.role} />
                  </div>
                </Panel>
              )}
            </div>
          )}
        </main>
      </section>
    </div>
  );
};

const HeroPanel = ({ metrics, isSuperadmin }) => (
  <Panel>
    <div className="grid gap-8 lg:grid-cols-[1fr_560px] lg:items-center">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
          <FaUserShield />
          LIVE {isSuperadmin ? "SUPERADMIN" : "ADMIN"} OPERATIONS
        </span>
        <h2 className="mt-8 max-w-xl text-5xl font-bold leading-tight">{isSuperadmin ? "Academy Control Dashboard" : "College Partner Dashboard"}</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          {isSuperadmin
            ? "Review admins, colleges, courses, and student enrollments from one place."
            : "Review college onboarding, approve partner access, and keep the Skills Academy network clean."}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <MiniMetric label="TOTAL COLLEGES" value={metrics.total} tone="blue" />
        <MiniMetric label="ADMINS" value={metrics.admins} tone="green" />
        <MiniMetric label="PENDING" value={metrics.pending} tone="amber" />
        <MiniMetric label="STUDENTS" value={metrics.students || metrics.totalUsers} tone="rose" />
      </div>
    </div>
  </Panel>
);

const MetricSection = ({ metrics, isSuperadmin }) => (
  <Panel>
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        <FaClipboardList />
      </div>
      <h3 className="text-2xl font-bold">{isSuperadmin ? "Academy Data Summary" : "College Numbers By Status"}</h3>
    </div>
    <div className="grid gap-4 lg:grid-cols-4">
      <MetricCard label="Total Colleges" value={metrics.total} icon={<FaBuilding />} />
      <MetricCard label="Approved Colleges" value={metrics.approved} icon={<FaCheck />} tone="green" />
      <MetricCard label="Pending Review" value={metrics.pending} icon={<FaClipboardList />} tone="amber" />
      <MetricCard label="Total Users" value={metrics.totalUsers} icon={<FaUsers />} tone="rose" />
    </div>
  </Panel>
);

const AdminDataPanel = ({ admins }) => (
  <Panel>
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <FaUserShield />
      </div>
      <div>
        <h3 className="text-2xl font-bold">Admin Data</h3>
        <p className="text-slate-500">Admins and superadmins currently in the system.</p>
      </div>
    </div>
    <UserTable users={admins} />
  </Panel>
);

const CollegeDrilldown = ({ colleges, openCollegeIds, openCourseIds, onToggleCollege, onToggleCourse }) => (
  <Panel>
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <FaBuilding />
      </div>
      <div>
        <h3 className="text-2xl font-bold">College Names</h3>
        <p className="text-slate-500">Open a college to view active courses, then open a course to view enrolled students.</p>
      </div>
    </div>

    <div className="space-y-3">
      {colleges.map((college) => (
        <div key={college.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <button
            onClick={() => onToggleCollege(college.id)}
            className="flex w-full flex-col gap-3 p-5 text-left md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h4 className="text-xl font-bold">{college.college_name}</h4>
                <StatusBadge status={college.status} />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {[college.city, college.state].filter(Boolean).join(", ") || "Location not added"} | {college.email || "No email"}
              </p>
            </div>
            <div className="flex items-center gap-5 text-sm font-bold text-slate-500">
              <span>{college.courses_count} courses</span>
              <span>{college.students_count} students</span>
              <FaChevronDown className={`transition ${openCollegeIds[college.id] ? "rotate-180" : ""}`} />
            </div>
          </button>

          {openCollegeIds[college.id] && (
            <div className="border-t border-slate-100 p-5">
              {college.courses?.length ? (
                <div className="space-y-3">
                  {college.courses.map((course) => {
                    const courseKey = `${college.id}-${course.id}`;
                    return (
                      <div key={courseKey} className="rounded-lg border border-slate-200 bg-slate-50">
                        <button
                          onClick={() => onToggleCourse(courseKey)}
                          className="flex w-full flex-col gap-3 p-4 text-left md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-blue-700">{course.category}</p>
                            <h5 className="mt-1 text-lg font-bold">{course.title}</h5>
                          </div>
                          <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                            <span>{course.students_count} students</span>
                            <FaChevronDown className={`transition ${openCourseIds[courseKey] ? "rotate-180" : ""}`} />
                          </div>
                        </button>
                        {openCourseIds[courseKey] && (
                          <div className="border-t border-slate-200 bg-white p-4">
                            <StudentMiniTable students={course.students || []} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState text="No active course enrollments found for this college." />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  </Panel>
);

const StudentsPanel = ({ colleges, courseOptions, filters, studentsPage, loading, onFilterChange }) => (
  <Panel>
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h3 className="text-2xl font-bold">Students</h3>
        <p className="mt-1 text-slate-500">Paginated student enrollment table with filters, search, and sorting.</p>
      </div>
      <p className="text-sm font-bold text-slate-500">{studentsPage.count} records</p>
    </div>

    <div className="mb-6 grid gap-4 lg:grid-cols-4">
      <TextInput label="Search" value={filters.search} onChange={(value) => onFilterChange("search", value)} placeholder="Name or email" />
      <SelectInput label="Select College" value={filters.college_id} onChange={(value) => onFilterChange("college_id", value)}>
        <option value="">All colleges</option>
        {colleges.map((college) => (
          <option key={college.user_id} value={college.user_id}>{college.college_name}</option>
        ))}
      </SelectInput>
      <SelectInput label="Select Course" value={filters.course_id} onChange={(value) => onFilterChange("course_id", value)}>
        <option value="">All courses</option>
        {courseOptions.map((course) => (
          <option key={course.id} value={course.id}>{course.title}</option>
        ))}
      </SelectInput>
      <SelectInput label="Select Batch" value={filters.batch_timing} onChange={(value) => onFilterChange("batch_timing", value)}>
        <option value="">All batches</option>
        <option value="MORNING">Morning</option>
        <option value="AFTERNOON">Afternoon</option>
        <option value="EVENING">Evening</option>
        <option value="NIGHT">Night</option>
      </SelectInput>
      <SelectInput label="Status" value={filters.enrollment_status} onChange={(value) => onFilterChange("enrollment_status", value)}>
        <option value="">All statuses</option>
        <option value="ENROLLED">Enrolled</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </SelectInput>
      <SelectInput label="Sort By" value={filters.sort_by} onChange={(value) => onFilterChange("sort_by", value)}>
        <option value="joined_at">Joined Date</option>
        <option value="student_name">Student Name</option>
        <option value="email">Email</option>
        <option value="course_title">Course</option>
        <option value="batch_timing">Batch</option>
        <option value="enrollment_status">Status</option>
      </SelectInput>
      <SelectInput label="Sort Direction" value={filters.sort_direction} onChange={(value) => onFilterChange("sort_direction", value)}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </SelectInput>
      <SelectInput label="Page Size" value={filters.limit} onChange={(value) => onFilterChange("limit", Number(value))}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </SelectInput>
    </div>

    {loading ? (
      <div className="flex min-h-[240px] items-center justify-center gap-3 font-semibold text-blue-700">
        <FaSpinner className="animate-spin" />
        Loading students...
      </div>
    ) : (
      <>
        <StudentEnrollmentTable students={studentsPage.data} />
        <Pagination page={studentsPage.page} totalPages={studentsPage.totalPages} onPageChange={(page) => onFilterChange("page", page)} />
      </>
    )}
  </Panel>
);

const SidebarSection = ({ section, activeMenu, isOpen, onToggle, onMenuClick }) => (
  <div>
    <button
      onClick={() => onToggle(section.title)}
      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 hover:bg-slate-50"
    >
      <span className="flex items-center gap-2">{section.icon}{section.title}</span>
      <FaChevronDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
    </button>
    {isOpen && (
      <div className="mt-1 space-y-1">
        {section.items.map((item) => (
          <button
            key={item.name}
            onClick={() => onMenuClick(item.name)}
            className={`flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-sm font-semibold transition ${
              activeMenu === item.name ? "bg-sky-100 text-blue-700" : "text-slate-800 hover:bg-slate-100"
            }`}
          >
            <span className="w-5 text-base">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </div>
    )}
  </div>
);

const MiniMetric = ({ label, value, tone = "blue" }) => {
  const tones = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    rose: "border-rose-100 bg-rose-50 text-rose-700",
  };
  return (
    <div className={`rounded-lg border p-6 ${tones[tone]}`}>
      <p className="text-sm font-bold">{label}</p>
      <p className="mt-3 text-4xl font-bold">{value}</p>
    </div>
  );
};

const MetricCard = ({ label, value, icon, tone = "blue" }) => {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase text-slate-500">{label}</p>
          <p className="mt-4 text-4xl font-bold">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg border text-lg ${tones[tone]}`}>{icon}</div>
      </div>
    </div>
  );
};

const CollegeList = ({ colleges, updatingId, onOpen, onStatus, emptyText }) =>
  colleges.length ? (
    <div className="grid gap-4">
      {colleges.map((college) => (
        <div key={college.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <button onClick={() => onOpen(college)} className="text-left">
              <div className="flex flex-wrap items-center gap-3">
                <h4 className="text-xl font-bold hover:text-blue-700">{college.college_name}</h4>
                <StatusBadge status={college.status} />
              </div>
              <p className="mt-2 text-slate-500">{[college.city, college.state].filter(Boolean).join(", ") || "Location not added"}</p>
              <p className="mt-1 text-sm text-slate-500">{college.user?.email || "No email found"}</p>
            </button>
            <ActionButtons college={college} updatingId={updatingId} onStatus={onStatus} />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <EmptyState text={emptyText} />
  );

const ActionButtons = ({ college, updatingId, onStatus }) => (
  <div className="flex flex-wrap gap-3">
    {college.status !== "APPROVED" && (
      <button
        onClick={() => onStatus(college.id, "APPROVED")}
        disabled={updatingId === college.id}
        className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        <FaCheck />
        Approve
      </button>
    )}
    {college.status !== "REJECTED" && (
      <button
        onClick={() => onStatus(college.id, "REJECTED")}
        disabled={updatingId === college.id}
        className="flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 font-semibold text-white hover:bg-black disabled:opacity-60"
      >
        <FaTimes />
        Reject
      </button>
    )}
  </div>
);

const CollegeDetails = ({ college, updatingId, onBack, onStatus }) => (
  <Panel>
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <button onClick={onBack} className="mb-4 text-sm font-bold text-blue-700">Back to colleges</button>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-3xl font-bold">{college.college_name}</h3>
          <StatusBadge status={college.status} />
        </div>
        <p className="mt-2 text-slate-500">College partner request details.</p>
      </div>
      <ActionButtons college={college} updatingId={updatingId} onStatus={onStatus} />
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      <InfoBox label="Email" value={college.user?.email || "Not available"} />
      <InfoBox label="Phone" value={college.phone || "Not available"} />
      <InfoBox label="Status" value={college.status} />
      <InfoBox label="City" value={college.city || "Not available"} />
      <InfoBox label="State" value={college.state || "Not available"} />
      <InfoBox label="Address" value={college.address || "Not available"} />
    </div>
  </Panel>
);

const UserTable = ({ users }) =>
  users.length ? (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200 text-sm text-slate-500">
            <th className="py-3 pr-4">NAME</th>
            <th className="py-3 pr-4">EMAIL</th>
            <th className="py-3 pr-4">ROLE</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100 last:border-b-0">
              <td className="py-4 pr-4 font-semibold">{fullName(user) || "Unnamed User"}</td>
              <td className="py-4 pr-4 text-slate-600">{user.email}</td>
              <td className="py-4 pr-4"><StatusBadge status={user.role} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState text="No admin users found." />
  );

const StudentMiniTable = ({ students }) =>
  students.length ? (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-3 pr-4">STUDENT</th>
            <th className="py-3 pr-4">EMAIL</th>
            <th className="py-3 pr-4">BATCH</th>
            <th className="py-3 pr-4">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={`${student.id}-${student.batch_timing}-${student.joined_at}`} className="border-b border-slate-100 last:border-b-0">
              <td className="py-3 pr-4 font-semibold">{fullName(student) || "Unnamed Student"}</td>
              <td className="py-3 pr-4 text-slate-600">{student.email}</td>
              <td className="py-3 pr-4 text-slate-600">{student.batch_timing}</td>
              <td className="py-3 pr-4"><StatusBadge status={student.enrollment_status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState text="No students enrolled in this course." />
  );

const StudentEnrollmentTable = ({ students }) =>
  students.length ? (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-3 pr-4">STUDENT</th>
            <th className="py-3 pr-4">EMAIL</th>
            <th className="py-3 pr-4">COLLEGE</th>
            <th className="py-3 pr-4">COURSE</th>
            <th className="py-3 pr-4">BATCH</th>
            <th className="py-3 pr-4">STATUS</th>
            <th className="py-3 pr-4">JOINED</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.enrollment_id} className="border-b border-slate-100 last:border-b-0">
              <td className="py-4 pr-4 font-semibold">{student.student_name || "Unnamed Student"}</td>
              <td className="py-4 pr-4 text-slate-600">{student.email}</td>
              <td className="py-4 pr-4 text-slate-600">{student.college_name}</td>
              <td className="py-4 pr-4 text-slate-600">{student.course_title}</td>
              <td className="py-4 pr-4 text-slate-600">{student.batch_timing}</td>
              <td className="py-4 pr-4"><StatusBadge status={student.enrollment_status} /></td>
              <td className="py-4 pr-4 text-slate-600">{student.joined_at ? new Date(student.joined_at).toLocaleDateString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState text="No students match the selected filters." />
  );

const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="mt-6 flex items-center justify-end gap-3">
    <button
      onClick={() => onPageChange(Math.max(1, page - 1))}
      disabled={page <= 1}
      className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 disabled:opacity-50"
    >
      Prev
    </button>
    <span className="text-sm font-bold text-slate-500">Page {page} of {Math.max(1, totalPages)}</span>
    <button
      onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      disabled={page >= totalPages}
      className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

const TextInput = ({ label, value, onChange, placeholder }) => (
  <label className="grid gap-2">
    <span className="text-sm font-bold text-slate-500">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 rounded-lg border border-slate-200 bg-white px-4 outline-none focus:border-blue-400"
    />
  </label>
);

const SelectInput = ({ label, value, onChange, children }) => (
  <label className="grid gap-2">
    <span className="text-sm font-bold text-slate-500">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 rounded-lg border border-slate-200 bg-white px-4 outline-none focus:border-blue-400"
    >
      {children}
    </select>
  </label>
);

const SearchBox = ({ value, onChange, placeholder = "Search" }) => (
  <div className="relative w-full lg:w-80">
    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 outline-none focus:border-blue-400"
    />
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColors[status] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
    {status}
  </span>
);

const InfoBox = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
    <p className="text-sm font-bold uppercase text-slate-500">{label}</p>
    <p className="mt-2 break-words text-lg font-semibold text-slate-900">{value}</p>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center font-semibold text-slate-500">{text}</div>
);

const Panel = ({ children }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">{children}</section>
);

const fullName = (user) =>
  [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ");

export default AdminApprovals;
