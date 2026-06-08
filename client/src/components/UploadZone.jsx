import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import toast from 'react-hot-toast';

const UploadZone = ({ onUpload, selectedCrop, setSelectedCrop }) => {
  const { t } = useLanguage();
  const { playHoverSound } = useAudio();
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' or 'camera'
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(false);

  // Stop camera stream on unmount or mode switch
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [cameraStream]);

  // Start HTML5 Live Video Viewfinder
  const startCamera = async () => {
    playHoverSound();
    setActiveMode('camera');
    setPreview(null);
    setCameraError(false);

    try {
      // Prioritize rear camera (environment) for leaf close-ups
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera stream access failed:', err);
      setCameraError(true);
      toast.error('ካሜራ መክፈት አልተቻለም። እባክዎ ምስል መጫንን ይጠቀሙ።');
    }
  };

  // Capture frame from live video track using canvas
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Sync canvas dimensions with active video track
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw active frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to Blob & File object
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          const dataUrl = canvas.toDataURL('image/jpeg');
          
          setPreview(dataUrl);
          stopCamera();
          onUpload(file, dataUrl);
        }
      }, 'image/jpeg', 0.9);
      
    } catch (err) {
      toast.error('ፎቶ ማንሳት አልተቻለም።');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (file) => {
    if (!file) return;

    // Check 2MB file size guardrail
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('maxSizeWarn'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onUpload(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const resetUploader = () => {
    stopCamera();
    setPreview(null);
    setActiveMode('upload');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fadeIn">
      
      {/* 1. Step: Crop Selection Hub */}
      <div className="mb-6">
        <h3 className="text-zinc-800 dark:text-zinc-200 text-sm font-bold font-ethiopic mb-3">
          {t('stepSelectCrop')}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Maize Selection */}
          <button
            type="button"
            onMouseEnter={playHoverSound}
            onClick={() => {
              setSelectedCrop('maize');
              resetUploader();
            }}
            className={`p-3 rounded-xl border-2 transition-all duration-300 transform active:scale-95 ${
              selectedCrop === 'maize'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
            }`}
          >
            🌽 {t('cropMaize')}
          </button>

          {/* Wheat Selection */}
          <button
            type="button"
            onMouseEnter={playHoverSound}
            onClick={() => {
              setSelectedCrop('wheat');
              resetUploader();
            }}
            className={`p-3 rounded-xl border-2 transition-all duration-300 transform active:scale-95 ${
              selectedCrop === 'wheat'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
            }`}
          >
            🌾 {t('cropWheat')}
          </button>

          {/* Teff (Coming Soon Overlay Badge) */}
          <div className="relative group cursor-not-allowed">
            <button
              type="button"
              disabled
              className="w-full p-3 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-600 opacity-60 flex flex-col items-center justify-center h-full text-center"
            >
              🌱 {t('cropTeff')}
            </button>
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md font-ethiopic">
              {t('comingSoon')}
            </span>
          </div>
        </div>
      </div>

      {/* Mode Navigation tabs (Upload Image vs Live Camera) */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 font-ethiopic text-xs">
        <button
          type="button"
          onClick={() => {
            resetUploader();
            setActiveMode('upload');
          }}
          onMouseEnter={playHoverSound}
          className={`flex-1 py-3 text-center font-bold border-b-2 transition-all duration-300 ${
            activeMode === 'upload'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          📁 ምስል ስቀል (Upload Image)
        </button>
        <button
          type="button"
          onClick={startCamera}
          className={`flex-1 py-3 text-center font-bold border-b-2 transition-all duration-300 ${
            activeMode === 'camera'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          📷 በቀጥታ ካሜራ (Live Camera)
        </button>
      </div>

      {/* 2. Step Workspace: Upload mode / Camera mode */}
      <div className="min-h-64 flex flex-col justify-center">
        
        {/* A. FILE UPLOAD MODE */}
        {activeMode === 'upload' && !preview && (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            onMouseEnter={playHoverSound}
            className={`flex flex-col items-center justify-center p-8 border-3 border-dashed rounded-3xl transition-all duration-300 cursor-pointer ${
              dragActive
                ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/10'
                : 'border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-zinc-400 dark:hover:border-zinc-700'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <p className="text-zinc-700 dark:text-zinc-300 font-bold font-ethiopic text-sm mb-1">
              {t('dragDropText')}
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold">
              PNG, JPG, JPEG (Max 2MB)
            </p>
          </div>
        )}

        {/* B. LIVE WEB CAMERA STREAM MODE */}
        {activeMode === 'camera' && !preview && !cameraError && (
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center border-2 border-zinc-200 dark:border-zinc-800 shadow-md">
            
            {/* Real-time Video viewfinder */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Target leaf scanning bracket boundary overlays */}
            <div className="absolute inset-8 border-2 border-dashed border-emerald-400/60 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="text-[10px] text-emerald-300 font-extrabold font-ethiopic tracking-wider bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                ቅጠሉን እዚህ ሳጥን ውስጥ ያስገቡ
              </div>
            </div>

            {/* Control Panel: Shutter Click Button */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
              {/* Back to upload */}
              <button
                type="button"
                onClick={resetUploader}
                className="p-3 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors border border-white/20"
                title="ተመለስ"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Shutter Capture button */}
              <button
                type="button"
                onClick={capturePhoto}
                className="w-16 h-16 bg-white rounded-full border-4 border-emerald-600 flex items-center justify-center transform hover:scale-105 active:scale-95 transition-transform"
                title="ፎቶ አንሳ (Shutter)"
              >
                <div className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors"></div>
              </button>
            </div>
          </div>
        )}

        {/* Camera stream error handling container */}
        {activeMode === 'camera' && cameraError && (
          <div className="text-center p-8 border-2 border-dashed border-red-200 dark:border-red-900 rounded-3xl bg-red-50/50 dark:bg-red-950/5 space-y-4">
            <span className="text-4xl">⚠️</span>
            <h4 className="text-sm font-bold text-red-800 dark:text-red-400 font-ethiopic">የካሜራ መዳረሻ ስህተት</h4>
            <p className="text-xs text-zinc-500 font-medium font-ethiopic leading-relaxed max-w-xs mx-auto">
              እባክዎ በአሳሽዎ ውስጥ የካሜራ ፈቃድ መፍቀድዎን ያረጋግጡ ወይም ምስል ስቀል የሚለውን አማራጭ ይጠቀሙ።
            </p>
            <button
              type="button"
              onClick={() => setActiveMode('upload')}
              className="px-4 py-2 bg-zinc-800 text-white font-bold font-ethiopic text-xs rounded-xl"
            >
              ወደ ምስል መጫኛ ተመለስ
            </button>
          </div>
        )}

        {/* C. IMAGE PREVIEW PANEL (Common to both modes after capture/selection) */}
        {preview && (
          <div className="relative w-full max-h-64 rounded-3xl overflow-hidden shadow-md animate-fadeIn aspect-video border-2 border-zinc-200 dark:border-zinc-800">
            <img src={preview} alt="Leaf Preview" className="w-full h-full object-cover" />
            <button
              onClick={resetUploader}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
              title="Reset"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

      </div>

      {/* Hidden Canvas reference for captures */}
      <canvas ref={canvasRef} className="hidden" />

    </div>
  );
};

export default UploadZone;
