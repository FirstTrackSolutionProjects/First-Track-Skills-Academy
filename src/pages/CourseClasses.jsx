import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaPlay,
  FaVideo,
  FaLock,
  FaBookOpen,
  FaFileAlt,
  FaDownload,
  FaCalendarAlt,
  FaClock,
  FaChalkboardTeacher,
  FaLaptopCode,
  FaCheck,
  FaTimes,
  FaExternalLinkAlt,
  FaGraduationCap
} from "react-icons/fa";
import useStore from "../store/useStore";
import { getMyEnrolledCourses } from "../service/enrollmentService";
import { getCourses } from "../service/courseService";

const CourseClasses = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { auth } = useStore();

  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("classes");
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [showLiveModal, setShowLiveModal] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Try getting from enrolled courses first
        if (auth?.token) {
          const enrolled = await getMyEnrolledCourses();
          const match = (enrolled || []).find(
            (c) => String(c.course_id || c.id) === String(courseId)
          );
          if (match) {
            setCourse(match);
            return;
          }
        }
        // Fallback to all courses
        const allCourses = await getCourses();
        const found = (allCourses || []).find((c) => String(c.id) === String(courseId));
        if (found) {
          setCourse(found);
        } else {
          // Default mock representation if not found
          setCourse({
            id: courseId,
            title: "AWS Deployment & Cloud Engineering",
            category: "DEVOPS",
            duration_weeks: 12,
            batch_timing: "MORNING",
            description: "Master AWS Cloud Deployment: EC2, S3, RDS, IAM, Lambda, Docker, ECS, and CI/CD pipelines.",
          });
        }
      } catch (err) {
        console.warn("Failed to load course details", err);
        setCourse({
          id: courseId,
          title: "AWS Deployment & Cloud Engineering",
          category: "DEVOPS",
          duration_weeks: 12,
          batch_timing: "MORNING",
          description: "Master AWS Cloud Deployment: EC2, S3, RDS, IAM, Lambda, Docker, ECS, and CI/CD pipelines.",
        });
      }
    };

    fetchCourseDetails();
  }, [courseId, auth]);

  const modules = [
    {
      id: 1,
      title: "Module 1: Cloud Architecture & Compute Services",
      classes: [
        {
          id: 101,
          title: "Class 1: Cloud Fundamentals & AWS Global Infrastructure",
          duration: "1h 20m",
          status: "COMPLETED",
          date: "Sep 01, 2026",
          recordingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          description: "Overview of regions, availability zones, edge locations, and console navigation.",
        },
        {
          id: 102,
          title: "Class 2: EC2 Provisioning, Security Groups & SSH Access",
          duration: "1h 45m",
          status: "COMPLETED",
          date: "Sep 03, 2026",
          recordingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          description: "Setting up Linux virtual machines, elastic IPs, key pairs, and inbound security rules.",
        },
        {
          id: 103,
          title: "Class 3: S3 Bucket Architecture & Static Web Hosting",
          duration: "1h 30m",
          status: "COMPLETED",
          date: "Sep 05, 2026",
          recordingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          description: "Deep dive into S3 storage tiers, bucket policies, CORS, and CloudFront integration.",
        },
      ],
    },
    {
      id: 2,
      title: "Module 2: Containerization & Modern Web Deployment",
      classes: [
        {
          id: 201,
          title: "Class 4: Containerizing Applications with Docker & Docker Compose",
          duration: "2h 00m",
          status: "LIVE_TODAY",
          date: "Today • 10:00 AM IST",
          description: "Writing Dockerfiles, multi-stage builds, and running multi-container stacks in cloud environments.",
        },
        {
          id: 202,
          title: "Class 5: Deploying Docker Microservices to AWS ECS & ECR",
          duration: "1h 45m",
          status: "UPCOMING",
          date: "Sep 08, 2026",
          description: "Managing container images with ECR and orchestrating tasks with Fargate and ECS clusters.",
        },
        {
          id: 203,
          title: "Class 6: Automated CI/CD Pipelines with GitHub Actions & AWS",
          duration: "2h 00m",
          status: "UPCOMING",
          date: "Sep 10, 2026",
          description: "Automating zero-downtime deployment pipelines directly on commit and pull request merges.",
        },
      ],
    },
    {
      id: 3,
      title: "Module 3: Managed Databases, Serverless & Production Architecture",
      classes: [
        {
          id: 301,
          title: "Class 7: Relational Databases with AWS RDS & High Availability",
          duration: "1h 45m",
          status: "LOCKED",
          date: "Sep 15, 2026",
          description: "Multi-AZ RDS deployments, read replicas, automated backups, and subnet groups.",
        },
        {
          id: 302,
          title: "Class 8: Application Load Balancers & Auto-Scaling Groups",
          duration: "2h 00m",
          status: "LOCKED",
          date: "Sep 17, 2026",
          description: "Target groups, health checks, path-based routing, and dynamic EC2 scaling policies.",
        },
        {
          id: 303,
          title: "Class 9: Serverless Microservices with AWS Lambda & API Gateway",
          duration: "1h 30m",
          status: "LOCKED",
          date: "Sep 22, 2026",
          description: "Event-driven compute, API endpoints, environment variables, and Cold Start optimizations.",
        },
      ],
    },
    {
      id: 4,
      title: "Module 4: Observability, Cloud Security & Capstone Defense",
      classes: [
        {
          id: 401,
          title: "Class 10: Monitoring with AWS CloudWatch, Logs & Metrics",
          duration: "1h 30m",
          status: "LOCKED",
          date: "Sep 24, 2026",
          description: "Setting up real-time alarms, SNS alerts, log groups, and custom dashboard metrics.",
        },
        {
          id: 402,
          title: "Class 11: Enterprise Security with IAM Policies & Secrets Manager",
          duration: "1h 45m",
          status: "LOCKED",
          date: "Sep 29, 2026",
          description: "Least privilege access, role assumption, rotating database secrets, and SSL certificates.",
        },
        {
          id: 403,
          title: "Class 12: Production Capstone Project Defense & Certification Prep",
          duration: "2h 30m",
          status: "LOCKED",
          date: "Oct 01, 2026",
          description: "Individual project review, architecture evaluation, and course completion certificate handout.",
        },
      ],
    },
  ];

  const resources = [
    { name: "AWS Cloud Deployment - Complete Lecture Notes (PDF)", size: "4.8 MB", type: "PDF Document" },
    { name: "Dockerfile & CI/CD Pipeline Starter Templates", size: "1.2 MB", type: "ZIP Archive" },
    { name: "AWS Architecture Diagrams & Cheat Sheets", size: "6.5 MB", type: "PDF Booklet" },
    { name: "Sample Database Schema & Seed Scripts", size: "450 KB", type: "SQL Script" },
  ];

  const assignments = [
    { title: "Lab 1: Deploy Static Portfolio to S3 + CloudFront CDN", status: "Submitted", score: "96 / 100", due: "Completed" },
    { title: "Lab 2: Multi-Container Docker Deployment on EC2", status: "In Review", score: "Pending", due: "Sep 07, 2026" },
    { title: "Capstone: Zero-Downtime CI/CD Pipeline to AWS ECS", status: "Assigned", score: "Upcoming", due: "Sep 28, 2026" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition shadow-sm"
            >
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </button>
            <div className="hidden sm:block h-6 w-px bg-slate-200" />
            <span className="hidden sm:inline-block text-sm font-semibold text-slate-500">
              Student Classroom Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              {course?.batch_timing || "MORNING"} BATCH
            </span>
            <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700">
              PENDING - AWAITING BATCH ALLOCATION
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        {/* Course Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl mb-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-md bg-orange-500/20 border border-orange-400/30 px-2.5 py-1 text-xs font-bold text-orange-400">
                  {course?.category || "DEVOPS"}
                </span>
                <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-300">
                  {course?.duration_weeks || 12} Weeks Course
                </span>
                <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-300">
                  12 Live Interactive Classes
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {course?.title || "AWS Deployment & Cloud Engineering"}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                {course?.description || "Master AWS Cloud Deployment: EC2, S3, RDS, IAM, Lambda, Docker, ECS, and CI/CD pipelines."}
              </p>
            </div>

            {/* Progress Card */}
            <div className="shrink-0 rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10 min-w-[240px]">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span>Course Progress</span>
                <span className="text-orange-400">25% Completed</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style={{ width: "25%" }} />
              </div>
              <p className="mt-3 text-xs text-slate-400 flex items-center justify-between">
                <span>3 of 12 Classes Attended</span>
                <span className="font-semibold text-white">9 Remaining</span>
              </p>
            </div>
          </div>
        </div>

        {/* Live Class Notice Banner */}
        <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/80 p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md text-xl animate-pulse">
              <FaVideo />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Next Live Class Ready</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Class 4: Containerizing Applications with Docker & Docker Compose
              </h3>
              <p className="text-xs text-slate-600 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1"><FaClock className="text-orange-500" /> 10:00 AM - 12:00 PM IST</span>
                <span className="flex items-center gap-1"><FaChalkboardTeacher className="text-blue-600" /> Mentor: Aditya Kumar</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLiveModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:scale-105"
          >
            <FaVideo />
            <span>Join Live Class</span>
          </button>
        </div>

        {/* Content Tabs Navigation */}
        <div className="border-b border-slate-200 mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "classes", label: "Classes & Curriculum", icon: <FaPlay /> },
            { id: "resources", label: "Resources & Notes", icon: <FaFileAlt /> },
            { id: "assignments", label: "Assignments & Labs", icon: <FaLaptopCode /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 border-b-2 px-5 py-3.5 text-sm font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600 bg-orange-50/50 rounded-t-xl"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: Classes & Curriculum */}
        {activeTab === "classes" && (
          <div className="space-y-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-base">{module.title}</h3>
                  <span className="text-xs font-semibold text-slate-500">
                    {module.classes.length} Sessions
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {module.classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/60 transition"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {cls.status === "COMPLETED" && (
                            <FaCheckCircle className="text-xl text-emerald-500" title="Completed" />
                          )}
                          {cls.status === "LIVE_TODAY" && (
                            <div className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow">
                              <FaPlay className="text-[9px] ml-0.5" />
                            </div>
                          )}
                          {(cls.status === "UPCOMING" || cls.status === "LOCKED") && (
                            <FaLock className="text-base text-slate-300" title="Upcoming session" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                              {cls.title}
                            </h4>
                            {cls.status === "LIVE_TODAY" && (
                              <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-xs font-extrabold animate-pulse">
                                Live Session
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 max-w-xl">
                            {cls.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-400">
                            <span className="flex items-center gap-1"><FaClock /> {cls.duration}</span>
                            <span className="flex items-center gap-1"><FaCalendarAlt /> {cls.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="sm:shrink-0">
                        {cls.status === "COMPLETED" && (
                          <button
                            onClick={() => setSelectedLecture(cls)}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-sm"
                          >
                            <FaPlay className="text-[10px]" />
                            <span>Watch Recording</span>
                          </button>
                        )}
                        {cls.status === "LIVE_TODAY" && (
                          <button
                            onClick={() => setShowLiveModal(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition shadow-sm"
                          >
                            <FaVideo />
                            <span>Join Session</span>
                          </button>
                        )}
                        {cls.status === "UPCOMING" && (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-500">
                            <FaClock /> Scheduled
                          </span>
                        )}
                        {cls.status === "LOCKED" && (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400">
                            <FaLock /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Resources & Notes */}
        {activeTab === "resources" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Learning Resources & Handouts</h3>
            <p className="text-sm text-slate-500 mb-6">
              Download lecture slides, architectural cheat sheets, lab code repositories, and interview guides.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {resources.map((res, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-orange-300 hover:bg-orange-50/30 transition shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 text-lg">
                      <FaBookOpen />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{res.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{res.type} • {res.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading: ${res.name}`)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-orange-400 hover:text-orange-600 transition"
                    title="Download Resource"
                  >
                    <FaDownload className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Assignments & Labs */}
        {activeTab === "assignments" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Practical Assignments & Lab Exercises</h3>
            <p className="text-sm text-slate-500 mb-6">
              Complete these hands-on tasks to earn practical deployment skills and course certification.
            </p>

            <div className="space-y-4">
              {assignments.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 p-5 hover:border-blue-200 transition"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Due Date: {item.due}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.status === "Submitted"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.status === "In Review"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status} ({item.score})
                    </span>
                    <button
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      onClick={() => alert(`Opening assignment portal for: ${item.title}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Recording Video Player Modal */}
      {selectedLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase">Class Video Recording</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedLecture.title}</h3>
              </div>
              <button
                onClick={() => setSelectedLecture(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-4 aspect-video w-full rounded-xl bg-slate-900 overflow-hidden relative flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0"
                title="Class Recording"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-slate-500">{selectedLecture.description}</p>
              <button
                onClick={() => setSelectedLecture(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Class Session Modal */}
      {showLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 text-2xl mb-4">
              <FaVideo />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Connecting to Live Classroom</h3>
            <p className="mt-2 text-sm text-slate-500">
              Class 4: Containerizing Applications with Docker & Docker Compose
            </p>

            <div className="my-6 rounded-xl bg-slate-50 p-4 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Instructor:</span>
                <span>Aditya Kumar (AWS Cloud Mentor)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Batch:</span>
                <span>Morning Batch (10:00 AM - 12:00 PM)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Status:</span>
                <span className="text-emerald-600 font-bold">Class Room Active</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  window.open("https://meet.google.com", "_blank");
                  setShowLiveModal(false);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-sm shadow-md transition"
              >
                <span>Launch Live Room</span>
                <FaExternalLinkAlt className="text-xs" />
              </button>
              <button
                onClick={() => setShowLiveModal(false)}
                className="w-1/3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 text-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseClasses;
