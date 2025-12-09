import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkBase = "px-3 py-2 rounded-md text-sm font-medium";
  const activeClass = "bg-opacity-10 backdrop-blur text-white shadow-inner";

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex items-center justify-center h-16">
          <div className="flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "hover:bg-white/10"}`}
            >
              Home
            </NavLink>

            <NavLink
              to="/chat"
              className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "hover:bg-white/10"}`}
            >
              Chat
            </NavLink>

            <NavLink
              to="/sentiment"
              className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "hover:bg-white/10"}`}
            >
              Sentiment
            </NavLink>

            <NavLink
              to="/compare-pdfs"
              className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "hover:bg-white/10"}`}
            >
              Compare PDFs
            </NavLink>

            <NavLink
              to="/summarize-pdf"
              className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "hover:bg-white/10"}`}
            >
              Summarize PDF
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
