"use client";

import { useState, useCallback } from "react";
import DragDropZone from "@/components/DragDropZone";

interface Run {
  id: string;
  section: "target" | "obstacle";
  score: number;
  timestamp: string;
  videoUrl?: string;
  videoFile?: File;
  verified: boolean;
}

const initialRuns: Run[] = [
  { id: "run-001", section: "target", score: 2450, timestamp: "2024-01-31 14:32", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", verified: true },
  { id: "run-002", section: "obstacle", score: 1920, timestamp: "2024-01-31 13:15", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", verified: true },
  { id: "run-003", section: "target", score: 1840, timestamp: "2024-01-31 11:42", verified: false },
];

export default function RunsPage() {
  const [runs, setRuns] = useState<Run[]>(initialRuns);
  const [selected, setSelected] = useState<Run | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [section, setSection] = useState<"target" | "obstacle">("target");
  const [score, setScore] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const handleVideoFile = useCallback((file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  }, []);

  const handleAdd = () => {
    if (!score) return;
    const newRun: Run = {
      id: `run-${String(runs.length + 1).padStart(3, "0")}`,
      section,
      score: parseInt(score),
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      videoUrl: videoPreview || undefined,
      videoFile: videoFile || undefined,
      verified: false,
    };
    setRuns([newRun, ...runs]);
    setShowForm(false);
    setScore("");
    setVideoFile(null);
    setVideoPreview(null);
  };

  const getVideoSrc = (run: Run) => {
    if (run.videoFile) {
      return URL.createObjectURL(run.videoFile);
    }
    return run.videoUrl;
  };

  const isLocalVideo = (run: Run) => {
    return !!run.videoFile || (run.videoUrl && run.videoUrl.startsWith("blob:"));
  };

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-[#00ff00]/50 text-sm">{">"} RUN HISTORY</div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[#ffb000] text-sm hover:text-[#ffb000]/80"
        >
          [{showForm ? "CANCEL" : "+ ADD RUN"}]
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="terminal-box p-4 mb-4 text-sm">
          <div className="text-[#ffb000] mb-3">{">"} NEW RUN</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#00ff00]/50 text-xs block mb-1">SECTION</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as "target" | "obstacle")}
                className="w-full bg-black border border-[#00ff00]/30 p-2 text-[#00ff00]"
              >
                <option value="target">target</option>
                <option value="obstacle">obstacle</option>
              </select>
            </div>
            <div>
              <label className="text-[#00ff00]/50 text-xs block mb-1">SCORE</label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full bg-black border border-[#00ff00]/30 p-2 text-[#00ff00]"
                placeholder="0"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[#00ff00]/50 text-xs block mb-1">VIDEO FILE</label>
              <DragDropZone
                accept={["video/*"]}
                onFile={handleVideoFile}
                label="DROP VIDEO FILE"
                sublabel="or click to browse (.mp4, .mov, .webm)"
                preview={videoPreview}
                className="h-40"
              />
            </div>
            <div className="col-span-2">
              <button
                onClick={handleAdd}
                className="bg-[#00ff00]/20 border border-[#00ff00] px-4 py-2 text-[#00ff00] hover:bg-[#00ff00]/30"
              >
                [SUBMIT]
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Run List */}
        <div className="terminal-box p-4 h-[60vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#00ff00]/50 border-b border-[#00ff00]/20">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">TYPE</th>
                <th className="text-right py-2">SCORE</th>
                <th className="text-right py-2">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr
                  key={run.id}
                  onClick={() => setSelected(run)}
                  className={`border-b border-[#00ff00]/10 cursor-pointer hover:bg-[#00ff00]/5 ${
                    selected?.id === run.id ? "bg-[#00ff00]/10" : ""
                  }`}
                >
                  <td className="py-2">{run.id}</td>
                  <td className="py-2 text-[#ffb000]">{run.section}</td>
                  <td className="py-2 text-right">{run.score}</td>
                  <td className="py-2 text-right">
                    {run.verified ? (
                      <span className="text-[#00ff00]">[OK]</span>
                    ) : (
                      <span className="text-[#ffb000]">[PENDING]</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Video Player */}
        <div className="terminal-box p-4 h-[60vh]">
          {selected ? (
            <div className="h-full flex flex-col">
              <div className="text-[#ffb000] mb-2">{"> "}{selected.id.toUpperCase()}</div>
              <div className="text-sm text-[#00ff00]/70 mb-4">
                <div>Section: {selected.section}</div>
                <div>Score: {selected.score}</div>
                <div>Time: {selected.timestamp}</div>
              </div>
              {selected.videoUrl || selected.videoFile ? (
                <div className="flex-1 bg-black border border-[#00ff00]/30 min-h-0">
                  {isLocalVideo(selected) ? (
                    <video
                      src={getVideoSrc(selected)}
                      className="w-full h-full object-contain"
                      controls
                    />
                  ) : (
                    <iframe
                      src={selected.videoUrl}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  )}
                </div>
              ) : (
                <div className="flex-1 bg-black/50 border border-[#00ff00]/30 flex items-center justify-center text-[#00ff00]/30">
                  NO VIDEO
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#00ff00]/30">
              SELECT A RUN
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
