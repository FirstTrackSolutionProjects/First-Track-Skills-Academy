import React from "react";

const faqs = [
  {
    question: "Who can join the courses?",
    answer:
      "Anyone including students, freshers, working professionals and career switchers can join.",
  },
  {
    question: "Are classes live or recorded?",
    answer:
      "We provide live classes along with recorded sessions for revision.",
  },
  {
    question: "Will I get a certificate?",
    answer:
      "Yes, an industry-recognized certificate is provided after successful completion.",
  },
  {
    question: "Do you provide placement support?",
    answer:
      "Yes, we provide resume building, mock interviews and placement assistance.",
  },
  {
    question: "Can I pay the fees in installments?",
    answer:
      "Yes, flexible payment options are available for selected courses.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-16">

          <h1 className="text-5xl font-bold">
            Frequently Asked Questions
          </h1>

          <p className="text-gray-600 mt-6">
            Find answers to the most common questions.
          </p>

        </div>

        <div className="space-y-6">

          {faqs.map((item, index) => (

            <div
              key={index}
              className="bg-orange-50 rounded-2xl p-6 shadow"
            >

              <h3 className="text-xl font-bold text-orange-600">
                {item.question}
              </h3>

              <p className="mt-3 text-gray-600 leading-8">
                {item.answer}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default FAQ;