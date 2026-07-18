import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { COURSES_ENUM } from "../constants/enums";
import getEnrollUploadUrls from "@/services/courses/get_enroll_upload_urls.courses.service";
import putObjectService from "@/services/putObjectService";
import sendEnrollment from "@/services/courses/send_enrollment.courses.service";

const INITIAL_FORM_STATE = Object.freeze({
  fullName: "Test",
  email: "test@gmail.com",
  phone: "9123465569",
  dob: "2004-04-29",
  gender: "Male",
  district: "Motihari",
  state: "Bihar",
  pin: "845401",
  course: COURSES_ENUM.FRONTEND_DEVELOPMENT,
  mode: "Online",
  batch: "Evening",
  qualification: "B.Tech",
  college: "IIITBH",
  message: "Message",
  files: {
    profileImage: "",
    resume: "",
  },
  agree: false,
});

const Enroll = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [files, setFiles] = useState(Object.keys(INITIAL_FORM_STATE.files).reduce((acc, key) => {
    acc[key] = null
    return acc
  }, {}));

  const [loading, setLoading] = useState(false);

  const fileRefsObject = Object.keys(formData.files).reduce((acc, key) => {
    acc[key] = useRef(null);
    return acc;
  }, {})

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (Object.keys(INITIAL_FORM_STATE.files).includes(name)) {
      setFiles((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    }
    else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
    else setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // --- Step 1: Get presigned upload URLs for all files at once ---
      const fileArray = Object.keys(files).map((fileKey) => ({
        inputName: fileKey,
        filename: files[fileKey].name,
        filetype: files[fileKey].type,
      }))
      const uploadUrlObject = await getEnrollUploadUrls(fileArray);

      // upload files
      const uploadStatus = await Promise.allSettled(
        Object.keys(uploadUrlObject).map((key) => putObjectService(uploadUrlObject[key].uploadUrl, files[key], files[key].type))
      )

      let failedFiles = 0;

      for (let i = 0; i < uploadStatus.length; i++) {
        if (uploadStatus[i].status === "rejected") {
          failedFiles++;
          toast.error(`Failed to upload file`)
        }
      }

      if (failedFiles > 0) return;

      // Build the updated files map synchronously so it is available immediately
      const updatedFiles = Object.fromEntries(
        Object.entries(uploadUrlObject).map(([key, value]) => [key, value.fileKey])
      );

      // Keep React state in sync (for any re-renders after submission)
      setFormData((prev) => ({ ...prev, files: updatedFiles }));

      // --- Step 4: Submit form data + fileKeys to backend ---
      await sendEnrollment({ ...formData, files: updatedFiles });

      // --- Success ---
      toast.success("Enrollment submitted successfully!");
      // setFormData({ ...INITIAL_FORM_STATE });
      // if (fileRefsObject.profileImage.current) fileRefsObject.profileImage.current.value = "";
      // if (fileRefsObject.resume.current) fileRefsObject.resume.current.value = "";
    } catch (error) {
      console.error(error.message || "Something went wrong");
      toast.error(error.message || "Failed to submit enrollment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#FFF8F0] py-20">
      <div className="max-w-6xl mx-auto px-5">

        <div className="text-center mb-12">

          <span className="bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            Admission Form
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mt-5">
            Enroll Now
          </h1>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Begin your career journey by enrolling in one of our
            industry-oriented training programs.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-10"
        >

          <h2 className="text-2xl font-bold mb-6">
            Student Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border rounded-xl px-4 py-3"
            />

            <div className="relative">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full h-14 border border-gray-300 rounded-xl px-4 bg-white
                          text-gray-700 focus:outline-none focus:ring-2
                          focus:ring-orange-500"
              />
              {!formData.dob && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  Select Date of Birth
                </span>
              )}
            </div>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="border rounded-xl px-4 py-3"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input
              type="text"
              name="district"
              placeholder="District / City"
              value={formData.district}
              required
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              required
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="text"
              name="pin"
              placeholder="PIN Code"
              value={formData.pin}
              required
              onChange={handleChange}
              maxLength={6}
              className="border rounded-xl px-4 py-3"
            />

          </div>

          <h2 className="text-2xl font-bold mt-10 mb-6">
            Course Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              className="border rounded-xl px-4 py-3"
            >
              <option value="">Select Course</option>
              {Object.values(COURSES_ENUM).map((course) => (
                <option key={course}>{course}</option>
              ))}
            </select>

            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              required
              className="border rounded-xl px-4 py-3"
            >
              <option value="">Learning Mode</option>
              <option>Online</option>
              <option>Offline</option>
              <option>Hybrid</option>
            </select>

            <select
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              required
              className="border rounded-xl px-4 py-3"
            >
              <option value="">Preferred Batch</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Weekend</option>
            </select>

          </div>

          <h2 className="text-2xl font-bold mt-10 mb-6">
            Education
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              name="qualification"
              placeholder="Highest Qualification"
              required
              value={formData.qualification}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="text"
              name="college"
              placeholder="College / University"
              required
              value={formData.college}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

          </div>

          <div className="mt-8">

            <textarea
              rows="5"
              name="message"
              placeholder="Additional Message"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />

          </div>

          <h2 className="text-2xl font-bold mt-10 mb-6">
            Upload Documents
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Profile Image */}
            <div>
              <label className="block font-semibold mb-2">
                Profile Image
              </label>
              <input
                ref={fileRefsObject.profileImage}
                type="file"
                name="profileImage"
                accept="image/*"
                required
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 file:bg-orange-500 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
              />
              {formData.profileImage && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {formData.profileImage.name}
                </p>
              )}
            </div>

            {/* Resume */}
            <div>
              <label className="block font-semibold mb-2">
                Upload Resume
              </label>
              <input
                ref={fileRefsObject.resume}
                type="file"
                name="resume"
                required
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 file:bg-orange-500 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
              />
              {formData.resume && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {formData.resume.name}
                </p>
              )}
            </div>

          </div>

          <div className="mt-6 flex items-center gap-3">

            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              required
            />

            <span className="text-gray-600">
              I agree to the{" "}
              <Link to="/terms-of-use" className="text-orange-500 underline">Terms &amp; Conditions</Link>
              {" "}and{" "}
              <Link to="/privacy-policy" className="text-orange-500 underline">Privacy Policy</Link>.
            </span>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition"
          >
            {loading ? "Submitting..." : "Enroll Now"}
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
          </button>

        </form>

      </div>
    </section>
  );
};

export default Enroll;