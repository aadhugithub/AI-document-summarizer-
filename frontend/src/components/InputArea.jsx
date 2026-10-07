import React, { useRef } from 'react';
import { FileIcon, StopIcon, UpArrowIcon } from './Icons';

export default function InputArea({
  inputText,
  setInputText,
  selectedFile,
  setSelectedFile,
  isGenerating,
  progress,
  currentSummary,
  handleGenerate,
  handleStop
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setInputText(""); // Clear text if file selected
    } else {
      alert("Please select a valid PDF file");
      setSelectedFile(null);
    }
  };

  return (
    <div className="input-area-container">
      <div className="input-box">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="application/pdf"
        />
        {selectedFile ? (
          <div style={{ padding: '20px', color: '#888' }}>
            Selected PDF: <strong style={{ color: 'var(--text-dark)' }}>{selectedFile.name}</strong>
          </div>
        ) : (
          <textarea
            placeholder="Paste your text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isGenerating || !!currentSummary}
          />
        )}
        
        <div className="input-actions">
          <button 
            className="file-btn" 
            onClick={() => fileInputRef.current.click()}
            disabled={isGenerating || inputText.trim().length > 0 || !!currentSummary}
          >
            <FileIcon />
          </button>
          
          {isGenerating ? (
            <button 
              className="send-btn stop-btn active"
              onClick={handleStop}
            >
              <StopIcon />
            </button>
          ) : (
            <button 
              className={`send-btn ${inputText.trim() || selectedFile ? "active" : ""}`}
              onClick={handleGenerate}
              disabled={(!inputText.trim() && !selectedFile) || !!currentSummary}
            >
              <UpArrowIcon />
            </button>
          )}
        </div>

        {isGenerating && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
