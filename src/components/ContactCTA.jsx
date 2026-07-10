// import React from "react";
// import {
//   FaArrowRight,
//   FaPhoneAlt,
//   FaEnvelope,
//   FaCalendarAlt,
// } from "react-icons/fa";

// const ContactCTA = () => {
//   return (
//     <section className="py-24 bg-[#FFF8F0]">
//       <div className="max-w-7xl mx-auto px-6">

//         <div className="bg-white rounded-[40px] shadow-2xl border border-orange-100 overflow-hidden">

//           <div className="grid lg:grid-cols-2">

//             {/* Left */}
//             <div className="p-10 lg:p-16 flex flex-col justify-center">

//               <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold w-fit">
//                 🚀 Admissions Open 2026
//               </span>

//               <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-8 leading-tight">
//                 Ready To Build
//                 <span className="text-orange-500">
//                   {" "}Your Dream Career?
//                 </span>
//               </h2>

//               <p className="text-gray-600 mt-6 leading-8 text-lg">
//                 Learn from industry professionals, work on live projects,
//                 earn certifications, and receive complete placement support
//                 to land your dream job.
//               </p>

//               <div className="flex flex-wrap gap-5 mt-10">

//                 <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-semibold transition">
//                   Enroll Now
//                   <FaArrowRight />
//                 </button>

//                 <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-xl font-semibold transition">
//                   View Courses
//                 </button>

//               </div>

//             </div>

//             {/* Right */}
//             <div className="bg-orange-500 p-10 lg:p-16 text-white flex flex-col justify-center">

//               <h3 className="text-3xl font-bold">
//                 Talk To Our Counselor
//               </h3>

//               <p className="mt-3 text-orange-100">
//                 We're here to help you choose the right course.
//               </p>

//               <div className="space-y-8 mt-10">

//                 <div className="flex items-center gap-5">

//                   <div className="w-14 h-14 rounded-2xl bg-white text-orange-500 flex items-center justify-center text-xl">
//                     <FaPhoneAlt />
//                   </div>

//                   <div>
//                     <p className="text-orange-100 text-sm">
//                       Call Us
//                     </p>

//                     <h4 className="text-xl font-semibold">
//                       +91 98765 43210
//                     </h4>
//                   </div>

//                 </div>

//                 <div className="flex items-center gap-5">

//                   <div className="w-14 h-14 rounded-2xl bg-white text-orange-500 flex items-center justify-center text-xl">
//                     <FaEnvelope />
//                   </div>

//                   <div>
//                     <p className="text-orange-100 text-sm">
//                       Email
//                     </p>

//                     <h4 className="text-xl font-semibold">
//                       info@firsttrackskills.com
//                     </h4>
//                   </div>

//                 </div>

//                 <div className="flex items-center gap-5">

//                   <div className="w-14 h-14 rounded-2xl bg-white text-orange-500 flex items-center justify-center text-xl">
//                     <FaCalendarAlt />
//                   </div>

//                   <div>
//                     <p className="text-orange-100 text-sm">
//                       Free Demo Class
//                     </p>

//                     <h4 className="text-xl font-semibold">
//                       Book Your Seat Today
//                     </h4>
//                   </div>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>
//     </section>
//   );
// };

// export default ContactCTA;

import React from "react";
import {
  FaWhatsapp,
  FaEnvelope,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";

const ContactCTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Image */}

          <div>

            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000"
              alt="Meeting"
              className="rounded-[30px] shadow-2xl w-full h-full object-cover"
            />

          </div>

          {/* Right Content */}

          <div>

            <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
              CONTACT US
            </span>

            <h2 className="text-5xl font-bold text-gray-900 mt-6 leading-tight">
              Let's Build
              <span className="text-orange-500"> Your Career Together</span>
            </h2>

            <p className="text-gray-600 mt-6 leading-8">
              Join First Track Skills Academy and learn from industry experts.
              Whether you're a student or a working professional, we're here to
              help you become job-ready with live classes, projects,
              certifications and placement support.
            </p>

            {/* Contact Cards */}

            <div className="grid sm:grid-cols-2 gap-5 mt-10">

              <div className="border rounded-2xl p-5 hover:border-orange-500 hover:shadow-lg transition">

                <FaWhatsapp className="text-3xl text-green-500 mb-3" />

                <h4 className="font-bold text-lg">
                  WhatsApp
                </h4>

                <p className="text-gray-600 mt-2">
                  +91 9040170727
                </p>

              </div>

              <div className="border rounded-2xl p-5 hover:border-orange-500 hover:shadow-lg transition">

                <FaEnvelope className="text-3xl text-orange-500 mb-3" />

                <h4 className="font-bold text-lg">
                  Email
                </h4>

                <p className="text-gray-600 mt-2 break-all">
                  info@firsttrackskills.com
                </p>

              </div>

              <div className="border rounded-2xl p-5 sm:col-span-2 hover:border-orange-500 hover:shadow-lg transition">

                <FaGlobe className="text-3xl text-blue-500 mb-3" />

                <h4 className="font-bold text-lg">
                  Website
                </h4>

                <p className="text-gray-600 mt-2">
                  www.firsttrackskills.com
                </p>

              </div>

            </div>

            {/* Quote */}

            <div className="mt-10 border-l-4 border-orange-500 pl-5 italic text-gray-600 leading-8">
              "Our mission is to transform learners into skilled professionals
              through quality education, practical experience and continuous
              career support."
            </div>

            {/* Button */}

            <button className="mt-10 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition hover:scale-105">

              Contact Now

              <FaArrowRight />

            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactCTA;

