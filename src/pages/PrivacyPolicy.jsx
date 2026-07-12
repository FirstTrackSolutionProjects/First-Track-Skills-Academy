import React from "react";
import {
  FaUserShield,
  FaDatabase,
  FaLock,
  FaCookieBite,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";

const sections = [
  {
    icon: <FaDatabase />,
    title: "Information We Collect",
    content:
      "We may collect your name, email address, phone number, educational qualifications, payment information, and other details required during course registration or while using our services.",
  },
  {
    icon: <FaUserShield />,
    title: "How We Use Your Information",
    list: [
      "Course registration and enrollment",
      "Student support and communication",
      "Course updates and notifications",
      "Internship & placement assistance",
      "Certificates and academic records",
      "Marketing communications (only with your consent)",
    ],
  },
  {
    icon: <FaLock />,
    title: "Data Security",
    content:
      "We implement industry-standard security practices to protect your personal information from unauthorized access, alteration, disclosure, or misuse.",
  },
  {
    icon: <FaCookieBite />,
    title: "Cookies",
    content:
      "Our website may use cookies to improve your browsing experience, remember your preferences, and analyze website traffic. You can disable cookies through your browser settings.",
  },
];

const PrivacyPolicy = () => {
  return (
    <section className="relative overflow-hidden bg-[#FFF8F0] py-20">

      {/* Background */}

      <div className="absolute -top-40 left-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40"></div>

      <div className="relative max-w-6xl mx-auto px-5 lg:px-8">

        {/* Hero */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            Legal Information
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6">
            Privacy Policy
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-8">
            At First Track Skills Academy, your privacy is important to us.
            This policy explains how we collect, use, store, and protect
            your personal information.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 bg-white shadow rounded-full px-5 py-3">

            <FaCheckCircle className="text-green-500" />

          </div>

        </div>

        {/* Content */}

        <div className="grid lg:grid-cols-3 gap-8 mt-16">

          {/* Left */}

          <div className="lg:col-span-2 space-y-8">

            {sections.map((item, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition"
              >

                <div className="flex items-center gap-4 mb-6">

                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl text-orange-500">

                    {item.icon}

                  </div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    {item.title}
                  </h2>

                </div>

                {item.content && (

                  <p className="text-gray-600 leading-8">
                    {item.content}
                  </p>

                )}

                {item.list && (

                  <ul className="space-y-4">

                    {item.list.map((point, i) => (

                      <li
                        key={i}
                        className="flex items-start gap-3"
                      >

                        <FaCheckCircle className="text-orange-500 mt-1" />

                        <span className="text-gray-600">
                          {point}
                        </span>

                      </li>

                    ))}

                  </ul>

                )}

              </div>

            ))}

          </div>

          {/* Right Card */}

          <div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white sticky top-24 shadow-2xl">

              <FaEnvelope className="text-5xl mb-6" />

              <h3 className="text-2xl font-bold">
                Need Assistance?
              </h3>

              <p className="mt-4 text-orange-100 leading-8">
                If you have any questions regarding this Privacy Policy or
                how we handle your information, feel free to contact us.
              </p>

              <div className="mt-8 space-y-3">

                <p>
                  📧 info@firsttrackskills.com
                </p>

                <p>
                  📞 +91 9876543210
                </p>

                <p>
                  📍 Bhubaneswar, Odisha
                </p>

              </div>

              <button className="mt-8 w-full bg-white text-orange-600 font-semibold py-3 rounded-xl hover:bg-orange-50 transition">
                Contact Us
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default PrivacyPolicy;