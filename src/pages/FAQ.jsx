import React, { useState } from "react";
import {
  FaChevronDown,
  FaQuestionCircle,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";


const faqs = [
  {
    question: "Who can join the courses?",
    answer:
      "Anyone including students, freshers, working professionals and career switchers can join our programs. Our courses are designed for beginners as well as experienced learners.",
  },
  {
    question: "Are classes live or recorded?",
    answer:
      "We provide live instructor-led classes along with recorded sessions so students can revise concepts anytime.",
  },
  {
    question: "Will I get a certificate?",
    answer:
      "Yes, students receive an industry-recognized certificate after successfully completing the course and projects.",
  },
  {
    question: "Do you provide placement support?",
    answer:
      "Yes, we provide resume building, mock interviews, career guidance and placement assistance to help students achieve their goals.",
  },
  {
    question: "Can I pay the fees in installments?",
    answer:
      "Yes, flexible payment options are available for selected programs. Contact our team for more details.",
  },
  {
    question: "Do you provide practical projects?",
    answer:
      "Yes, students work on real-world projects to build practical skills and strengthen their portfolios.",
  },
];


const FAQ = () => {

  const [active, setActive] = useState(null);


  return (

    <section className="relative overflow-hidden py-24 bg-[#FFF8F0]">


      {/* Background */}

      <div className="absolute -top-40 left-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40"></div>



      <div className="relative max-w-6xl mx-auto px-5 lg:px-8">



        {/* Header */}

        <div className="text-center max-w-3xl mx-auto">


          <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">

            <FaQuestionCircle />

            FAQ

          </span>



          <h1 className="text-4xl md:text-5xl font-bold mt-6 text-gray-900">

            Frequently Asked
            <span className="text-orange-500">
              {" "}Questions
            </span>

          </h1>



          <p className="mt-5 text-lg text-gray-600 leading-8">

            Find answers to common questions about our courses,
            training programs, certification and placement support.

          </p>


        </div>





        {/* FAQ */}

        <div className="max-w-4xl mx-auto mt-14 space-y-5">


          {faqs.map((item,index)=>(


            <div

              key={index}

              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100"

            >



              <button

                onClick={()=>setActive(active===index ? null : index)}

                className="w-full flex items-center justify-between p-6 text-left"

              >


                <h3 className="text-lg md:text-xl font-bold text-gray-900">

                  {item.question}

                </h3>



                <div

                  className={`w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 transition-transform duration-300 ${
                    active===index ? "rotate-180" : ""
                  }`}

                >

                  <FaChevronDown />

                </div>



              </button>




              <div

                className={`grid transition-all duration-300 ${
                  active===index
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
                }`}

              >

                <div className="overflow-hidden">

                  <p className="px-6 pb-6 text-gray-600 leading-8">

                    {item.answer}

                  </p>

                </div>


              </div>



            </div>


          ))}


        </div>





        {/* Bottom CTA */}


        <div className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-10 text-white shadow-xl">


          <div className="flex flex-col md:flex-row items-center justify-between gap-8">


            <div>


              <h3 className="text-3xl font-bold">

                Still Have Questions?

              </h3>



              <p className="mt-3 text-orange-100 leading-7">

                Our support team is ready to help you choose
                the right course for your career.

              </p>



              <div className="flex items-center gap-3 mt-5">

                <FaCheckCircle />

                <span>
                  Expert Guidance Available
                </span>

              </div>


            </div>




            <button

              className="flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition"

            >

              <FaEnvelope />

              Contact Us

            </button>



          </div>


        </div>



      </div>


    </section>

  );

};


export default FAQ;