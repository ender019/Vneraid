import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import '../static/sessionSettings.css';


const SessionSettings = () => {
    const { hash } = useParams();
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'stats', 'settings'

    return (
        <div className="session-settings-container">
            <header className="session-header">
                <h1>Конфигурация Сессии</h1>
                <div className="session-id">ID: {hash}</div>
            </header>

            <nav className="session-tabs">
                <button 
                    className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    Обзор
                </button>
                <button 
                    className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    Статистика
                </button>
                <button 
                    className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Настройки
                </button>
            </nav>

            <div className="session-content">
                {activeTab === 'info' && (
                    <div className="session-info-section">
                        <h2>Обзор сессии: </h2>
                        <div className="info-card">
                            <div className="info-row">
                                <span className="info-label">Чат:</span>
                                <span className="info-value">Customer Support session #{hash}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Статус:</span>
                                <span className="info-value active-status">Active</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Создано:</span>
                                <span className="info-value">June 15, 2023</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="session-stats-section">
                        <h2>Статистики: </h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-value">1,248</div>
                                <div className="stat-label">Статистика</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">1,248</div>
                                <div className="stat-label">Статистика</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">1,248</div>
                                <div className="stat-label">Статистика</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">1,248</div>
                                <div className="stat-label">Статистика</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">1,248</div>
                                <div className="stat-label">Статистика</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">1,248</div>
                                <div className="stat-label">Статистика</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">1,248</div>
                                <div className="stat-label">Статистика</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">1,248</div>
                                <div className="stat-label">Статистика</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">1,248</div>
                                <div className="stat-label">Статистика</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">1,248</div>
                                <div className="stat-label">Статистика</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">1,248</div>
                                <div className="stat-label">Статистика</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="session-settings-section">
                        <h2>Настройки: </h2>
                        <form className="settings-form">
                            <div className="form-group">
                                <label>session Name</label>
                                <input type="text" defaultValue={`Support session ${hash}`} />
                            </div>
                            <div className="form-group">
                                <label>Response Mode</label>
                                <select>
                                    <option>Automatic</option>
                                    <option>Manual Approval</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Active Status
                                </label>
                            </div>
                            <button type="submit" className="save-button">
                                Save Changes
                            </button>
                        </form>
                    </div>
                )}
            </div>

            
        </div>
    );
};

export default SessionSettings;