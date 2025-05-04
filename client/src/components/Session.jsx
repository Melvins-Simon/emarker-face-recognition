import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";
import { StopCircle } from "lucide-react";
import { useGlobalstore } from "../store/Globalstore";
import { Link } from "react-router-dom";
import formattedDate from "../utils/date.js";

const FaceRecognition = () => {
  const requestCooldown = useRef(new Map());
  const { user, mark_attendance } = useGlobalstore();

  // Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // State
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cloudinaryFaces, setCloudinaryFaces] = useState([]);
  const [labeledDescriptors, setLabeledDescriptors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track students
  const [detectedStudents, setDetectedStudents] = useState(new Map());
  const [markedStudents, setMarkedStudents] = useState(new Set());

  // Configuration
  const MIN_FACE_SIZE = 50;
  const MIN_ACCURACY = 60;
  const DETECTION_COOLDOWN = 5000; // 5 seconds
  const courseID = localStorage.getItem("courseuid") || "";

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        // Verify models are actually loaded
        if (!faceapi.nets.tinyFaceDetector.params) {
          throw new Error("TinyFaceDetector failed to load");
        }

        setModelsLoaded(true);
      } catch (err) {
        console.error("Model loading error:", err);
        setError(`Model loading failed: ${err.message}`);
        setIsLoading(false);
      }
    };
    loadModels();
  }, []);

  // Fetch face data from backend
  useEffect(() => {
    if (!modelsLoaded) return;

    const fetchFaces = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/faces");
        setCloudinaryFaces(res.data);
      } catch (err) {
        console.error("Error fetching faces:", err);
        setError("Failed to load face dataset.");
        setIsLoading(false);
      }
    };
    fetchFaces();
  }, [modelsLoaded]);

  // Process face descriptors
  useEffect(() => {
    if (!modelsLoaded || cloudinaryFaces.length === 0) return;

    const processDescriptors = async () => {
      try {
        const processed = await Promise.all(
          cloudinaryFaces.map(async (face) => {
            try {
              const img = await faceapi.fetchImage(face.secure_url);
              const detections = await faceapi
                .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();

              return detections.length > 0
                ? new faceapi.LabeledFaceDescriptors(
                    face.public_id,
                    detections.map((d) => d.descriptor)
                  )
                : null;
            } catch (e) {
              console.warn(`Failed to process image ${face.asset_id}:`, e);
              return null;
            }
          })
        );
        setLabeledDescriptors(processed.filter(Boolean));
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing descriptors:", error);
        setError("Failed to process face data.");
        setIsLoading(false);
      }
    };

    processDescriptors();
  }, [cloudinaryFaces, modelsLoaded]);

  // Validated mark attendance function
  const markAttendance = useCallback(
    async (studentId) => {
      if (!courseID || !studentId) {
        console.error("Invalid attendance data:", { courseID, studentId });
        return false;
      }

      try {
        console.log(
          "Marking attendance for:",
          studentId,
          "in course:",
          courseID
        );
        const response = await axios.post(
          import.meta.env.MODE === "development"
            ? "http://localhost:5000/api/mark-attendance"
            : "https://ms-emarker-euhcbzb9gbf7ejgs.centralus-01.azurewebsites.net/api/mark-attendance",
          {
            courseId: courseID,
            studentId,
          }
        );

        if (response.data.success) {
          setMarkedStudents((prev) => new Set(prev).add(studentId));
          return true;
        }
        return false;
      } catch (err) {
        console.error("Attendance error:", err.response?.data || err.message);
        return false;
      }
    },
    [courseID]
  );
  // Draw face boxes on canvas
  const drawFaceBoxes = useCallback(
    (detections, matches) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !webcamRef.current?.video) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw each detection
      detections.forEach((detection, i) => {
        const match = matches[i] || { label: "Unknown", distance: 1 };
        const box = detection.detection.box;
        const accuracy = ((1 - match.distance) * 100).toFixed(1);

        if (match.label !== "Unknown") {
          const studentId = match.label.split("/")[1].split("-")[1];
          const isMarked = markedStudents.has(studentId);

          // Draw face box
          ctx.beginPath();
          ctx.roundRect(box.x, box.y, box.width, box.height, 10);
          ctx.strokeStyle = isMarked ? "#00FF00" : "#FFFF00";
          ctx.lineWidth = 3;
          ctx.stroke();

          // Draw label
          const name = match.label.split("/")[1].split("-")[0];
          const statusText = isMarked ? "PRESENT" : "MARKED";
          const text = `${name} (${accuracy}%) - ${statusText}`;
          ctx.font = "bold 14px Arial";
          const textWidth = ctx.measureText(text).width;

          // Label background
          ctx.fillStyle = isMarked ? "#00FF00" : "#FFFF00";
          ctx.beginPath();
          ctx.roundRect(
            box.x,
            box.y + box.height + 2,
            textWidth + 16,
            24,
            [0, 0, 10, 10]
          );
          ctx.fill();

          // Label text
          ctx.fillStyle = "#000000";
          ctx.fillText(text, box.x + 8, box.y + box.height + 18);
        }
      });
    },
    [markedStudents]
  );

  // Main face detection function
  const detectFaces = useCallback(async () => {
    // Early returns for missing dependencies
    if (
      !webcamRef.current?.video ||
      !modelsLoaded ||
      labeledDescriptors.length === 0
    )
      return;

    const { video } = webcamRef.current;
    if (video.readyState !== 4) return;

    // Canvas setup
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (
      canvas.width !== video.videoWidth ||
      canvas.height !== video.videoHeight
    ) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    try {
      // Face detection with optimized options
      const detections = await faceapi
        .detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

      // Validate and filter detections
      const validDetections = detections.filter((det) => {
        const box = det.detection?.box;
        return (
          box?.width > MIN_FACE_SIZE &&
          box?.height > MIN_FACE_SIZE &&
          !isNaN(box.x) &&
          !isNaN(box.y)
        );
      });

      // Clear canvas if no valid faces
      if (validDetections.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (detectedStudents.size > 0) setDetectedStudents(new Map());
        return;
      }

      // Face matching
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
      const matches = validDetections.map((det) =>
        faceMatcher.findBestMatch(det.descriptor)
      );

      // Draw face boxes
      drawFaceBoxes(validDetections, matches);

      // Attendance marking logic
      const now = Date.now();
      const newDetectedStudents = new Map(detectedStudents);
      let needsUpdate = false;

      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const accuracy = (1 - match.distance) * 100;

        if (accuracy > MIN_ACCURACY && match?.label?.includes("/")) {
          const studentId = match.label.split("/")[1].split("-")[1];
          const lastDetection = detectedStudents.get(studentId);

          if (
            !lastDetection ||
            now - lastDetection.timestamp > DETECTION_COOLDOWN
          ) {
            newDetectedStudents.set(studentId, {
              label: match.label,
              accuracy,
              timestamp: now,
              detectionBox: validDetections[i].detection.box,
            });
            needsUpdate = true;

            if (!markedStudents.has(studentId)) {
              await markAttendance(studentId);
            }
          }
        }
      }

      if (needsUpdate) setDetectedStudents(newDetectedStudents);
    } catch (err) {
      console.error("Detection error:", err);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [
    modelsLoaded,
    labeledDescriptors,
    detectedStudents,
    markedStudents,
    markAttendance,
    drawFaceBoxes,
    MIN_FACE_SIZE,
    MIN_ACCURACY,
    DETECTION_COOLDOWN,
  ]);

  // Start detection loop
  useEffect(() => {
    if (!modelsLoaded || labeledDescriptors.length === 0) return;

    let animationFrameId;
    const detectLoop = () => {
      detectFaces();
      animationFrameId = requestAnimationFrame(detectLoop);
    };
    animationFrameId = requestAnimationFrame(detectLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [modelsLoaded, labeledDescriptors, detectFaces]);

  // Convert detectedStudents map to array for rendering
  const recognizedFaces = Array.from(detectedStudents.entries()).map(
    ([studentId, data]) => ({
      id: `${studentId}-${data.timestamp}`,
      label: data.label,
      studentId,
      accuracy: data.accuracy,
      timestamp: data.timestamp,
    })
  );

  return (
    <div className="h-screen w-screen flex flex-col p-4 md:p-8 bg-gray-100">
      <div className="flex items-center justify-between">
        <div className="text-green-600 font-bold font-tektur text-xl">
          SESSION IN PROGRESS...
        </div>
        <Link
          to={`/dash/lecturer/${user?._id}`}
          className="text-white font-semibold flex text-sm justify-center items-center gap-3 cursor-pointer bg-gradient-to-br from-violet-600 to-red-600 py-1 px-3 hover:opacity-80 active:opacity-50 trans rounded-md"
        >
          End Session <StopCircle />
        </Link>
        <div className="text-gray-900">
          <h1 className="font-tektur font-semibold">
            {localStorage.getItem("courseuidc") || "Course"}
          </h1>
          <span className="flex gap-3 text-indigo-500">
            <span>
              <span className="font-semibold font-tektur">STARTED:</span>{" "}
              {formattedDate}
            </span>
            <span>
              <span className="font-semibold font-tektur">LECTURER:</span>
              {localStorage.getItem("user") || "Professor"}
            </span>
          </span>
        </div>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : isLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">
            Initializing the session, please wait...
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1 relative overflow-hidden">
            <div className="relative w-full h-full">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="rounded shadow-lg object-cover w-full h-full"
                videoConstraints={{
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                  facingMode: "user",
                  frameRate: 15,
                  aspectRatio: 16 / 9,
                }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FaceRecognition;
