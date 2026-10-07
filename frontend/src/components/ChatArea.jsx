import React from 'react';

export default function ChatArea({ currentSummary }) {
  return (
    <div className="content-area">
      {currentSummary ? (
        <div className="summary-result">
          <div className="summary-header">
            <span>Summary</span>
            <button className="copy-btn">Copy</button>
          </div>
          <div className="summary-box" style={{ whiteSpace: "pre-wrap" }}>
            <div className="summary-icon"></div>
            <div style={{ flex: 1 }}>{currentSummary.content}</div>
          </div>
        </div>
      ) : (
        <div className="empty-chat-placeholder">
          <h2>Ready to Summarize?</h2>
          <p>Paste your text or upload a PDF below to get started.</p>
        </div>
      )}
    </div>
  );
}
