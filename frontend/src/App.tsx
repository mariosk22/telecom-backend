import { useState, useRef } from 'react';
import AuthPage from './pages/AuthPage';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import Feed from './components/feed/Feed';
import MsgToggle from './components/messages/MsgToggle';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const feedRefreshRef = useRef<(() => void) | null>(null);

    if (!isLoggedIn) {
        return <AuthPage onSuccess={() => setIsLoggedIn(true)} />;
    }

    return (
        <>
            <Sidebar />
            <Navbar onPostCreated={() => feedRefreshRef.current?.()} />
            <Feed onRegisterRefresh={(fn) => { feedRefreshRef.current = fn; }} />
            <MsgToggle />
        </>
    );
}

export default App;