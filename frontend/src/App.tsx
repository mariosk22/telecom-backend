import { useState, useRef } from 'react';
import AuthPage from './pages/AuthPage';
import Navbar from './components/navbar/Navbar';
import Feed from './components/feed/Feed';
import LeftRail from './components/rail/LeftRail';
import RightRail from './components/rail/RightRail';

type Stats = { posts: number; likes: number; comments: number };

const API_BASE_URL = "http://localhost:9090";

function getStoredAuth(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    try {
        let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        payload += "=".repeat((4 - (payload.length % 4)) % 4);
        const claims = JSON.parse(atob(payload));
        return typeof claims.exp === "number" && claims.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(getStoredAuth);
    const [stats, setStats] = useState<Stats>({ posts: 0, likes: 0, comments: 0 });
    const [searchQuery, setSearchQuery] = useState("");
    const feedRefreshRef = useRef<(() => void) | null>(null);

    const handleLogout = () => {
        const token = localStorage.getItem("token");
        fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).catch(() => {});

        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userNickname");
        localStorage.removeItem("userName");
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return <AuthPage onSuccess={() => setIsLoggedIn(true)} />;
    }

    return (
        <>
            <div className="aurora" aria-hidden="true"></div>
            <Navbar
                onPostCreated={() => feedRefreshRef.current?.()}
                onLogout={handleLogout}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            <div className="app-layout">
                <LeftRail />
                <Feed
                    onRegisterRefresh={(fn) => { feedRefreshRef.current = fn; }}
                    onStats={setStats}
                    searchQuery={searchQuery}
                />
                <RightRail stats={stats} />
            </div>
        </>
    );
}

export default App;
