import { useState, useRef } from 'react';
import AuthPage from './pages/AuthPage';
import Navbar from './components/navbar/Navbar';
import Feed from './components/feed/Feed';
import LeftRail from './components/rail/LeftRail';
import RightRail from './components/rail/RightRail';

type Stats = { posts: number; likes: number; comments: number };

const API_BASE_URL = "http://localhost:9090";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [stats, setStats] = useState<Stats>({ posts: 0, likes: 0, comments: 0 });
    const feedRefreshRef = useRef<(() => void) | null>(null);

    const handleLogout = () => {
        const token = localStorage.getItem("token");
        // best-effort oznámenie backendu (JWT je stateless, výsledok neblokuje odhlásenie)
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
            <Navbar onPostCreated={() => feedRefreshRef.current?.()} />
            <div className="app-layout">
                <LeftRail />
                <Feed
                    onRegisterRefresh={(fn) => { feedRefreshRef.current = fn; }}
                    onStats={setStats}
                />
                <RightRail stats={stats} />
            </div>
        </>
    );
}

export default App;
