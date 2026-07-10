import React, { useState } from "react";

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
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-4xl mx-auto px-6">

        <div className="text-center mb-12">

          <span className="bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            Career Application
          </span>

          <h2 className="text-5xl font-bold mt-5">
            Join Our Team
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Fill out the application form below and our HR team will
            contact you if your profile matches our requirements.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-3xl p-10"
        >

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter Full Name"
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter Email"
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-medium">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter Phone Number"
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-medium">Position Applying For</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
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

            <div>
              <label className="font-medium">Highest Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="B.Tech / MCA / MBA"
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-medium">Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
              >
                <option value="">Select Experience</option>
                <option>Fresher</option>
                <option>0-1 Years</option>
                <option>1-3 Years</option>
                <option>3-5 Years</option>
                <option>5+ Years</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Current Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter City"
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-medium">Upload Resume</label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full mt-2 border rounded-xl px-4 py-3"
              />
            </div>

          </div>

          <div className="mt-6">
            <label className="font-medium">
              Cover Letter / Message
            </label>

            <textarea
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            Submit Application
          </button>

        </form>

      </div>
    </section>
  );
};

export default Career;