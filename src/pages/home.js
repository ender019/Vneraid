import React, { useState, useEffect } from 'react';
import List from '../components/list';
import { FiCopy } from "react-icons/fi";
import '../static/profile.css';

const Home = () => {
    localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [userData, setUserData] = useState(null);
    const [sessionsData, setSessionsData] = useState({
        ownedSessions: [],
        grantedSessions: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const userId = 2; 
                
                const url = `http://192.168.2.56:9002/app/user/${userId}`;
                console.log(url);
                const userResponse = await fetch(url);
                if (!userResponse.ok) throw new Error('Failed to fetch user data');
                const userData = await userResponse.json();
                setUserData(userData);

                console.log(userData);
                
                const sessionsResponse = await fetch(`http://192.168.2.56:9002/app/user/${userId}/sessions`);
                if (!sessionsResponse.ok) throw new Error('Failed to fetch session data');
                const sessionsData = await sessionsResponse.json();
                
                setSessionsData({
                    ownedSessions: sessionsData.redSessions || [],
                    grantedSessions: sessionsData.lisSessions || []
                });
                console.log(sessionsData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="session-settings-container">Loading...</div>;


    return(
        <>
            <div className="profile-info">
                <div className="profile-header">
                    <h2 className="username"> 
                        {userData.username}
                    </h2>
                    <p className="email"> {userData.email} </p>
                </div>
                
                <div className="session-stats">
                    <div className="stat-card">
                        <span className="stat-number">{ sessionsData.ownedSessions.length }</span>
                        <span className="stat-label">сессий создано</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{ sessionsData.grantedSessions.length }</span>
                        <span className="stat-label">сессий выдано</span>
                    </div>
                </div>
            </div>

            <List isOwned={true} sessions={sessionsData.ownedSessions} />
            <List isOwned={false} sessions={sessionsData.grantedSessions} />
        </>
    );
};

export default Home;