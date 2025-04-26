import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";

const FaceRecognition = () => {
  // Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // State
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cloudinaryFaces, setCloudinaryFaces] = useState([]);
  const [labeledDescriptors, setLabeledDescriptors] = useState([]);
  const [recognizedFaces, setRecognizedFaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [lastLogged, setLastLogged] = useState({});

  // Constants
  const MIN_FACE_SIZE = 50;
  const MIN_ACCURACY = 60;
  const MAX_TRACKED_FACES = 10;
  const FACE_TIMEOUT = 3000; // 3 seconds

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading models:", err);
        setError("Failed to load face detection models.");
        setIsLoading(false);
      }
    };
    loadModels();
  }, []);

  // Fetch face data
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

  // Process descriptors
  useEffect(() => {
    if (!modelsLoaded || cloudinaryFaces.length === 0) return;

    const processDescriptors = async () => {
      try {
        const processed = await Promise.all(
          cloudinaryFaces.map(async (face) => {
            try {
              const name = face.public_id.split("/")[1].split("-")[0];
              const userId = face.asset_folder;
              setUserId(userId);

              const img = await faceapi.fetchImage(face.secure_url);
              const detections = await faceapi
                .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();

              return detections.length > 0
                ? new faceapi.LabeledFaceDescriptors(
                    name,
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

  // Log detection
  const logDetection = async (match, detection, accuracy) => {
    const matchedFace = cloudinaryFaces.find((face) => {
      const name = face.public_id.split("/")[1].split("-")[0];
      return name === match.label;
    });

    if (matchedFace) {
      const logData = {
        timestamp: new Date().toISOString(),
        userId: userId,
        matchedFace: {
          public_id: matchedFace.public_id,
          secure_url: matchedFace.secure_url,
          asset_id: matchedFace.asset_id,
          name: match.label,
        },
        detection: {
          accuracy: accuracy.toFixed(1),
          box: detection.detection.box,
          landmarks: detection.landmarks,
        },
      };
      console.log("Detection logged:", logData);
    }
  };

  // Draw face box helper
  const drawFaceBox = (ctx, box, label, accuracy, color) => {
    const width = box.width * 1.1;
    const height = width * 1.1;
    const x = box.x - (width - box.width) / 2;
    const y = box.y - (height - box.height) / 2;

    // Draw box
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 10);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw label
    const text = `${label} (${accuracy}%)`;
    ctx.font = "bold 14px Arial";
    const textWidth = ctx.measureText(text).width;

    // Label background
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y + height + 2, textWidth + 16, 24, [0, 0, 10, 10]);
    ctx.fill();

    // Label text
    ctx.fillStyle = "#000000";
    ctx.fillText(text, x + 8, y + height + 18);
  };

  // Draw detections
  const drawDetections = useCallback((detections, matches) => {
    const ctx = canvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    detections.forEach((detection, i) => {
      const match = matches[i] || { label: "Unknown", distance: 1 };
      const box = detection.detection.box;
      const accuracy = ((1 - match.distance) * 100).toFixed(1);
      const color = match.label !== "Unknown" ? "#00FF00" : "#FF0000";

      drawFaceBox(ctx, box, match.label, accuracy, color);
    });
  }, []);

  // Main detection function
  const detectFaces = useCallback(async () => {
    if (!webcamRef.current || !modelsLoaded || labeledDescriptors.length === 0)
      return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    if (canvasRef.current.width !== video.videoWidth) {
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;
    }

    try {
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

      const validDetections = detections.filter((det) => {
        const box = det.detection.box;
        return box.width > MIN_FACE_SIZE && box.height > MIN_FACE_SIZE;
      });

      if (validDetections.length > 0) {
        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
        const newMatches = validDetections.map((detection) =>
          faceMatcher.findBestMatch(detection.descriptor)
        );

        const now = Date.now();
        const updatedRecognizedFaces = [...recognizedFaces];

        newMatches.forEach((match, index) => {
          const accuracy = (1 - match.distance) * 100;
          if (accuracy > MIN_ACCURACY && match.label !== "Unknown") {
            const faceId = `${match.label}-${now}`;

            updatedRecognizedFaces.push({
              id: faceId,
              label: match.label,
              accuracy,
              timestamp: now,
              color: "#00FF00",
            });

            if (!lastLogged[match.label] || now - lastLogged[match.label] > 0) {
              logDetection(match, validDetections[index], accuracy);
              setLastLogged((prev) => ({ ...prev, [match.label]: now }));
            }
          }
        });

        // Filter and limit faces
        const filteredFaces = updatedRecognizedFaces
          .filter(
            (face, index, self) =>
              index === self.findIndex((f) => f.label === face.label)
          )
          .slice(0, MAX_TRACKED_FACES);

        setRecognizedFaces(filteredFaces);
        drawDetections(validDetections, newMatches);
      } else {
        // Clear canvas when no faces detected
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    } catch (err) {
      console.error("Detection error:", err);
    }
  }, [
    modelsLoaded,
    labeledDescriptors,
    recognizedFaces,
    lastLogged,
    drawDetections,
  ]);

  // Detection loop
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

  return (
    <div className="h-screen w-screen flex flex-col p-4 md:p-8 bg-gray-100">
      <div className="flex items-center justify-between">
        <div className="text-green-600 font-bold font-tektur text-xl ">
          SESSION IN PROGRESS...
        </div>
        <div className="text-gray-900 ">
          <h1 className=" font-tektur  font-semibold">
            Knowledge Based System
          </h1>
          <span className="flex gap-3 text-indigo-500">
            {" "}
            <span>
              <span className="font-semibold font-tektur">STARTED:</span> 8:16AM
            </span>
            <span>
              {" "}
              <span className="font-semibold font-tektur">lECTURER:</span>
              Jobfull
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

          <div className="mt-4 bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-lg mb-2 text-blue-900">
              Students Marked
            </h2>
            {recognizedFaces.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {recognizedFaces.map((face) => (
                  <div
                    key={face.id}
                    className="flex items-center p-2 bg-green-50 rounded"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium text-gray-700">
                      {face.label}
                    </span>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(face.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700">No faces detected yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FaceRecognition;
