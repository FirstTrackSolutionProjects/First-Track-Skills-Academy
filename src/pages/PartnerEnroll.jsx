import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaSpinner,
  FaClock,
} from "react-icons/fa";
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
  const [enrolledDetails, setEnrolledDetails] = useState(null);
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

  const coursePrice = Number(selectedCourse?.effective_price ?? selectedCourse?.price) || 25000;

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
      payment_mode: "OFFLINE",
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
      setEnrolledDetails({
        status: "APPLIED",
        mode: "OFFLINE",
        courseTitle: selectedCourse.title,
        collegeName: partner.college_name,
        batchTiming,
      });
      setEnrolled(true);
      setFieldErrors({});
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to submit cohort application");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <AuthFormShell badge="Cohort Admission" title="Verifying Link">
        <div className="flex items-center justify-center gap-3 text-orange-600 font-semibold">
          <FaSpinner className="animate-spin" />
          Verifying cohort link...
        </div>
      </AuthFormShell>
    );
  }

  if (!partner) {
    return (
      <AuthFormShell badge="Cohort Admission" title="Invalid Partner Link">
        <p className="text-center text-gray-600">
          This partner link is inactive or invalid.
        </p>
      </AuthFormShell>
    );
  }

  if (!auth?.token || auth?.user?.role !== "STUDENT") {
    return <Navigate to={`/join/${partnerCode}`} replace />;
  }

  if (!courseId || !selectedCourse) {
    return <Navigate to={`/join/${partnerCode}`} replace />;
  }

  if (enrolled && enrolledDetails) {
    return (
      <AuthFormShell
        badge="Application Submitted"
        title="Application Received"
        subtitle={`Application registered for ${enrolledDetails.collegeName}.`}
      >
        <div className="text-center py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white shadow-md mb-5 bg-purple-600">
            <FaClock className="text-2xl" />
          </div>

          <span className="inline-block rounded-full px-4 py-1 text-xs font-black tracking-wider uppercase mb-3 bg-purple-200 text-purple-900 border border-purple-300">
            Status: Applied
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            {enrolledDetails.courseTitle}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
            Your application for <span className="font-bold text-gray-900">{enrolledDetails.courseTitle}</span> under{" "}
            <span className="font-bold text-gray-900">{enrolledDetails.collegeName}</span> has been received. You will be notified once your batch is allocated.
          </p>

          {/* Details Box */}
          <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-5 text-left text-sm space-y-2.5 shadow-sm max-w-md mx-auto">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Partner College</span>
              <span className="font-bold text-slate-800">{enrolledDetails.collegeName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Batch Timing</span>
              <span className="font-bold text-slate-800">{enrolledDetails.batchTiming} Batch</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Admission Status</span>
              <span className="font-bold flex items-center gap-1.5 text-purple-700">
                <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                {enrolledDetails.status}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-bold text-white shadow-md transition hover:bg-orange-600 hover:scale-105"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3.5 font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Academy Home
            </Link>
          </div>
        </div>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell
      badge="Confirm Cohort Enrollment"
      title="Enroll in Course"
      subtitle={`Partner cohort admission for ${partner.college_name}.`}
    >
      <button
        onClick={() => navigate(`/join/${partnerCode}`)}
        className="mb-6 inline-flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
      >
        <FaArrowLeft />
        Back to courses
      </button>

      {/* Selected Course Card */}
      <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600">{selectedCourse.category}</p>
          <span className="rounded-full bg-orange-100 border border-orange-200 px-3 py-0.5 text-xs font-bold text-orange-800">
            {partner.college_name}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{selectedCourse.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-3">
          <span className="text-sm font-semibold text-gray-700">{selectedCourse.duration_weeks} Weeks Duration</span>
          <span className="text-lg font-black text-slate-900">₹{coursePrice.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Batch Timing Selection */}
      <div className="mt-6">
        <FormSelect label="Batch Timing Preference" value={batchTiming} onChange={updateBatchTiming}>
          <option value="MORNING">Morning Batch (09:00 AM - 11:00 AM)</option>
          <option value="AFTERNOON">Afternoon Batch (02:00 PM - 04:00 PM)</option>
          <option value="EVENING">Evening Batch (06:00 PM - 08:00 PM)</option>
          <option value="NIGHT">Night Batch (08:00 PM - 10:00 PM)</option>
        </FormSelect>
        {fieldErrors.batch_timing && (
          <p className="mt-1.5 text-sm font-medium text-red-500">{fieldErrors.batch_timing}</p>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl py-4 text-lg font-bold text-white transition shadow-md bg-purple-600 hover:bg-purple-700 disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <>
            <span>Submitting Application...</span>
            <FaSpinner className="animate-spin" />
          </>
        ) : (
          <>
            <span>Submit Application</span>
            <FaPaperPlane />
          </>
        )}
      </button>
    </AuthFormShell>
  );
};

export default PartnerEnroll;
