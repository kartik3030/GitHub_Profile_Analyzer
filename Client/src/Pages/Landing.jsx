import { useState, useEffect } from "react";
import AnalysisResult from "./AnalysisResult";

const GRID_SIZE = 20;

function GridBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <svg width="100%" height="100%">
                <defs>
                    <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                        <path
                            d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                            fill="none"
                            stroke="rgba(56,189,248,0.07)"
                            strokeWidth="0.5"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
    );
}

function TerminalCaret() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const t = setInterval(() => setVisible(v => !v), 530);
        return () => clearInterval(t);
    }, []);

    return (
        <span
            style={{
                display: "inline-block",
                width: "2px",
                height: "1.1em",
                background: visible ? "#38bdf8" : "transparent",
                marginLeft: "2px"
            }}
        />
    );
}

function TypewriterText({ text }) {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        let i = 0;
        const iv = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) clearInterval(iv);
        }, 30);

        return () => clearInterval(iv);
    }, [text]);

    return (
        <span>
            {displayed}
            {displayed.length < text.length && <TerminalCaret />}
        </span>
    );
}

export default function App() {
    const [username, setUsername] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const VITE_API = import.meta.env.VITE_API;

    async function handleSubmit(e) {
        e.preventDefault();

        if (!username.trim()) {
            setError("Enter Username");
            return;
        }

        setError(null);
        setSubmitted(true);

        try {
            const res = await fetch(`${VITE_API}/user/${username}`);

            if (!res.ok) throw new Error();

            const data = await res.json();
            setResult(data);

        } catch {
            setError("Something went wrong");
        } finally {
            setSubmitted(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <GridBackground />

            <h1>GitHub Profile Analyser</h1>

            <p>
                <TypewriterText text="Decode any developer's GitHub DNA." />
            </p>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button type="submit">
                    {submitted ? "Analysing..." : "Analyse"}
                </button>
            </form>

            {error && <p>{error}</p>}

            {result && (
                <AnalysisResult
                    result={result}
                    onReset={() => setResult(null)}
                />
            )}
        </div>
    );
}