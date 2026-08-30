const AuthFormShell = ({ badge, title, subtitle, children }) => {
  return (
    <section className="bg-[#FFF8F0] px-4 pb-16 pt-28 sm:px-0 sm:py-28">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-10">
          <span className="bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            {badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-5">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-8 md:p-10">
          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthFormShell;
