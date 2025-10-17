import React, { useState, useRef, useEffect, useCallback } from 'react';
import { extractInfoFromImage } from '../services/geminiService';
import { BusinessCard } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';

interface ScanScreenProps {
  onScanComplete: (card: Omit<BusinessCard, 'id'>) => void;
  onCancel: () => void;
}

const Spinner: React.FC = () => (
  <div className="border-4 border-gray-600 border-t-kards-yellow rounded-full w-16 h-16 animate-spin"></div>
);

export const ScanScreen: React.FC<ScanScreenProps> = ({ onScanComplete, onCancel }) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraReady(true);
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);
  
  const processAndExtract = async (base64Image: string, imageDataUrl: string) => {
      try {
          const extractedInfo = await extractInfoFromImage(base64Image);
          onScanComplete({ ...extractedInfo, cardImage: imageDataUrl });
      } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred.");
          setIsLoading(false);
      }
  };

  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      setIsLoading(true);
      setError(null);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Apply pre-processing filters for better OCR
        context.filter = 'contrast(1.4) brightness(1.05)';
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.filter = 'none'; // Reset filter

        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const base64Image = imageDataUrl.split(',')[1];
        stopCamera();
        await processAndExtract(base64Image, imageDataUrl);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    stopCamera();

    const img = new Image();
    img.onload = async () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          // Apply pre-processing filters
          context.filter = 'contrast(1.4) brightness(1.05)';
          context.drawImage(img, 0, 0);
          context.filter = 'none';

          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
          const base64Image = imageDataUrl.split(',')[1];
          await processAndExtract(base64Image, imageDataUrl);
        }
      }
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      setError("Failed to load the uploaded image.");
      setIsLoading(false);
      URL.revokeObjectURL(img.src);
    }
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-white">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraReady && !error ? 'opacity-100' : 'opacity-0'}`}
        playsInline
        aria-hidden={!isCameraReady}
      />
      <canvas ref={canvasRef} className="hidden" />
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-between p-6">
        <div className={`w-full flex justify-between items-center transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            <h1 className="text-2xl font-bold text-shadow">Scan Card</h1>
            <button onClick={onCancel} className="p-2 bg-black/30 rounded-full">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
              <Spinner />
              <p className="text-kards-yellow">Extracting Info...</p>
          </div>
        ) : error ? (
            <div className="bg-gray-900/50 backdrop-blur-md border border-white/20 p-6 rounded-xl text-center max-w-sm animate-fade-in shadow-lg">
              <h3 className="text-xl font-bold text-red-400 mb-3">Scan Unsuccessful</h3>
              <p className="text-gray-200 mb-6 text-base">{error}</p>
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={onCancel}
                  className="px-8 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    startCamera();
                  }}
                  className="px-8 py-3 rounded-lg bg-kards-yellow text-black font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-200 text-center text-shadow max-w-xs">Position the business card within the frame and tap the shutter button.</p>
        )}

        <div className={`w-full flex justify-around items-center transition-opacity duration-300 ${isLoading || error ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
             <button
              onClick={handleUploadClick}
              disabled={isLoading}
              className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center disabled:opacity-50"
              aria-label="Upload an image"
            >
              <UploadIcon className="w-8 h-8"/>
            </button>

            <button
              onClick={handleCapture}
              disabled={!isCameraReady || isLoading}
              className="w-20 h-20 bg-white rounded-full border-4 border-black ring-4 ring-white ring-opacity-50 flex items-center justify-center disabled:opacity-50"
              aria-label="Capture card"
            />

            <div className="w-16 h-16"></div>{/* Spacer */}
        </div>
      </div>
    </div>
  );
};