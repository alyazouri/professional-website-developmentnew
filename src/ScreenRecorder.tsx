import { useState, useRef, useEffect } from "react";
import { useLang } from "./LanguageContext";

export function ScreenRecorder() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const blobs: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          blobs.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        setRecordedBlobs(blobs);
        stream.getTracks().forEach((track) => track.stop());
      };
      
      mediaRecorder.start(1000);
      setIsRecording(true);
      
      // If there's a video element, set its source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
    } catch (err) {
      setError(isAr ? "حدث خطأ في بدء التسجيل" : "Error starting recording");
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (recordedBlobs.length > 0) {
      const blob = new Blob(recordedBlobs, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = isAr ? "تسجيل-الشاشة.webm" : "screen-recording.webm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const clearRecording = () => {
    setRecordedBlobs([]);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="card neon-box rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">🎥</span>
        <h3 className="font-display text-lg font-bold text-white">
          {isAr ? "مسجل الشاشة" : "Screen Recorder"}
        </h3>
      </div>
      <p className="mb-4 text-sm text-white/60">
        {isAr ? "سجل شاشتك بدون الحاجة لبرامج خارجي" : "Record your screen without any external software"}
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {!isRecording ? (
          <button onClick={startRecording} className="btn-primary flex-1 rounded-xl py-3">
            {isAr ? "ابدأ التسجيل" : "Start Recording"}
          </button>
        ) : (
          <button onClick={stopRecording} className="btn-primary flex-1 rounded-xl py-3">
            {isAr ? "ايقاف التسجيل" : "Stop Recording"}
          </button>
        )}

        {recordedBlobs.length > 0 && (
          <>
            <button onClick={downloadRecording} className="btn-ghost flex-1 rounded-xl py-3">
              {isAr ? "تحميل" : "Download"}
            </button>
            <button onClick={clearRecording} className="btn-ghost flex-1 rounded-xl py-3">
              {isAr ? "مسح" : "Clear"}
            </button>
          </>
        )}
      </div>

      {isRecording && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="font-semibold text-red-300">
              {isAr ? "جاري التسجيل..." : "Recording..."}
            </span>
          </div>
        </div>
      )}

      {recordedBlobs.length > 0 && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-300">✅</span>
            <span className="font-semibold text-emerald-300">
              {isAr ? "تم التسجيل بنجاح!" : "Recording saved!"}
            </span>
          </div>
          <video
            ref={videoRef}
            controls
            className="mt-3 w-full rounded-lg"
            autoPlay
            muted
          />
        </div>
      )}

      <div className="mt-4 text-xs text-white/40">
        {isAr ? "ملاحظة: قد لا تعمل هذه الميزة على جميع المتصفحات" : "Note: This feature may not work on all browsers"}
      </div>
    </div>
  );
}