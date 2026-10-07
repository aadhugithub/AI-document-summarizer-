import React, { useState, useEffect, useRef } from "react";
import "./index.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatArea from "./components/ChatArea";
import InputArea from "./components/InputArea";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);
  const stopGenerationRef = useRef(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { getSummaries } = await import("./api/summarize.js");
        const data = await getSummaries();
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };
    fetchHistory();
  }, []);

  // Moved handleFileChange to InputArea.jsx

  const handleStop = () => {
    stopGenerationRef.current = true;
    setIsGenerating(false);
    setProgress(0);
  };

  const handleDelete = async (id) => {
    try {
      const { deleteSummary } = await import("./api/summarize.js");
      await deleteSummary(id);
    } catch (err) {
      console.warn("Item already deleted or missing from backend database:", err);
    } finally {
      setHistory((prev) => prev.filter((h) => h.id !== id));
      if (currentSummary?.id === id) {
        setCurrentSummary(null);
      }
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim() && !selectedFile) return;
    
    setIsGenerating(true);
    setProgress(0);
    setCurrentSummary(null);
    stopGenerationRef.current = false;

    // Simulate progress bar while generating
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90; // Hold at 90% until done
        return prev + 10;
      });
    }, 200);

    try {
      const { summarizeDocument, getSummaries } = await import("./api/summarize.js");
      const result = await summarizeDocument(inputText, selectedFile);
      
      if (stopGenerationRef.current) {
        clearInterval(interval);
        return;
      }
      
      clearInterval(interval);
      setProgress(100);

      setTimeout(async () => {
        if (stopGenerationRef.current) return;
        setIsGenerating(false);
        setProgress(0);
        setSelectedFile(null);
        
        // Ensure result has content or fallback to string
        const resultText = typeof result === 'string' ? result : (result.summary || JSON.stringify(result));
        const actionItems = result.action_items ? `\n\nACTION ITEMS:\n${result.action_items}` : "";
        
        const newSummary = {
          id: result.id || Date.now(),
          title: selectedFile ? selectedFile.name : (inputText.substring(0, 20) + "..."),
          content: resultText + actionItems
        };
        setCurrentSummary(newSummary);
        
        // Refresh history to get exact DB records
        try {
            const data = await getSummaries();
            setHistory(data);
        } catch(e) {
            setHistory([newSummary, ...history]);
        }
        setInputText("");
      }, 500);
      
    } catch (err) {
      if (stopGenerationRef.current) return;
      clearInterval(interval);
      setIsGenerating(false);
      setProgress(0);
      console.error(err);
      alert("Error generating summary");
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        history={history} 
        currentSummary={currentSummary} 
        setCurrentSummary={setCurrentSummary} 
        setInputText={setInputText} 
        setSelectedFile={setSelectedFile} 
        handleDelete={handleDelete} 
      />

      <div className="main-content">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <ChatArea currentSummary={currentSummary} />

        <InputArea 
          inputText={inputText}
          setInputText={setInputText}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          isGenerating={isGenerating}
          progress={progress}
          currentSummary={currentSummary}
          handleGenerate={handleGenerate}
          handleStop={handleStop}
        />
      </div>
    </div>
  );
}

export default App;