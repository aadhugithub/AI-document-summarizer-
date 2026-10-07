import React from "react";

function ResultScreen({ result, onNew }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="card">
      <div className="result-header">
        <h1>Results</h1>
        <button className="secondary-btn" onClick={onNew}>
          + New Document
        </button>
      </div>

      {/* Summary Section */}
      <div className="result-section">
        <div className="section-header">
          <h2>Summary</h2>
          <button
            className="copy-btn"
            onClick={() => copyToClipboard(result.summary)}
          >
            Copy
          </button>
        </div>
        <pre className="content-box">{result.summary}</pre>
      </div>

      {/* Action Items Section */}
      <div className="result-section">
        <div className="section-header">
          <h2>Action Items</h2>
          <button
            className="copy-btn"
            onClick={() => copyToClipboard(result.action_items)}
          >
            Copy
          </button>
        </div>
        <pre className="content-box">{result.action_items}</pre>
      </div>

      <p className="meta">
        Source: {result.source_type.toUpperCase()} •{" "}
        {new Date(result.created_at).toLocaleString()}
      </p>
    </div>
  );
}

export default ResultScreen;