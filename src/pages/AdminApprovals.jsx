import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaBookOpen,
  FaBuilding,
  FaCheck,
  FaChevronDown,
  FaClipboardList,
  FaHome,
  FaLayerGroup,
  FaPaperPlane,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaSpinner,
  FaTimes,
  FaUserGraduate,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import useStore, { storeActions } from "../store/useStore";
import { createAdmin } from "../service/adminService";
import {
  getColleges,
  getSuperadminColleges,
  getSuperadminStudents,
  updateCollegeStatus,
} from "../service/collegeService";
import { createBatch, createCourse, getBatches, getCourses } from "../service/courseService";
import { createMentor } from "../service/mentorService";
import { getUsers } from "../service/userService";
import { collegeProfileIdParamSchema, updateCollegeProfileStatusSchema } from "../validator/collegeProfileSchema";
import { createBatchSchema, createCourseSchema } from "../validator/courseSchema";
import { adminOnboardingSchema } from "../validator/adminProfileSchema";
import { mentorOnboardingSchema } from "../validator/mentorSchema";
import { mapZodIssuesToFieldErrors } from "../validator/validation";

const statusColors = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-100",
  ENROLLED: "bg-blue-50 text-blue-700 border-blue-100",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-100",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-100",
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-100",
  INACTIVE: "bg-slate-50 text-slate-700 border-slate-200",
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

const initialAdminForm = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  department: "",
  phone_number: "",
  role: "ADMIN",
};

const initialMentorForm = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  subjects_text: "",
  years_of_experience: 0,
  bio: "",
  role: "MENTOR",
};

const initialCourseForm = {
  title: "",
  slug: "",
  category: "FRONTEND",
  description: "",
  duration_weeks: 12,
  thumbnail_url: "",
};

const initialBatchForm = {
  course_id: "",
  mentor_id: "",
  batch_name: "",
  batch_timing: "MORNING",
  start_date: "",
  end_date: "",
  status: "ACTIVE",
};

