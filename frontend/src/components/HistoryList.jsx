import React, { useEffect, useState } from "react";
import { getSummaries } from "../api/summarize";

function HistoryList({ onSelect }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getSummaries();
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <p>Loading history...</p>;
  if (history.length === 0) return <p className="empty">No past summaries yet</p>;

  return (
    <div className="history">
      <h3>Recent Summaries</h3>
      <ul>
        {history.map((item) => (
          <li key={item.id} onClick={() => onSelect(item)}>
            <span className="history-source">{item.source_type}</span>
            <span className="history-date">
              {new Date(item.created_at).toLocaleDateString()}
            </span>
            <p className="history-preview">
              {item.summary.substring(0, 80)}...
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryList;