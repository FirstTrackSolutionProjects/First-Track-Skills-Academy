import React from "react";
import { FaBriefcase, FaExternalLinkAlt } from "react-icons/fa";

const Career = () => {
  return (
    <div className="pt-24 min-h-screen bg-[#FFF8F0] flex flex-col">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-10 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <FaBriefcase /> Career Opportunities
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Work & Partner With Us
            </h1>
            <p className="text-orange-100 text-sm sm:text-base mt-2 max-w-2xl">
              Explore instructor roles, internship opportunities, and corporate training partnerships with First Track Skills Academy.
            </p>
          </div>
          <a
            href="https://firsttracksolutiontechnologies.com/career"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-full font-bold text-sm shadow-md transition hover:scale-105 shrink-0"
          >
            Open in Full Tab <FaExternalLinkAlt size={12} />
          </a>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100 h-[80vh]">
          <iframe
            src="https://firsttracksolutiontechnologies.com/career"
            title="First Track Career Portal"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default Career;