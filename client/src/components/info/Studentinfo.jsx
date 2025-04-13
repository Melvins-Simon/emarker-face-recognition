import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import toTitleCase from "../../hooks/to_title";
import { ArrowRight, Loader } from "lucide-react";
import { useGlobalstore } from "../../store/Globalstore";
import { useAuthstore } from "../../store/Authstore";
import { useNavigate } from "react-router-dom";

const text = [
  {
    label:
      "📷 Face the camera directly and move your head slowly sideways ↔️ and up and down ↕️.",
  },
  { label: "💡 Ensure good lighting to illuminate your face evenly." },
  {
    label:
      "🧢 Remove hats, sunglasses 🕶️, or anything that may block facial features.",
  },
  { label: "🙂 Maintain a neutral expression or a slight smile." },
  { label: "🛑 Stay still for a moment until the webcam stops capturing." },
];

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const Studentinfo = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const { upload_image, isLoading } = useGlobalstore();
  const { user } = useAuthstore();
  const [capturing, setCapturing] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [frames, setFrames] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const startWebcam = () => {
    setWebcamActive(true);
    setCapturedFrames([]);
    setShowPreview(false);
  };

  const uploadToBackend = async (frames) => {
    try {
      const response = await upload_image(
        frames,
        toTitleCase(user?.username),
        user?.email
      );
      navigate(`/dash/student/${response._id}`);
    } catch (error) {}
  };

  const captureAndUploadFrames = useCallback(async () => {
    if (!webcamRef.current) return;
    const context = canvasRef.current.getContext("2d");
    const video = webcamRef.current.video;
    const { videoWidth: width, videoHeight: height } = video;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    setCapturing(true);
    const tempFrames = [];

    for (let i = 0; i < 20; i++) {
      context.drawImage(video, 0, 0, width, height);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg", 1);
      tempFrames.push(dataUrl);
      setCapturedFrames((prev) => [...prev.slice(-19), dataUrl]);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setFrames(tempFrames);
    setShowPreview(true);
    setCapturing(false);
    setWebcamActive(false);
  }, []);

  return (
    <div
      className={`relative lg:w-[70%] md:w-[90%]  md:h-[80%] h-screen bg-blue-50 shadow-2xl rounded-2xl p-3 text-neutral-900 flex flex-col gap-3`}
    >
      <span className="font-semibold text-sm absolute top-0 right-0 left-0 mx-auto w-max">
        {`Welcome ${toTitleCase(localStorage.getItem("user"))}!`}
      </span>

      <div className="text-center max-md:text-2xl text-4xl font-extrabold font-tektur my-2 md:my-4">
        <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
          Now, time to let the system verify your face uniquely
        </span>
      </div>

      <div
        className={`w-full grid h-[90%] md:grid-cols-[60%_37%] max-sm:grid-rows-[55%_37%] gap-3 overflow-hidden`}
      >
        <div className="bg-green-600 h-full rounded-2xl relative overflow-hidden">
          {showPreview && capturedFrames.length > 0 ? (
            <img
              src={capturedFrames[0]}
              alt="Captured Preview"
              className="w-full h-full object-cover object-center"
            />
          ) : webcamActive ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <video
              src="https://res.cloudinary.com/dfyqn0c1t/video/upload/v1744364711/vid_train2_l5wg3d.mp4"
              muted
              autoPlay
              loop
              className="w-full h-full object-cover object-center"
            />
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className="absolute inset-0 bg-blue-600/30" />

          {webcamActive && (
            <button
              onClick={captureAndUploadFrames}
              disabled={capturing}
              className={`absolute top-0 right-0 left-0 mx-auto bg-blue-500 hover:bg-blue-600 active:bg-blue-300 transition py-2 w-max px-2 text-white cursor-pointer rounded-md font-tektur font-semibold ${
                capturing && "animate-pulse"
              }`}
            >
              {capturing
                ? `Capturing... ${capturedFrames.length}/20`
                : "Start Capture"}
            </button>
          )}
        </div>
        <div className="h-full p-4 rounded-l-2xl flex items-center justify-center flex-col md:gap-2 gap-1 bg-radial from-cyan-600/30 to-transparent">
          <div className="md:text-lg font-tektur font-semibold">
            Following these steps helps the system detect and register your face
            more accurately.
          </div>
          <ul className="list-disc h-max md:mt-4 flex flex-col md:space-y-3">
            {text.map(({ label }, index) => (
              <li key={index}>{label}</li>
            ))}
          </ul>
          <div className="mt-3 text-center w-full">
            <button
              disabled={webcamActive}
              onClick={startWebcam}
              className="bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 active:bg-blue-300 transition py-2 w-[80%] text-white cursor-pointer rounded-md font-tektur font-semibold"
            >
              Start Webcam
            </button>
          </div>
        </div>
      </div>

      {showPreview && (
        <div
          onClick={() => uploadToBackend(frames)}
          className={`absolute w-max px-2 py-2 rounded-md bg-blue-500 cursor-pointer flex bottom-[5%] right-[5%] font-semibold justify-center items-center text-white hover:bg-blue-600 transition active:bg-blue-300 ${
            isLoading && "animate-pulse"
          }`}
        >
          <span>
            {isLoading ? (
              <span className="flex justify-center items-center">
                Uploading images... <Loader className="size-5 animate-spin" />
              </span>
            ) : (
              <span className="flex justify-center items-center">
                Upload dataset <ArrowRight className="size-5 ml-1" />
              </span>
            )}
          </span>{" "}
        </div>
      )}
    </div>
  );
};

export default Studentinfo;
