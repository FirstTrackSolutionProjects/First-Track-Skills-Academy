import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Enroll = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    district: "",
    course: "",
    mode: "",
    batch: "",
    qualification: "",
    college: "",
    message: "",
    profileImage: null,
    resume: null,
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
  
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Enrollment Submitted Successfully!");

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      city: "",
      course: "",
      mode: "",
      batch: "",
      qualification: "",
      college: "",
      message: "",
      agree: false,
    });
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
    <div>
  <label className="block mb-2 font-semibold text-gray-700">
    Date of Birth
  </label>

  <input
    type="date"
    name="dob"
    value={formData.dob}
    onChange={handleChange}
    required
    className="w-full border border-gray-300 rounded-xl px-4 py-4 bg-white
               focus:outline-none focus:ring-2 focus:ring-orange-500"
  />
</div>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input
              type="text"
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleChange}
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
              <option>Frontend Development</option>
              <option>Backend Development</option>
              <option>Full Stack Development</option>
              <option>Digital Marketing</option>
              <option>HR Management</option>
            </select>

            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
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
              value={formData.qualification}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="text"
              name="college"
              placeholder="College / University"
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
              value={formData.message}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />

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
              I agree to the Terms & Conditions and Privacy Policy.
            </span>

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
      type="file"
      name="profileImage"
      accept="image/*"
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
      type="file"
      name="resume"
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

          <button
            type="submit"
            className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            Enroll Now
          </button>

        </form>

      </div>
    </section>
  );
};

export default Enroll;