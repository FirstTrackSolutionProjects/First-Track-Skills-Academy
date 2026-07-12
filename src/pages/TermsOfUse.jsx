import React from "react";
import {
  FaUserCheck,
  FaCopyright,
  FaBan,
  FaBookOpen,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";


const termsSections = [
  {
    icon: <FaUserCheck />,
    title: "Student Responsibilities",
    list: [
      "Attend classes regularly and participate actively.",
      "Respect trainers, mentors, and fellow students.",
      "Do not share paid course materials with unauthorized users.",
      "Complete assignments and projects honestly.",
      "Use our learning platform responsibly.",
    ],
  },

  {
    icon: <FaCopyright />,
    title: "Intellectual Property",
    content:
      "All course videos, study materials, assignments, designs, documents, and learning resources provided by First Track Skills Academy are protected intellectual property. Students are not allowed to copy, distribute, sell, or reproduce any paid content without permission.",
  },

  {
    icon: <FaBan />,
    title: "Account Suspension & Termination",
    content:
      "Violation of academy policies, misuse of learning resources, inappropriate behavior, or unauthorized sharing of content may result in suspension or termination of access to our services.",
  },

];


const TermsOfUse = () => {

  return (

    <section className="relative overflow-hidden bg-[#FFF8F0] py-20">


      {/* Background */}

      <div className="absolute -top-40 left-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40"></div>



      <div className="relative max-w-6xl mx-auto px-5 lg:px-8">


        {/* Header */}

        <div className="text-center max-w-3xl mx-auto">


          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">

            Legal Guidelines

          </span>



          <h1 className="text-4xl md:text-5xl font-bold mt-6 text-gray-900">

            Terms of
            <span className="text-orange-500">
              {" "}Use
            </span>

          </h1>



          <p className="mt-6 text-lg text-gray-600 leading-8">

            By accessing First Track Skills Academy services,
            you agree to follow these terms and conditions.
            These guidelines help us maintain a safe and effective
            learning environment for everyone.

          </p>



          <div className="mt-6 inline-flex items-center gap-3 bg-white shadow-md rounded-full px-6 py-3">

            <FaCheckCircle className="text-green-500"/>

            <span className="font-medium text-gray-700">

              Fair Learning Environment

            </span>

          </div>



        </div>




        {/* Content */}


        <div className="grid lg:grid-cols-3 gap-8 mt-16">


          {/* Left Content */}


          <div className="lg:col-span-2 space-y-8">


            {termsSections.map((item,index)=>(


              <div

                key={index}

                className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition"

              >



                <div className="flex items-center gap-5 mb-6">


                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 text-2xl">

                    {item.icon}

                  </div>



                  <h2 className="text-2xl font-bold text-gray-900">

                    {item.title}

                  </h2>


                </div>





                {item.list && (

                  <ul className="space-y-4">


                    {item.list.map((point,i)=>(


                      <li

                        key={i}

                        className="flex items-start gap-3"

                      >


                        <FaCheckCircle className="text-orange-500 mt-1"/>


                        <span className="text-gray-600">

                          {point}

                        </span>


                      </li>


                    ))}


                  </ul>


                )}






                {item.content && (

                  <p className="text-gray-600 leading-8">

                    {item.content}

                  </p>

                )}



              </div>


            ))}



            {/* Learning Rules */}


            <div className="bg-white rounded-3xl shadow-lg p-8">


              <div className="flex items-center gap-4 mb-5">


                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

                  <FaBookOpen className="text-orange-500 text-2xl"/>

                </div>


                <h2 className="text-2xl font-bold">

                  Learning Guidelines

                </h2>


              </div>



              <p className="text-gray-600 leading-8">

                Students are encouraged to maintain discipline,
                complete learning activities on time, ask questions,
                and make the best use of available resources.

              </p>


            </div>



          </div>





          {/* Sidebar */}


          <div>


            <div className="sticky top-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl">


              <FaEnvelope className="text-5xl mb-6"/>



              <h3 className="text-2xl font-bold">

                Need Help?

              </h3>



              <p className="mt-4 text-orange-100 leading-8">

                If you have questions about our terms,
                courses, or policies, our support team is
                available to assist you.

              </p>



              <div className="mt-8 space-y-4">


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




              <button className="mt-8 w-full bg-white text-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-50 transition">

                Contact Support

              </button>



            </div>


          </div>



        </div>


      </div>


    </section>

  );

};


export default TermsOfUse;