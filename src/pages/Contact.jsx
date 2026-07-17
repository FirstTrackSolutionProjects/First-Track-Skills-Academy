import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";
import { COURSES_ENUM } from "../constants/enums";
import { useState } from "react";
import { toast } from "react-toastify";
import sendContactUs from "../services/contact/send_contact_us.contact.service";

const Contact = () => {
  const INITIAL_CONTACT_FORM_STATE = Object.freeze({
    name: "",
    phone: "",
    email: "",
    course: "",
    message: "",
  })
  const [formData, setFormData] = useState(INITIAL_CONTACT_FORM_STATE);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendContactUs(formData);
      setFormData(INITIAL_CONTACT_FORM_STATE);
      toast.success("Message sent successfully");
    } catch (error) {
      console.error(error.message || "Something Went Wrong");
      toast.error(error.message || "Failed to send message")
    }
  }
  return (
    <section className="pt-36 pb-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            CONTACT US
          </span>

          <h1 className="text-5xl font-bold text-gray-900 mt-6">
            Get In <span className="text-orange-500">Touch</span>
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 leading-8">
            Have questions about our courses or admissions? We'd love to hear
            from you. Fill out the form or contact us using the information
            below.
          </p>

        </div>

        {/* Contact Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <FaMapMarkerAlt className="text-4xl text-orange-500 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Address</h3>
            <p className="text-gray-600">
              Bhubaneswar,
              <br />
              Odisha, India
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <FaPhoneAlt className="text-4xl text-orange-500 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Phone</h3>
            <p className="text-gray-600">
              +91 9040170727
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <FaEnvelope className="text-4xl text-orange-500 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Email</h3>
            <p className="text-gray-600 break-all">
              contact@firsttrackskillsacademy.in
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <FaClock className="text-4xl text-orange-500 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Working Hours</h3>
            <p className="text-gray-600">
              Mon - Sat
              <br />
              9:00 AM - 7:00 PM
            </p>
          </div>

        </div>

        {/* Form + Info */}

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact Form */}

          <div className="bg-white rounded-3xl shadow-xl p-10">

            <h2 className="text-3xl font-bold mb-8">
              Send Us a Message
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded-xl px-5 py-4 outline-none focus:border-orange-500"
                onChange={handleChange}
                name="name"
                value={formData.name}
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-xl px-5 py-4 outline-none focus:border-orange-500"
                onChange={handleChange}
                name="email"
                value={formData.email}
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border rounded-xl px-5 py-4 outline-none focus:border-orange-500"
                onChange={handleChange}
                name="phone"
                value={formData.phone}
              />

              <select className="w-full border rounded-xl px-5 py-4 outline-none focus:border-orange-500"
                onChange={handleChange}
                name="course"
                value={formData.course}
              >

                <option>Select Course</option>
                {Object.values(COURSES_ENUM).map((course) => (
                  <option key={course}>{course}</option>
                ))}

              </select>

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full border rounded-xl px-5 py-4 outline-none focus:border-orange-500"
                onChange={handleChange}
                name="message"
                value={formData.message}
              ></textarea>

              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition"
              >
                Send Message
                <FaPaperPlane />
              </button>

            </form>

          </div>

          {/* Contact Info */}

          <div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-10 shadow-xl">

              <h2 className="text-3xl font-bold mb-6">
                Why Contact Us?
              </h2>

              <ul className="space-y-5 leading-8">

                <li>✔ Course counselling & career guidance</li>
                <li>✔ Admission assistance</li>
                <li>✔ Placement support information</li>
                <li>✔ Internship opportunities</li>
                <li>✔ Fee structure & scholarship details</li>

              </ul>

              <a
                href="https://wa.me/919040170727"
                target="_blank"
                rel="noreferrer"
                className="mt-10 inline-flex items-center gap-3 bg-white text-orange-600 px-6 py-4 rounded-xl font-bold hover:scale-105 transition"
              >
                <FaWhatsapp />
                Chat on WhatsApp
              </a>

            </div>
            <div className="mt-5">
              <Link
                to="/enroll"
                className="w-full inline-flex items-center justify-center bg-white border-2 border-white text-orange-600 px-6 py-4 rounded-xl font-bold hover:bg-orange-100 transition"
              >
                Apply Now
              </Link>
            </div>

            {/* Google Map */}

            <div className="mt-8 rounded-3xl overflow-hidden shadow-lg">

              <iframe
                title="Google Map"
                src="https://maps.google.com/maps?q=Bhubaneswar&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-[320px]"
              ></iframe>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;