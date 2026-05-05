// src/App.tsx
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import Feed from "./components/feed/Feed";
import ThemeToggle from "./components/theme-toggle/ThemeToggle";
import MsgToggle from "./components/messages/MsgToggle";

function App() {
  return (
    <>
      <Sidebar />
      <Navbar />
      <ThemeToggle />
      <Feed />
      <MsgToggle />
    </>
  );
}

export default App;
