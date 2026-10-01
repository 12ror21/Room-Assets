// src/App.tsx
import { useState } from "react";
import { Header } from "@/components/Header";
import { HomePage } from "@/pages/Home";
import { BookingsPage } from "@/pages/Bookings";
import { SettingsPage } from "@/pages/Settings";
import "./App.css";

function App() {
  const [active, setActive] = useState("catalog");

  const renderContent = () => {
    switch (active) {
      case "catalog":
        return <HomePage />;
      case "bookings":
        return <BookingsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <div>Неизвестная вкладка</div>;
    }
  };

  return (
    <>
      <Header
        activeNavId={active}
        onNavigate={setActive}
      />
      <main style={{
        padding: 16,
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 8,
        margin: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        minHeight: 'calc(100vh - 100px)'
      }}>
        {renderContent()}
      </main>
    </>
  );
}

export default App;