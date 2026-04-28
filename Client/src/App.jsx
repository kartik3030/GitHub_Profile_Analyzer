import React, { useState } from "react";
import Landing from "./Pages/Landing";
import AnalysisResult from "./Pages/AnalysisResult";

const App = () => {
    const [result, setResult] = useState(null);

    return result ? (
        <AnalysisResult
            result={result}
            onReset={() => setResult(null)}
        />
    ) : (
        <Landing onAnalyze={setResult} />
    );
};

export default App;