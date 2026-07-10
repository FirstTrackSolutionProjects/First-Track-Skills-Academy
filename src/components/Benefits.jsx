// import React from "react";
// import {
//   FaVideo,
//   FaBookOpen,
//   FaProjectDiagram,
//   FaCertificate,
//   FaBriefcase,
//   FaHeadset,
//   FaInfinity,
//   FaClipboardCheck,
// } from "react-icons/fa";

// const benefits = [
//   {
//     icon: <FaVideo />,
//     title: "Live Interactive Classes",
//     desc: "Attend instructor-led live sessions with real-time doubt solving.",
//   },
//   {
//     icon: <FaBookOpen />,
//     title: "Premium Study Material",
//     desc: "Get notes, recordings, PDFs and practice resources.",
//   },
//   {
//     icon: <FaProjectDiagram />,
//     title: "Real Industry Projects",
//     desc: "Build portfolio projects using real-world technologies.",
//   },
//   {
//     icon: <FaCertificate />,
//     title: "Industry Certification",
//     desc: "Receive certificates that strengthen your resume.",
//   },
//   {
//     icon: <FaBriefcase />,
//     title: "Placement Assistance",
//     desc: "Resume building, mock interviews and job referrals.",
//   },
//   {
//     icon: <FaHeadset />,
//     title: "24×7 Mentor Support",
//     desc: "Dedicated mentors to solve your learning doubts.",
//   },
//   {
//     icon: <FaInfinity />,
//     title: "Lifetime Access",
//     desc: "Watch classes and access resources anytime.",
//   },
//   {
//     icon: <FaClipboardCheck />,
//     title: "Assignments & Tests",
//     desc: "Weekly assignments with personalized feedback.",
//   },
// ];

// const Benefits = () => {
//   return (
//     <section className="py-24 bg-[#FFF8F0]">
//       <div className="max-w-7xl mx-auto px-6">

//         {/* Heading */}
//         <div className="text-center max-w-3xl mx-auto">

//           <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
//             Why Choose Us
//           </span>

//           <h2 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
//             Everything You Need
//             <span className="text-orange-500">
//               {" "}To Become Job Ready
//             </span>
//           </h2>

//           <p className="mt-6 text-gray-600 leading-8 text-lg">
//             Learn from experts, build real projects, earn certifications,
//             and receive complete placement support to launch your career.
//           </p>

//         </div>

//         {/* Cards */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

//           {benefits.map((item, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100 hover:shadow-2xl hover:-translate-y-3 transition duration-300"
//             >

//               <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 text-white flex items-center justify-center text-2xl">
//                 {item.icon}
//               </div>

//               <h3 className="mt-6 text-xl font-bold text-gray-900">
//                 {item.title}
//               </h3>

//               <p className="mt-4 text-gray-600 leading-7">
//                 {item.desc}
//               </p>

//             </div>
//           ))}

//         </div>

//         {/* Bottom Stats */}
//         <div className="mt-20 bg-white rounded-[32px] shadow-lg border border-orange-100 p-10">

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

//             <div>
//               <h3 className="text-4xl font-bold text-orange-500">
//                 10K+
//               </h3>
//               <p className="mt-2 text-gray-600">
//                 Students Trained
//               </p>
//             </div>

//             <div>
//               <h3 className="text-4xl font-bold text-orange-500">
//                 120+
//               </h3>
//               <p className="mt-2 text-gray-600">
//                 Courses
//               </p>
//             </div>

//             <div>
//               <h3 className="text-4xl font-bold text-orange-500">
//                 95%
//               </h3>
//               <p className="mt-2 text-gray-600">
//                 Placement Rate
//               </p>
//             </div>

//             <div>
//               <h3 className="text-4xl font-bold text-orange-500">
//                 15+
//               </h3>
//               <p className="mt-2 text-gray-600">
//                 Years Experience
//               </p>
//             </div>

//           </div>

//         </div>

//       </div>
//     </section>
//   );
// };

// export default Benefits;

import React from "react";
import {
  FaVideo,
  FaClipboardCheck,
  FaRobot,
  FaFileAlt,
  FaBriefcase,
} from "react-icons/fa";

const benefits = [
  {
    number: "01",
    icon: <FaVideo />,
    title: "Live & Recorded Sessions",
    description:
      "Attend interactive live classes and access recorded sessions anytime for revision and self-paced learning.",
  },
  {
    number: "02",
    icon: <FaClipboardCheck />,
    title: "Weekly Assignments & Assessments",
    description:
      "Strengthen your concepts through regular assignments, quizzes and practical coding exercises.",
  },
  {
    number: "03",
    icon: <FaRobot />,
    title: "AI-Powered Learning Tools",
    description:
      "Learn faster using AI-assisted tools for coding practice, interview preparation and doubt solving.",
  },
  {
    number: "04",
    icon: <FaFileAlt />,
    title: "Resume Building & Interview Prep",
    description:
      "Build an ATS-friendly resume, optimize your LinkedIn profile and prepare through mock interviews.",
  },
  {
    number: "05",
    icon: <FaBriefcase />,
    title: "Internship & Placement Support",
    description:
      "Get internship opportunities, placement assistance and career guidance from our expert mentors.",
  },
];

const Benefits = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            STUDENT BENEFITS
          </span>

          <h2 className="text-5xl font-bold text-gray-900 mt-6">
            What <span className="text-orange-500">Students Receive</span>
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 leading-8">
            Every First Track Skills Academy program is designed to make you
            industry-ready through practical learning, mentorship and complete
            career support.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item) => (
            <div
              key={item.number}
              className="relative bg-[#FFF8F0] rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute top-6 right-6 text-5xl font-bold text-orange-100">
                {item.number}
              </div>

              <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-3xl mb-6">
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

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-10 text-center text-white">
          <h3 className="text-3xl font-bold">
            Everything You Need to Become Job-Ready
          </h3>

          <p className="mt-4 max-w-3xl mx-auto text-orange-100 leading-8">
            From live classes and hands-on projects to interview preparation and
            placement assistance, we provide complete support throughout your
            learning journey.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Benefits;