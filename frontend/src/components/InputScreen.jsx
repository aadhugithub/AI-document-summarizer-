import React, { useState } from "react";

export default function InputScreen({ onSuccess }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setText(""); // clear text if file is selected
      setError("");
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { summarizeDocument } = await import("../api/summarize");
      const result = await summarizeDocument(text, file);
      onSuccess(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>AI Document Summarizer</h1>
      <p className="subtitle">Paste text or upload a PDF to get Summary + Action Items</p>

      <form onSubmit={handleSubmit}>
        {/* Text Area */}
        <div className="form-group">
          <label>Paste your text</label>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setFile(null);
            }}
            placeholder="Paste any long text, meeting notes, email, report..."
            rows={10}
            disabled={loading || file}
          />
        </div>

        <div className="divider">OR</div>

        {/* PDF Upload */}
        <div className="form-group">
          <label>Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={loading || text.trim().length > 0}
          />
          {file && <p className="file-name">Selected: {file.name}</p>}
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading || (!text.trim() && !file)}>
          {loading ? "Generating..." : "Generate Summary"}
        </button>
      </form>
    </div>
  );
}

