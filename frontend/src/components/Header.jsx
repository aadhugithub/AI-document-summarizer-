import React from 'react';
import { MenuIcon } from './Icons';

export default function Header({ setSidebarOpen }) {
  return (
    <div className="main-header">
      <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
        <MenuIcon />
      </button>
      <h1 className="main-title">Summarizer</h1>
    </div>
  );
}
