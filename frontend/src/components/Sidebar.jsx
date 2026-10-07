import React from 'react';
import { PlusIcon, TrashIcon } from './Icons';

export default function Sidebar({
  isSidebarOpen,
  setSidebarOpen,
  history,
  currentSummary,
  setCurrentSummary,
  setInputText,
  setSelectedFile,
  handleDelete
}) {
  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Summaries</h2>
        <button className="icon-btn" onClick={() => {
          setCurrentSummary(null);
          setInputText("");
          setSelectedFile(null);
          if (window.innerWidth <= 768) setSidebarOpen(false);
        }}>
          <PlusIcon />
        </button>
      </div>

      <div className="recent-label">Recent</div>
      <div className="history-list">
        {history.map((item) => {
          const itemTitle = item.title || item.original_text || "Summary";
          return (
            <div key={item.id} className={`history-item ${currentSummary?.id === item.id ? "active" : ""}`} onClick={() => {
              const actionText = item.action_items ? `\n\nACTION ITEMS:\n${item.action_items}` : "";
              setCurrentSummary({
                id: item.id,
                title: itemTitle,
                content: (item.summary || "") + actionText
              });
              if (window.innerWidth <= 768) setSidebarOpen(false);
            }}>
              <span className="history-item-title" title={itemTitle}>{itemTitle}</span>
              <button className="delete-btn" onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}>
                <TrashIcon />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
