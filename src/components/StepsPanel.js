import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Pause,
  Timer,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const StepsPanel = ({ steps, current, onNext, onPrev, onRepeat }) => {
  const step = steps[current];
  const total = steps.length;
  const progressPct = ((current + 1) / total) * 100;

  const [remaining, setRemaining] = useState(step.duration || 0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // Reset timer when step changes
  useEffect(() => {
    setRemaining(step.duration || 0);
    setRunning(false);
  }, [current]);

  // Timer logic
  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-md">

      {/* Progress */}
      <div className="p-4 border-b">
        <div className="flex justify-between text-sm mb-2">
          <span>Step {current + 1} of {total}</span>
          <span>{Math.round(progressPct)}%</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-orange-500 h-2 rounded"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      <div className="p-6 flex-1">
        <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
        <p className="text-gray-600">{step.description}</p>

        {/* Timer */}
        {step.duration && (
          <div className="mt-6 p-4 border rounded-lg bg-orange-50">
            <div className="flex items-center gap-2 text-orange-600 font-semibold mb-2">
              <Timer size={16} /> Timer
            </div>

            <div className="flex justify-between items-center">
              <div className="text-3xl font-mono">
                {formatTime(remaining)}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setRunning(!running)}
                  className="px-3 py-1 bg-orange-500 text-white rounded"
                  disabled={remaining === 0}
                >
                  {running ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <button
                  onClick={() => {
                    setRemaining(step.duration || 0);
                    setRunning(false);
                  }}
                  className="px-3 py-1 border rounded"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Steps */}
        <div className="mt-8">
          <h3 className="text-sm font-bold mb-3">All Steps</h3>

          {steps.map((s, i) => (
            <div
              key={i}
              className={`p-3 border rounded mb-2 ${
                i === current ? "bg-orange-100" : ""
              }`}
            >
              {i + 1}. {s.title}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between p-4 border-t">
        <button
          onClick={onPrev}
          disabled={current === 0}
          className="px-4 py-2 border rounded"
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <button
          onClick={onRepeat}
          className="px-4 py-2 border rounded"
        >
          <RotateCcw size={16} /> Repeat
        </button>

        <button
          onClick={onNext}
          disabled={current === total - 1}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default StepsPanel;