import React from "react";
import {
  FaUndo,
  FaTimesCircle,
  FaMoneyCheckAlt,
  FaClock,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";

const refundSections = [
  {
    icon: <FaTimesCircle />,
    title: "Cancellation Policy",
    content:
      "Students can request cancellation before the course begins by contacting our support team. Cancellation requests will be reviewed according to our terms and course status.",
  },
  {
    icon: <FaMoneyCheckAlt />,
    title: "Refund Policy",
    list: [
      "Refund requests are reviewed individually.",
      "Approved refunds are processed within 7–10 working days.",
      "No refund will be provided after extensive course access or completion of major course modules.",
      "Registration fees and administrative charges may not be refundable.",
    ],
  },
  {
    icon: <FaClock />,
    title: "Refund Processing Time",
    content:
      "Once a refund request is approved, the amount will be transferred through the original payment method. Processing time may vary depending on the payment provider.",
  },
];

const RefundCancel = () => {
  return (
    <section className="relative overflow-hidden bg-[#FFF8F0] py-20">

      {/* Background */}

      <div className="absolute -top-40 left-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40"></div>


      <div className="relative max-w-6xl mx-auto px-5 lg:px-8">


        {/* Header */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            Policy Information
          </span>


          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6">

            Refund & Cancellation
            <span className="text-orange-500">
              {" "}Policy
            </span>

          </h1>


          <p className="mt-6 text-lg text-gray-600 leading-8">

            We are committed to providing a transparent and smooth learning
            experience. Please review our refund and cancellation guidelines
            before enrolling in any program.

          </p>


          <div className="mt-6 inline-flex items-center gap-3 bg-white shadow-md rounded-full px-6 py-3">

            <FaCheckCircle className="text-green-500" />

            <span className="font-medium text-gray-700">
              Transparent Payment Policy
            </span>

          </div>


        </div>



        {/* Main Content */}

        <div className="grid lg:grid-cols-3 gap-8 mt-16">


          {/* Policy Cards */}

          <div className="lg:col-span-2 space-y-8">


            {refundSections.map((item, index) => (

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



          {/* Contact Card */}

          <div>


            <div className="sticky top-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl">


              <FaUndo className="text-5xl mb-6" />


              <h3 className="text-2xl font-bold">

                Need Help?

              </h3>


              <p className="mt-4 text-orange-100 leading-8">

                If you have any questions regarding cancellation,
                payments, or refunds, our support team is always ready
                to assist you.

              </p>



              <div className="mt-8 space-y-4">


                <div className="flex gap-3 items-center">

                  <FaEnvelope />

                  <span>
                    info@firsttrackskills.com
                  </span>

                </div>



                <div className="flex gap-3 items-center">

                  <span>
                    📞 +91 9876543210
                  </span>

                </div>



                <div className="flex gap-3 items-center">

                  <span>
                    📍 Bhubaneswar, Odisha
                  </span>

                </div>


              </div>



              <button
                className="mt-8 w-full bg-white text-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-50 transition"
              >

                Contact Support

              </button>



            </div>


          </div>


        </div>



      </div>


    </section>
  );
};

export default RefundCancel;