const menuSections = (role) =>
  role === "SUPERADMIN"
    ? [
        { title: "Overview", icon: <FaHome />, items: [{ name: "Dashboard", icon: <FaHome /> }] },
        {
          title: "Admin",
          icon: <FaUserShield />,
          items: [
            { name: "Admin Data", icon: <FaUserShield /> },
            { name: "Add Admin", icon: <FaPlus /> },
          ],
        },
        {
          title: "Mentors",
          icon: <FaUsers />,
          items: [
            { name: "Mentor Data", icon: <FaUsers /> },
            { name: "Add Mentor", icon: <FaPlus /> },
          ],
        },
        {
          title: "Courses",
          icon: <FaBookOpen />,
          items: [
            { name: "Course Data", icon: <FaBookOpen /> },
            { name: "Add Course", icon: <FaPlus /> },
            { name: "Batch Data", icon: <FaLayerGroup /> },
            { name: "Add Batch", icon: <FaLayerGroup /> },
          ],
        },
        {
          title: "Colleges",
          icon: <FaBuilding />,
          items: [
            { name: "College Names", icon: <FaBuilding /> },
            {
              name: "College Verification",
              icon: <FaClipboardList />,
              items: [
                { name: "Pending", icon: <FaClipboardList /> },
                { name: "Approved", icon: <FaCheck /> },
                { name: "Rejected", icon: <FaTimes /> },
                { name: "All Colleges", icon: <FaBuilding /> },
              ],
            },
          ],
        },
        { title: "Students", icon: <FaUserGraduate />, items: [{ name: "Students", icon: <FaUsers /> }] },
        { title: "Account", icon: <FaUserShield />, items: [{ name: "Profile", icon: <FaUserShield /> }] },
      ]
    : [
        { title: "Overview", icon: <FaHome />, items: [{ name: "Dashboard", icon: <FaHome /> }] },
        {
          title: "Mentors",
          icon: <FaUsers />,
          items: [
            { name: "Mentor Data", icon: <FaUsers /> },
            { name: "Add Mentor", icon: <FaPlus /> },
          ],
        },
        {
          title: "Courses",
          icon: <FaBookOpen />,
          items: [
            { name: "Course Data", icon: <FaBookOpen /> },
            { name: "Add Course", icon: <FaPlus /> },
            { name: "Batch Data", icon: <FaLayerGroup /> },
            { name: "Add Batch", icon: <FaLayerGroup /> },
          ],
        },
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
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [studentsPage, setStudentsPage] = useState({ data: [], page: 1, limit: 20, totalPages: 1, count: 0 });
  const [studentFilters, setStudentFilters] = useState(initialStudentFilters);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [openSections, setOpenSections] = useState({
    Overview: true,
    Admin: true,
    Mentors: true,
    Courses: true,
    Colleges: true,
    "College Verification": true,
    Students: true,
    College: true,
    Account: true,
  });
  const [openCollegeIds, setOpenCollegeIds] = useState({});
  const [openCourseIds, setOpenCourseIds] = useState({});
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [adminForm, setAdminForm] = useState(initialAdminForm);
  const [mentorForm, setMentorForm] = useState(initialMentorForm);
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [batchForm, setBatchForm] = useState(initialBatchForm);
  const [fieldErrors, setFieldErrors] = useState({});

  const role = auth?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const isSuperadmin = role === "SUPERADMIN";

  const loadBaseData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [collegeData, userData, superCollegeData, courseData, batchData] = await Promise.all([
        getColleges(auth.token),
        getUsers(auth.token, { limit: 100 }),
        isSuperadmin ? getSuperadminColleges(auth.token) : Promise.resolve([]),
        getCourses(),
        getBatches(),
      ]);
      setColleges(collegeData || []);
      setUsers(userData?.data || []);
      setSuperColleges(superCollegeData || []);
      setCourses(courseData || []);
      setBatches(batchData || []);
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
      courses: courses.length,
      batches: batches.length,
    };
  }, [batches, colleges, courses, studentsPage.count, users]);

  const visibleColleges = useMemo(() => {
    const statusByMenu = { Pending: "PENDING", "College Verification": "PENDING", Approved: "APPROVED", Rejected: "REJECTED" };
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
    setFieldErrors({});
    if (name !== "College Details") setSelectedCollege(null);
  };

  const updateStudentFilter = (name, value) => {
    setStudentFilters((prev) => ({ ...prev, [name]: value, page: name === "page" ? value : 1 }));
  };

  const mentors = users.filter((user) => user.role === "MENTOR");

  const changeAdminForm = (name, value) => {
    setAdminForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const changeMentorForm = (name, value) => {
    setMentorForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const changeCourseForm = (name, value) => {
    setCourseForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const changeBatchForm = (name, value) => {
    setBatchForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const submitAdmin = async (event) => {
    event.preventDefault();

    const parsed = adminOnboardingSchema.safeParse(adminForm);
    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setFormLoading(true);
      await createAdmin(parsed.data);
      toast.success("Admin account created");
      setAdminForm(initialAdminForm);
      setFieldErrors({});
      await loadBaseData(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const submitMentor = async (event) => {
    event.preventDefault();

    const mentorPayload = {
      ...mentorForm,
      subjects: mentorForm.subjects_text.split(",").map((subject) => subject.trim()).filter(Boolean),
    };
    delete mentorPayload.subjects_text;

    const parsed = mentorOnboardingSchema.safeParse(mentorPayload);
    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setFormLoading(true);
      await createMentor(parsed.data);
      toast.success("Mentor account created");
      setMentorForm(initialMentorForm);
      setFieldErrors({});
      await loadBaseData(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const submitCourse = async (event) => {
    event.preventDefault();

    const parsed = createCourseSchema.safeParse(courseForm);
    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setFormLoading(true);
      await createCourse(parsed.data);
      toast.success("Course created");
      setCourseForm(initialCourseForm);
      setFieldErrors({});
      await loadBaseData(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const submitBatch = async (event) => {
    event.preventDefault();

    const parsed = createBatchSchema.safeParse(batchForm);
    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setFormLoading(true);
      await createBatch(parsed.data);
      toast.success("Batch created");
      setBatchForm(initialBatchForm);
      setFieldErrors({});
      await loadBaseData(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  if (!auth) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="border-b border-slate-200 bg-white px-5 py-5 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[245px] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:py-7">
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
              openSections={openSections}
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

      <section className="min-h-screen lg:ml-[245px]">
        <header className="sticky top-0 z-10 flex min-h-[92px] flex-col gap-4 border-b border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:px-9">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-xl text-blue-700 sm:h-14 sm:w-14">
              <FaUserShield />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[0.2em] text-blue-700 sm:text-sm sm:tracking-[0.35em]">{isSuperadmin ? "SUPERADMIN" : "ADMIN"} PANEL</p>
              <h2 className="break-words text-2xl font-bold sm:text-3xl">{activeMenu}</h2>
              <p className="mt-1 text-slate-500">Role-based data and permissions for Skills Academy.</p>
            </div>
          </div>
          <span className="w-fit rounded-full border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600">{role}</span>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
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
              {activeMenu === "Mentor Data" && <MentorDataPanel mentors={mentors} />}
              {activeMenu === "Course Data" && <CourseDataPanel courses={courses} />}
              {activeMenu === "Batch Data" && <BatchDataPanel batches={batches} />}
              {activeMenu === "Add Admin" && isSuperadmin && (
                <AdminFormPanel form={adminForm} errors={fieldErrors} loading={formLoading} onChange={changeAdminForm} onSubmit={submitAdmin} />
              )}
              {activeMenu === "Add Mentor" && (
                <MentorFormPanel form={mentorForm} errors={fieldErrors} loading={formLoading} onChange={changeMentorForm} onSubmit={submitMentor} />
              )}
              {activeMenu === "Add Course" && (
                <CourseFormPanel form={courseForm} errors={fieldErrors} loading={formLoading} onChange={changeCourseForm} onSubmit={submitCourse} />
              )}
              {activeMenu === "Add Batch" && (
                <BatchFormPanel
                  form={batchForm}
                  errors={fieldErrors}
                  loading={formLoading}
                  courses={courses}
                  mentors={mentors}
                  batches={batches}
                  onChange={changeBatchForm}
                  onSubmit={submitBatch}
                />
              )}

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

              {["Pending", "College Verification", "Approved", "Rejected", "All Colleges"].includes(activeMenu) && (
                <Panel>
                  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{activeMenu}</h3>
                      <p className="mt-1 text-slate-500">
                        {activeMenu === "College Verification"
                          ? "Verify newly created college accounts and approve or reject access."
                          : "Open a college to view details or update its approval status."}
                      </p>
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,560px)] lg:items-center">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
          <FaUserShield />
          LIVE {isSuperadmin ? "SUPERADMIN" : "ADMIN"} OPERATIONS
        </span>
        <h2 className="mt-8 max-w-xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{isSuperadmin ? "Academy Control Dashboard" : "College Partner Dashboard"}</h2>
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

const MentorDataPanel = ({ mentors }) => (
  <Panel>
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <FaUsers />
      </div>
      <div>
        <h3 className="text-2xl font-bold">Mentor Data</h3>
        <p className="text-slate-500">Mentors currently available in the system.</p>
      </div>
    </div>
    <UserTable users={mentors} emptyText="No mentors found." />
  </Panel>
);

const CourseDataPanel = ({ courses }) => (
  <Panel>
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <FaBookOpen />
      </div>
      <div>
        <h3 className="text-2xl font-bold">Course Data</h3>
        <p className="text-slate-500">Existing courses available for batch creation.</p>
      </div>
    </div>
    <CourseTable courses={courses} />
  </Panel>
);

const BatchDataPanel = ({ batches }) => (
  <Panel>
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <FaLayerGroup />
      </div>
      <div>
        <h3 className="text-2xl font-bold">Batch Data</h3>
        <p className="text-slate-500">Existing batches and assigned mentors.</p>
      </div>
    </div>
    <BatchTable batches={batches} />
  </Panel>
);

const AdminFormPanel = ({ form, errors, loading, onChange, onSubmit }) => (
  <Panel>
    <FormHeader icon={<FaUserShield />} title="Add Admin" text="Create an admin account for academy operations." />
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-3">
        <FormField label="First Name" name="first_name" value={form.first_name} error={errors.first_name} onChange={onChange} required />
        <FormField label="Middle Name" name="middle_name" value={form.middle_name} error={errors.middle_name} onChange={onChange} />
        <FormField label="Last Name" name="last_name" value={form.last_name} error={errors.last_name} onChange={onChange} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Email" type="email" name="email" value={form.email} error={errors.email} onChange={onChange} required />
        <FormField label="Phone Number" name="phone_number" value={form.phone_number} error={errors.phone_number} onChange={onChange} required />
        <FormField label="Password" type="password" name="password" value={form.password} error={errors.password} onChange={onChange} required />
        <FormField label="Confirm Password" type="password" name="confirm_password" value={form.confirm_password} error={errors.confirm_password} onChange={onChange} required />
        <FormField label="Department" name="department" value={form.department} error={errors.department} onChange={onChange} required />
      </div>
      <SubmitButton loading={loading} text="Create Admin" />
    </form>
  </Panel>
);

const MentorFormPanel = ({ form, errors, loading, onChange, onSubmit }) => (
  <Panel>
    <FormHeader icon={<FaUsers />} title="Add Mentor" text="Create a mentor account and profile." />
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-3">
        <FormField label="First Name" name="first_name" value={form.first_name} error={errors.first_name} onChange={onChange} required />
        <FormField label="Middle Name" name="middle_name" value={form.middle_name} error={errors.middle_name} onChange={onChange} />
        <FormField label="Last Name" name="last_name" value={form.last_name} error={errors.last_name} onChange={onChange} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Email" type="email" name="email" value={form.email} error={errors.email} onChange={onChange} required />
        <FormField label="Years Of Experience" type="number" name="years_of_experience" value={form.years_of_experience} error={errors.years_of_experience} onChange={onChange} required />
        <FormField label="Password" type="password" name="password" value={form.password} error={errors.password} onChange={onChange} required />
        <FormField label="Confirm Password" type="password" name="confirm_password" value={form.confirm_password} error={errors.confirm_password} onChange={onChange} required />
      </div>
      <FormField label="Subjects" name="subjects_text" value={form.subjects_text} error={errors.subjects} onChange={onChange} placeholder="Frontend, Backend, Database" required />
      <TextAreaField label="Bio" name="bio" value={form.bio} error={errors.bio} onChange={onChange} />
      <SubmitButton loading={loading} text="Create Mentor" />
    </form>
  </Panel>
);

const CourseFormPanel = ({ form, errors, loading, onChange, onSubmit }) => (
  <Panel>
    <FormHeader icon={<FaBookOpen />} title="Add Course" text="Create a course before assigning batches." />
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Title" name="title" value={form.title} error={errors.title} onChange={onChange} required />
        <FormField label="Slug" name="slug" value={form.slug} error={errors.slug} onChange={onChange} placeholder="optional" />
        <SelectField label="Category" name="category" value={form.category} error={errors.category} onChange={onChange}>
          <option value="FRONTEND">Frontend</option>
          <option value="BACKEND">Backend</option>
          <option value="DATABASE">Database</option>
          <option value="FULLSTACK">Fullstack</option>
          <option value="DEVOPS">Devops</option>
          <option value="AI_ML">AI/ML</option>
        </SelectField>
        <FormField label="Duration Weeks" type="number" name="duration_weeks" value={form.duration_weeks} error={errors.duration_weeks} onChange={onChange} required />
        <FormField label="Thumbnail URL" name="thumbnail_url" value={form.thumbnail_url} error={errors.thumbnail_url} onChange={onChange} />
      </div>
      <TextAreaField label="Description" name="description" value={form.description} error={errors.description} onChange={onChange} />
      <SubmitButton loading={loading} text="Create Course" />
    </form>
  </Panel>
);

const BatchFormPanel = ({ form, errors, loading, courses, mentors, batches, onChange, onSubmit }) => (
  <Panel>
    <FormHeader icon={<FaLayerGroup />} title="Add Batch" text="Assign a course batch to a mentor." />
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <SelectField label="Course" name="course_id" value={form.course_id} error={errors.course_id} onChange={onChange} required>
          <option value="">Select course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </SelectField>
        <SelectField label="Mentor" name="mentor_id" value={form.mentor_id} error={errors.mentor_id} onChange={onChange} required>
          <option value="">Select mentor</option>
          {mentors.map((mentor) => (
            <option key={mentor.id} value={mentor.id}>{fullName(mentor) || mentor.email}</option>
          ))}
        </SelectField>
        <FormField label="Batch Name" name="batch_name" value={form.batch_name} error={errors.batch_name} onChange={onChange} required />
        <SelectField label="Batch Timing" name="batch_timing" value={form.batch_timing} error={errors.batch_timing} onChange={onChange}>
          <option value="MORNING">Morning</option>
          <option value="AFTERNOON">Afternoon</option>
          <option value="EVENING">Evening</option>
          <option value="NIGHT">Night</option>
        </SelectField>
        <FormField label="Start Date" type="date" name="start_date" value={form.start_date} error={errors.start_date} onChange={onChange} />
        <FormField label="End Date" type="date" name="end_date" value={form.end_date} error={errors.end_date} onChange={onChange} />
        <SelectField label="Status" name="status" value={form.status} error={errors.status} onChange={onChange}>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </SelectField>
      </div>
      <SubmitButton loading={loading} text="Create Batch" />
    </form>
    <div className="mt-8">
      <h4 className="mb-4 text-lg font-bold">Current Batches</h4>
      <BatchTable batches={batches} />
    </div>
  </Panel>
);

const BatchTable = ({ batches }) =>
  batches.length ? (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-3 pr-4">BATCH</th>
            <th className="py-3 pr-4">COURSE</th>
            <th className="py-3 pr-4">MENTOR</th>
            <th className="py-3 pr-4">TIMING</th>
            <th className="py-3 pr-4">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id} className="border-b border-slate-100 last:border-b-0">
              <td className="py-4 pr-4 font-semibold">{batch.batch_name}</td>
              <td className="py-4 pr-4 text-slate-600">{batch.course?.title || "N/A"}</td>
              <td className="py-4 pr-4 text-slate-600">{batch.mentor ? fullName(batch.mentor) || batch.mentor.email : "N/A"}</td>
              <td className="py-4 pr-4 text-slate-600">{batch.batch_timing}</td>
              <td className="py-4 pr-4"><StatusBadge status={batch.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState text="No batches created yet." />
  );

const CourseTable = ({ courses }) =>
  courses.length ? (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-3 pr-4">COURSE</th>
            <th className="py-3 pr-4">CATEGORY</th>
            <th className="py-3 pr-4">DURATION</th>
            <th className="py-3 pr-4">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-b border-slate-100 last:border-b-0">
              <td className="py-4 pr-4">
                <p className="font-semibold">{course.title}</p>
                <p className="mt-1 text-xs text-slate-500">{course.slug || "No slug"}</p>
              </td>
              <td className="py-4 pr-4 text-slate-600">{course.category}</td>
              <td className="py-4 pr-4 text-slate-600">{course.duration_weeks} weeks</td>
              <td className="py-4 pr-4"><StatusBadge status={course.is_active ? "ACTIVE" : "INACTIVE"} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState text="No courses found." />
  );


const FormHeader = ({ icon, title, text }) => (
  <div className="mb-6 flex items-center gap-4">
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-slate-500">{text}</p>
    </div>
  </div>
);

const FormField = ({ label, name, value, error, onChange, ...props }) => (
  <label className="grid gap-2">
    <span className="text-sm font-bold text-slate-500">{label}</span>
    <input
      name={name}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
      className={`h-11 rounded-lg border bg-white px-4 outline-none focus:border-blue-400 ${error ? "border-red-400" : "border-slate-200"}`}
      {...props}
    />
    {error && <span className="text-sm font-semibold text-red-500">{error}</span>}
  </label>
);

const SelectField = ({ label, name, value, error, onChange, children, ...props }) => (
  <label className="grid gap-2">
    <span className="text-sm font-bold text-slate-500">{label}</span>
    <select
      name={name}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
      className={`h-11 rounded-lg border bg-white px-4 outline-none focus:border-blue-400 ${error ? "border-red-400" : "border-slate-200"}`}
      {...props}
    >
      {children}
    </select>
    {error && <span className="text-sm font-semibold text-red-500">{error}</span>}
  </label>
);

const TextAreaField = ({ label, name, value, error, onChange }) => (
  <label className="grid gap-2">
    <span className="text-sm font-bold text-slate-500">{label}</span>
    <textarea
      name={name}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
      rows={4}
      className={`rounded-lg border bg-white px-4 py-3 outline-none focus:border-blue-400 ${error ? "border-red-400" : "border-slate-200"}`}
    />
    {error && <span className="text-sm font-semibold text-red-500">{error}</span>}
  </label>
);

const SubmitButton = ({ loading, text }) => (
  <button
    type="submit"
    disabled={loading}
    className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60 md:w-fit"
  >
    {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
    {loading ? "Submitting..." : text}
  </button>
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

    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

const SidebarSection = ({ section, activeMenu, isOpen, onToggle, openSections, onMenuClick }) => (
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
        {section.items.map((item) =>
          item.items ? (
            <div key={item.name}>
              <button
                onClick={() => onToggle(item.name)}
                className="flex h-11 w-full items-center justify-between rounded-lg px-4 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                <span className="flex items-center gap-3">
                  <span className="w-5 text-base">{item.icon}</span>
                  {item.name}
                </span>
                <FaChevronDown className={`transition ${openSections[item.name] ? "rotate-180" : ""}`} />
              </button>
              {openSections[item.name] && (
                <div className="ml-5 mt-1 space-y-1 border-l border-slate-200 pl-3">
                  {item.items.map((child) => (
                    <button
                      key={child.name}
                      onClick={() => onMenuClick(child.name)}
                      className={`flex h-10 w-full items-center gap-3 rounded-lg px-4 text-left text-sm font-semibold transition ${
                        activeMenu === child.name ? "bg-sky-100 text-blue-700" : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="w-5 text-base">{child.icon}</span>
                      {child.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
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
          )
        )}
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

const UserTable = ({ users, emptyText = "No admin users found." }) =>
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
    <EmptyState text={emptyText} />
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
  <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">{children}</section>
);

const fullName = (user) =>
  [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ");

export default AdminApprovals;
