import React from "react";

const EMarkerAPIServer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4361ee] to-[#7209b7] text-[#f8f9fa] font-['Poppins'] transition-all duration-300">
      <div className="max-w-4xl mx-auto p-8 md:p-4">
        {/* Header */}
        <header className="text-center mb-12 py-6 px-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          <h1 className="text-4xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-[#c9d6ff] bg-clip-text text-transparent">
            EMarker API Server
          </h1>
          <p className="font-light opacity-90">
            Backend services powering the Face Recognition System
          </p>
        </header>

        {/* Authentication Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20 shadow-[0_4px_16px_0_rgba(31,38,135,0.2)]">
          <a
            href="https://emarker-face-recognition.vercel.app/"
            className="inline-block px-6 py-3 bg-white/20 rounded-lg text-white font-medium border border-white/30 mb-4 hover:bg-white/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            → Go to EMarker Frontend
          </a>

          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>🔐</span> Authentication Routes
          </h2>

          <Endpoint
            method="POST"
            path="/api/auth/signup"
            description="User registration endpoint"
            methodClass="bg-[#4cc9f0] text-[#212529]"
          />

          <Endpoint
            method="POST"
            path="/api/auth/signin"
            description="User login endpoint"
            methodClass="bg-[#4cc9f0] text-[#212529]"
          />

          <Endpoint
            method="POST"
            path="/api/auth/verify-email"
            description="Email verification"
            methodClass="bg-[#4cc9f0] text-[#212529]"
          />

          <Endpoint
            method="POST"
            path="/api/auth/forgot-password"
            description="Password reset request"
            methodClass="bg-[#4cc9f0] text-[#212529]"
          />

          <Endpoint
            method="POST"
            path="/api/auth/reset-password/:id"
            description="Complete password reset"
            methodClass="bg-[#4cc9f0] text-[#212529]"
          />

          <Endpoint
            method="POST"
            path="/api/auth/signout"
            description="User logout (JWT protected)"
            methodClass="bg-[#4cc9f0] text-[#212529]"
          />

          <Endpoint
            method="GET"
            path="/api/auth/check-auth"
            description="Verify authentication status (JWT protected)"
            methodClass="bg-[#4895ef] text-white"
          />

          <Endpoint
            method="DELETE"
            path="/api/auth/delete/user/:id"
            description="Delete user account (JWT protected)"
            methodClass="bg-[#f72585] text-white"
          />
        </div>

        {/* Dashboard Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20 shadow-[0_4px_16px_0_rgba(31,38,135,0.2)]">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>📊</span> Dashboard Routes
          </h2>

          <Endpoint
            method="GET"
            path="/api/dash/get-users"
            description="Get all users (JWT protected)"
            methodClass="bg-[#4895ef] text-white"
          />

          <Endpoint
            method="POST"
            path="/api/dash/add-course"
            description="Add new course (JWT protected)"
            methodClass="bg-[#4cc9f0] text-[#212529]"
          />

          <Endpoint
            method="GET"
            path="/api/lectures"
            description="Get all courses (JWT protected)"
            methodClass="bg-[#4895ef] text-white"
          />

          <Endpoint
            method="DELETE"
            path="/api/delete-course/:courseId"
            description="Delete course (JWT protected)"
            methodClass="bg-[#f72585] text-white"
          />

          <Endpoint
            method="POST"
            path="/api/mark-attendance"
            description="Mark student attendance (JWT protected)"
            methodClass="bg-[#4cc9f0] text-[#212529]"
          />
        </div>

        {/* Face Recognition Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20 shadow-[0_4px_16px_0_rgba(31,38,135,0.2)]">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>📸</span> Face Recognition Routes
          </h2>

          <Endpoint
            method="POST"
            path="/api/student/upload-face-dataset"
            description="Upload face dataset (JWT protected)"
            methodClass="bg-[#4cc9f0] text-[#212529]"
          />

          <Endpoint
            method="GET"
            path="/api/faces"
            description="Get all face images (JWT protected)"
            methodClass="bg-[#4895ef] text-white"
          />
        </div>
      </div>
    </div>
  );
};

const Endpoint = ({ method, path, description, methodClass }) => {
  return (
    <div className="bg-black/20 p-4 rounded-lg mb-4 cursor-pointer hover:bg-white/15 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center">
        <span
          className={`${methodClass} py-1 px-3 rounded-md font-semibold text-xs uppercase mr-3`}
        >
          {method}
        </span>
        <span className="font-medium">{path}</span>
      </div>
      <p className="mt-2 opacity-85 text-sm">{description}</p>
    </div>
  );
};

export default EMarkerAPIServer;
