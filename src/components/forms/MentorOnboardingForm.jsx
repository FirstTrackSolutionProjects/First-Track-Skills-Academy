import React, { useState } from 'react';
import FormInput from './FormInput';

const MentorOnboardingForm = () => {
  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    subjects: [],
  });

  const [currentSubject, setCurrentSubject] = useState('');

  const handleAddSubject = (e) => {
    e?.preventDefault();
    const trimmed = currentSubject.trim();
    if (!trimmed || form.subjects.includes(trimmed)) return;

    setForm((prev) => ({
      ...prev,
      subjects: [...prev.subjects, trimmed],
    }));
    setCurrentSubject('');
  };

  const handleKeyDownSubject = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubject();
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((subject) => subject !== subjectToRemove),
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted data:', form);
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-50 px-4 pb-12 pt-28 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Mentor Onboarding
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Fill in the details below to create your mentor profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput
              label="First Name"
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Middle Name"
              type="text"
              name="middle_name"
              value={form.middle_name}
              onChange={handleChange}
            />
            <FormInput
              label="Last Name"
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Confirm Password"
              type="password"
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="w-full">
                <FormInput
                  label="Add Subjects"
                  type="text"
                  name="current_subject"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  onKeyDown={handleKeyDownSubject}
                  placeholder="e.g. Mathematics, Science"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSubject}
                className="h-11 w-full sm:w-auto px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shrink-0"
              >
                Add
              </button>
            </div>

            {form.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {form.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 animate-fadeIn"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(subject)}
                      className="hover:text-indigo-900 hover:bg-indigo-200/60 rounded-full p-0.5 transition-colors focus:outline-none"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
            >
              Complete Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorOnboardingForm;
