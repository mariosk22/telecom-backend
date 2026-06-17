import { useState, useRef } from 'react';
import AuthPage from './pages/AuthPage';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import Feed from './components/feed/Feed';
import MsgToggle from './components/messages/MsgToggle';

const API_BASE_URL = "http://localhost:9090";

function App() {
    // prihlásenie sa drží naprieč refreshom – odvodené z uloženého tokenu
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
    const [searchQuery, setSearchQuery] = useState("");
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
            <Sidebar />
            <Navbar
                onPostCreated={() => feedRefreshRef.current?.()}
                onLogout={handleLogout}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            <Feed
                onRegisterRefresh={(fn) => { feedRefreshRef.current = fn; }}
                searchQuery={searchQuery}
            />
            <MsgToggle />
        </>
    );
}

export default App;