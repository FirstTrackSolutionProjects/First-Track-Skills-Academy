import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCheck, FaPaperPlane, FaSpinner } from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormSelect from "../components/forms/FormSelect";
import { getCourses } from "../service/courseService";
import { enrollCohort } from "../service/enrollmentService";
import { verifyPartner } from "../service/collegeService";
import useStore from "../store/useStore";
import { enrollCohortCourseSchema } from "../validator/enrollmentSchema";
import { mapZodIssuesToFieldErrors } from "../validator/validation";

const PartnerEnroll = () => {
  const { partnerCode } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { auth } = useStore();
  const [partner, setPartner] = useState(null);
  const [courses, setCourses] = useState([]);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const courseId = Number(searchParams.get("courseId"));
  const batchTiming = searchParams.get("batchTiming") || "EVENING";

  useEffect(() => {
    const loadPage = async () => {
      try {
        const partnerData = await verifyPartner(partnerCode);
        setPartner(partnerData);

        if (auth?.token && auth?.user?.role === "STUDENT") {
          const courseData = await getCourses(auth.token);
          setCourses(courseData || []);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setChecking(false);
      }
    };

    loadPage();
  }, [auth, partnerCode]);

  const selectedCourse = useMemo(
    () => courses.find((course) => Number(course.id) === courseId),
    [courseId, courses]
  );

  const updateBatchTiming = (event) => {
    setSearchParams({
      courseId: String(courseId),
      batchTiming: event.target.value,
    });
  };

  const handleEnroll = async () => {
    const payload = {
      course_id: courseId,
      partner_code: partnerCode,
      batch_timing: batchTiming,
    };

    const parsed = enrollCohortCourseSchema.safeParse(payload);

    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);
      await enrollCohort(parsed.data, auth.token);
      setEnrolled(true);
      setFieldErrors({});
      toast.success("Course enrolled successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!auth) return <Navigate to={`/join/${partnerCode}`} replace />;
  if (auth.user.role !== "STUDENT") return <Navigate to="/dashboard" replace />;

  if (checking) {
    return (
      <AuthFormShell badge="College Cohort" title="Preparing Enrollment">
        <div className="flex items-center justify-center gap-3 font-semibold text-orange-600">
          <FaSpinner className="animate-spin" />
          Loading selected course...
        </div>
      </AuthFormShell>
    );
  }

  if (!partner) {
    return (
      <AuthFormShell badge="Partner Link" title="Invalid Partner Link">
        <p className="text-center text-gray-600">This partner link is inactive, invalid, or not approved.</p>
      </AuthFormShell>
    );
  }

  if (!selectedCourse) {
    return (
      <AuthFormShell badge="College Cohort" title="Choose a Course First">
        <div className="text-center">
          <p className="text-gray-600">The selected course could not be found.</p>
          <Link
            to={`/join/${partnerCode}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            <FaArrowLeft />
            Back to Courses
          </Link>
        </div>
      </AuthFormShell>
    );
  }

  if (enrolled) {
    return (
      <AuthFormShell badge="Enrollment Complete" title="You Are Enrolled">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
            <FaCheck />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
          <p className="mt-2 text-gray-600">
            You joined {partner.college_name} for the {batchTiming.toLowerCase()} batch.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Go to Dashboard
          </Link>
        </div>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell
      badge="Confirm Enrollment"
      title="Enroll in Course"
      subtitle={`Final step for ${partner.college_name}.`}
    >
      <button
        onClick={() => navigate(`/join/${partnerCode}`)}
        className="mb-6 inline-flex items-center gap-2 font-semibold text-orange-600"
      >
        <FaArrowLeft />
        Back to courses
      </button>

      <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
        <p className="text-sm font-bold text-orange-600">{selectedCourse.category}</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
        <p className="mt-3 text-gray-600">{selectedCourse.description}</p>
        <p className="mt-4 font-semibold text-gray-900">{selectedCourse.duration_weeks} weeks</p>
      </div>

      <div className="mt-6">
        <FormSelect label="Batch Timing" value={batchTiming} onChange={updateBatchTiming}>
          <option value="MORNING">Morning</option>
          <option value="AFTERNOON">Afternoon</option>
          <option value="EVENING">Evening</option>
          <option value="NIGHT">Night</option>
        </FormSelect>
        {fieldErrors.batch_timing && <p className="mt-1.5 text-sm font-medium text-red-500">{fieldErrors.batch_timing}</p>}
        {fieldErrors.course_id && <p className="mt-1.5 text-sm font-medium text-red-500">{fieldErrors.course_id}</p>}
        {fieldErrors.partner_code && <p className="mt-1.5 text-sm font-medium text-red-500">{fieldErrors.partner_code}</p>}
      </div>

      <button
        onClick={handleEnroll}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 py-4 text-lg font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
      >
        {loading ? "Enrolling..." : "Enroll Now"}
        {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
      </button>
    </AuthFormShell>
  );
};

export default PartnerEnroll;
