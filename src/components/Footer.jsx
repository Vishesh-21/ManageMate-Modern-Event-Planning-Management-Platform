import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-800/50 py-8 px-6 max-w-7xl mx-auto">
      <div className="text-sm text-gray-400 text-center">
        &copy; {new Date().getFullYear()} Manage Mate Inc. | All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
