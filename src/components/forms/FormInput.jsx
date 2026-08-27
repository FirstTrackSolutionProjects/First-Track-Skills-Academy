const FormInput = ({ label, className = "", ...props }) => {
  return (
    <label className="block">
      {label && <span className="block font-semibold mb-2">{label}</span>}
      <input
        {...props}
        className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
      />
    </label>
  );
};

export default FormInput;
