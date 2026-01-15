import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 border-t border-gray-200 mt-20 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
        <p>© 2024 Playground. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span>Twitter</span>
          <span>GitHub</span>
          <span>LinkedIn</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;