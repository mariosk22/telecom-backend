// src/App.tsx
import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import Feed from './components/feed/Feed';
import ThemeToggle from './components/theme-toggle/ThemeToggle';
import MsgToggle from './components/messages/MsgToggle';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!isLoggedIn) {
        return <AuthPage onSuccess={() => setIsLoggedIn(true)} />;
    }

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