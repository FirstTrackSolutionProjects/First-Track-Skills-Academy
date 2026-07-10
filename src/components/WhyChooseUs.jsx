// import React from "react";
// import {
//   FaUserTie,
//   FaLaptopCode,
//   FaProjectDiagram,
//   FaCertificate,
//   FaBriefcase,
//   FaHeadset,
//   FaArrowRight,
// } from "react-icons/fa";

// const reasons = [
//   {
//     icon: <FaUserTie />,
//     title: "Expert Trainers",
//     desc: "Learn from experienced professionals working in top IT companies and startups.",
//   },
//   {
//     icon: <FaLaptopCode />,
//     title: "Practical Learning",
//     desc: "Hands-on coding sessions with assignments and real implementation.",
//   },
//   {
//     icon: <FaProjectDiagram />,
//     title: "Live Projects",
//     desc: "Build portfolio-worthy projects used in the real industry.",
//   },
//   {
//     icon: <FaCertificate />,
//     title: "Industry Certificate",
//     desc: "Receive a recognized certificate after successful course completion.",
//   },
//   {
//     icon: <FaBriefcase />,
//     title: "Placement Assistance",
//     desc: "Resume preparation, mock interviews and job referrals.",
//   },
//   {
//     icon: <FaHeadset />,
//     title: "Lifetime Support",
//     desc: "Continue learning with mentor support even after course completion.",
//   },
// ];

// const WhyChooseUs = () => {
//   return (
//     <section className="py-24 bg-[#FFF8F0] overflow-hidden">

//       <div className="max-w-7xl mx-auto px-6">

//         {/* Heading */}

//         <div className="text-center mb-20">

//           <span className="inline-block px-5 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold">
//             WHY FIRST TRACK?
//           </span>

//           <h2 className="text-5xl font-bold text-gray-900 mt-6">
//             Your Success is
//             <span className="text-orange-500"> Our Mission</span>
//           </h2>

//           <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 leading-8">
//             We provide industry-focused training, practical experience,
//             career guidance and placement assistance to help students
//             become confident professionals.
//           </p>

//         </div>

//         {/* Top Section */}

//         <div className="grid lg:grid-cols-2 gap-14 items-center mb-20">

//           {/* Image */}

//           <div className="relative">

//             <img
//               src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
//               alt=""
//               className="rounded-[35px] shadow-2xl"
//             />

//             <div className="absolute -top-6 -left-6 bg-white rounded-3xl shadow-xl px-8 py-6">

//               <h3 className="text-4xl font-bold text-orange-500">
//                 10K+
//               </h3>

//               <p className="text-gray-500">
//                 Students Trained
//               </p>

//             </div>

//             <div className="absolute bottom-6 -right-6 bg-orange-500 text-white rounded-3xl shadow-xl px-8 py-6">

//               <h3 className="text-4xl font-bold">
//                 95%
//               </h3>

//               <p>
//                 Placement Rate
//               </p>

//             </div>

//           </div>

//           {/* Content */}

//           <div>

//             <h3 className="text-4xl font-bold text-gray-900 mb-6">
//               Learn Skills That Companies Actually Hire For
//             </h3>

//             <p className="text-gray-600 leading-8 mb-10 text-lg">
//               At First Track Skills Academy, we focus on practical
//               knowledge instead of just theory. Every student works on
//               live projects, receives mentor guidance and gains confidence
//               through interview preparation and placement support.
//             </p>

//             <div className="grid grid-cols-2 gap-6">

//               <div className="bg-white rounded-2xl p-6 shadow">

//                 <h4 className="text-4xl font-bold text-orange-500">
//                   50+
//                 </h4>

//                 <p className="text-gray-600 mt-2">
//                   Industry Mentors
//                 </p>

//               </div>

//               <div className="bg-white rounded-2xl p-6 shadow">

//                 <h4 className="text-4xl font-bold text-orange-500">
//                   100+
//                 </h4>

//                 <p className="text-gray-600 mt-2">
//                   Live Projects
//                 </p>

//               </div>

//             </div>

//             <button className="mt-10 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-semibold transition hover:scale-105">

//               Join Now

//               <FaArrowRight />

//             </button>

//           </div>

//         </div>

//         {/* Feature Cards */}

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

//           {reasons.map((item, index) => (

//             <div
//               key={index}
//               className="group bg-white rounded-[30px] p-8 shadow-lg hover:-translate-y-3 hover:shadow-2xl transition duration-500"
//             >

//               <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-3xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition">

//                 {item.icon}

//               </div>

//               <h3 className="text-2xl font-bold text-gray-900 mb-4">

//                 {item.title}

//               </h3>

//               <p className="text-gray-600 leading-7">

//                 {item.desc}

//               </p>

//             </div>

//           ))}

//         </div>

//       </div>

//     </section>
//   );
// };

// export default WhyChooseUs;

import React from "react";
import {
  FaLaptop,
  FaCertificate,
  FaProjectDiagram,
  FaRupeeSign,
  FaChalkboardTeacher,
  FaBriefcase,
} from "react-icons/fa";

const features = [
  {
    icon: <FaLaptop />,
    title: "Live Online Classes",
    description:
      "Interactive live sessions with expert mentors. Learn from anywhere with recorded class access.",
  },
  {
    icon: <FaCertificate />,
    title: "Recognized Certification",
    description:
      "Receive an industry-recognized certificate after successful course completion.",
  },
  {
    icon: <FaProjectDiagram />,
    title: "Practical Projects",
    description:
      "Work on real-world projects to build a strong portfolio and gain practical experience.",
  },
  {
    icon: <FaRupeeSign />,
    title: "Affordable Programs",
    description:
      "High-quality training at student-friendly fees with flexible payment options.",
  },
  {
    icon: <FaChalkboardTeacher />,
    title: "Industry Expert Trainers",
    description:
      "Learn directly from experienced professionals working in leading companies.",
  },
  {
    icon: <FaBriefcase />,
    title: "Placement Assistance",
    description:
      "Resume building, mock interviews, internship guidance and placement support.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            WHY CHOOSE US
          </span>

          <h2 className="text-5xl font-bold text-gray-900 mt-6">
            Why Partner with{" "}
            <span className="text-orange-500">
              First Track Skills Academy?
            </span>
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 leading-8">
            We provide industry-focused training, practical learning,
            certifications and career guidance to help students become
            job-ready professionals.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-orange-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-3xl mb-6">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-10 text-center text-white shadow-xl">
          <h3 className="text-3xl font-bold">
            Learn Today. Get Placed Tomorrow.
          </h3>

          <p className="mt-4 text-orange-100 max-w-3xl mx-auto leading-8">
            Join thousands of students who have transformed their careers
            through expert training, live projects, internships and dedicated
            placement support.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;