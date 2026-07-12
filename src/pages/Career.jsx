import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaPaperPlane,
} from "react-icons/fa";

const benefits = [
  "Professional Work Environment",
  "Career Growth Opportunities",
  "Flexible Working Culture",
  "Competitive Salary Package",
  "Continuous Learning & Development",
  "Friendly & Supportive Team",
];

const Career = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    qualification: "",
    experience: "",
    location: "",
    resume: null,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Application Submitted Successfully!");

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      qualification: "",
      experience: "",
      location: "",
      resume: null,
      message: "",
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#FFF8F0] py-20">

      {/* Background Blur */}

      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-200 blur-3xl opacity-30"></div>

      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-orange-100 blur-3xl opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            Career Opportunities
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
            Join Our Amazing Team
          </h2>

          <p className="mt-5 text-lg text-gray-600 leading-8">
            We are always looking for passionate, talented and creative
            individuals who want to make an impact in education and
            technology.
          </p>

        </div>

        {/* Main Section */}

        <div className="grid lg:grid-cols-5 gap-10 mt-16">

          {/* Left Side */}

          <div className="lg:col-span-2">

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-10 text-white shadow-2xl h-full">

              <h3 className="text-3xl font-bold">
                Why Join First Track?
              </h3>

              <p className="mt-5 text-orange-100 leading-8">
                At First Track Skills Academy, you'll work with a passionate
                team committed to empowering students through innovation,
                technology, and practical learning.
              </p>

              <div className="mt-10 space-y-5">

                {benefits.map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-4"
                  >

                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">

                      <FaCheckCircle />

                    </div>

                    <span className="text-lg">
                      {item}
                    </span>

                  </div>

                ))}

              </div>

              <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur">

                <h4 className="text-xl font-semibold">
                  Grow With Us 🚀
                </h4>

                <p className="mt-3 text-orange-100 leading-7">
                  Join a workplace where learning never stops. Build your
                  career while helping thousands of students achieve theirs.
                </p>

              </div>

            </div>

          </div>

          {/* Right Side Form */}

          <div className="lg:col-span-3">

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-10"
            >
              <form
  onSubmit={handleSubmit}
  className="bg-white rounded-3xl shadow-2xl p-8 md:p-10"
></form>

{/* Form Grid */}

<div className="grid md:grid-cols-2 gap-6">

  {/* Full Name */}

  <div>

    <label className="font-semibold text-gray-700">
      Full Name
    </label>

    <div className="relative mt-2">

      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />

      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
        placeholder="Enter your full name"
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500"
      />

    </div>

  </div>

  {/* Email */}

  <div>

    <label className="font-semibold text-gray-700">
      Email Address
    </label>

    <div className="relative mt-2">

      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Enter email"
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500"
      />

    </div>

  </div>

  {/* Phone */}

  <div>

    <label className="font-semibold text-gray-700">
      Phone Number
    </label>

    <div className="relative mt-2">

      <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />

      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        placeholder="Enter phone number"
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500"
      />

    </div>

  </div>

  {/* Position */}

  <div>

    <label className="font-semibold text-gray-700">
      Position Applying For
    </label>

    <div className="relative mt-2">

      <FaBriefcase className="absolute left-4 top-4 text-orange-500" />

      <select
        name="position"
        value={formData.position}
        onChange={handleChange}
        required
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500"
      >
        <option value="">Select Position</option>
        <option>Frontend Developer</option>
        <option>Backend Developer</option>
        <option>Full Stack Developer</option>
        <option>UI/UX Designer</option>
        <option>Digital Marketing Executive</option>
        <option>HR Executive</option>
        <option>Trainer</option>
      </select>

    </div>

  </div>

  {/* Qualification */}

  <div>

    <label className="font-semibold text-gray-700">
      Qualification
    </label>

    <div className="relative mt-2">

      <FaGraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />

      <input
        type="text"
        name="qualification"
        value={formData.qualification}
        onChange={handleChange}
        placeholder="B.Tech / MCA / MBA"
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500"
      />

    </div>

  </div>

  {/* Experience */}

  <div>

    <label className="font-semibold text-gray-700">
      Experience
    </label>

    <select
      name="experience"
      value={formData.experience}
      onChange={handleChange}
      className="w-full mt-2 px-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500"
    >
      <option value="">Select Experience</option>
      <option>Fresher</option>
      <option>0-1 Years</option>
      <option>1-3 Years</option>
      <option>3-5 Years</option>
      <option>5+ Years</option>
    </select>

  </div>

  {/* Location */}

  <div>

    <label className="font-semibold text-gray-700">
      Current Location
    </label>

    <div className="relative mt-2">

      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />

      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Enter your city"
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500"
      />

    </div>

  </div>

  {/* Resume */}

  <div>

    <label className="font-semibold text-gray-700">
      Upload Resume
    </label>

    <div className="mt-2 border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center hover:border-orange-500 transition">

      <FaCloudUploadAlt className="text-5xl text-orange-500 mx-auto mb-4" />

      <p className="font-semibold text-gray-800">
        Upload Resume
      </p>

      <p className="text-gray-500 text-sm mt-2">
        PDF, DOC, DOCX (Max 5MB)
      </p>

      <input
        type="file"
        name="resume"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        className="mt-4"
      />

    </div>

  </div>

</div>

{/* Message */}

<div className="mt-8">

  <label className="font-semibold text-gray-700">
    Cover Letter / Message
  </label>

  <textarea
    rows="5"
    name="message"
    value={formData.message}
    onChange={handleChange}
    placeholder="Tell us about yourself..."
    className="w-full mt-2 px-4 py-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 resize-none"
  ></textarea>

</div>

<button
  type="submit"
  className="mt-8 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-orange-300 transition-all duration-300 hover:-translate-y-1"
>
  <FaPaperPlane />

  Submit Application
</button>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Career;