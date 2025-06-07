import React, { useState } from 'react';

import List from '../components/list';

import '../static/profile.css';



const Home = () => {
    return(
        <>
            <div className="profile-info">
                <div className="profile-header">
                    <h2 className="username"> Mike </h2>
                    <p className="email"> mamikulin@gmail.com </p>
                </div>
                
                <div className="session-stats">
                    <div className="stat-card">
                        <span className="stat-number"> 10 </span>
                        <span className="stat-label">Sessions Created</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number"> 15 </span>
                        <span className="stat-label">Sessions Granted</span>
                    </div>
                </div>
            </div>

            <List isOwned={ true } />
            <List isOwned={ false } />
        </>
    );
};

export default Home