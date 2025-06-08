import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../static/sessionSettings.css';

const SessionSettings = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('info');
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isChanged, setIsChanged] = useState(false);
    const [newCollaborator, setNewCollaborator] = useState('');
    const [collaborators, setCollaborators] = useState([]);
    
    const [settings, setSettings] = useState({
        name: '',
        active: true,
        imgPossible: true,
        videoPossible: true,
        audioPossible: true,
        linkPossible: true,
        maxWarn: -1
    });

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const sessionResponse = await fetch(`http://192.168.2.56:9002/app/session/${id}`);
                if (!sessionResponse.ok) throw new Error('Failed to fetch session data');
                const sessionData = await sessionResponse.json();

                console.log(sessionData)

                const collaboratorsResponse = await fetch(`http://192.168.2.56:9002/app/session/${id}/collaborators`);
                const collaboratorsData = collaboratorsResponse.ok 
                    ? await collaboratorsResponse.json() 
                    : [];

                setSessionData({
                    id: id,
                    name: sessionData.name,
                    group: sessionData.group,
                    active: sessionData.active,
                    createdAt: sessionData.createdAt || new Date().toISOString(),
                    messageCount: sessionData.messageCount || 0,
                    userCount: sessionData.userCount || 0
                });

                setSettings({
                    name: sessionData.name || '',
                    active: sessionData.active || true,
                    imgPossible: sessionData.imgPossible || true,
                    videoPossible: sessionData.videoPossible || true,
                    audioPossible: sessionData.audioPossible || true,
                    linkPossible: sessionData.linkPossible || true,
                    maxWarn: sessionData.maxWarn || -1
                });

                setCollaborators(collaboratorsData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSessionData();
    }, [id]);

    const handleSettingsChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setIsChanged(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://192.168.2.56:9002/app/session/${id}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update settings');
            }

            setSessionData(prev => ({
                ...prev,
                name: settings.name,
                active: settings.active
            }));

            setIsChanged(false);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddCollaborator = async (e) => {
        e.preventDefault();
        if (!newCollaborator.trim()) return;

        try {
            const response = await fetch(`http://192.168.2.56:9002/app/session/${id}/add`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: newCollaborator.trim() })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add collaborator');
            }

            // Refresh collaborators list
            const collaboratorsResponse = await fetch(`http://192.168.2.56:9002/app/session/${id}/collaborators`);
            if (collaboratorsResponse.ok) {
                setCollaborators(await collaboratorsResponse.json());
            }

            setNewCollaborator('');
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRemoveCollaborator = async (userId) => {
        try {
            const response = await fetch(`http://192.168.2.56:9002/app/session/${id}/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove collaborator');
            }

            // Refresh collaborators list
            const collaboratorsResponse = await fetch(`http://192.168.2.56:9002/app/session/${id}/collaborators`);
            if (collaboratorsResponse.ok) {
                setCollaborators(await collaboratorsResponse.json());
            }

            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="session-settings-container">Loading...</div>;
    if (error) return <div className="session-settings-container">Error: {error}</div>;
    if (!sessionData) return <div className="session-settings-container">No session data found</div>;

    return (
        <div className="session-settings-container">
            <header className="session-header">
                <h1>Конфигурация Сессии</h1>
                <div className="session-id">ID: {sessionData.id}</div>
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
                <button 
                    className={`tab-button ${activeTab === 'collaborators' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collaborators')}
                >
                    Сотрудники
                </button>
            </nav>

            <div className="session-content">
                {activeTab === 'info' && (
                    <div className="session-info-section">
                        <h2>Обзор сессии: </h2>
                        <div className="info-card">
                            <div className="info-row">
                                <span className="info-label">Название Сессии:</span>
                                <span className="info-value">{sessionData.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Название Чата:</span>
                                <span className="info-value">{sessionData.group}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Статус:</span>
                                <span className={`info-value ${sessionData.active ? 'active-status' : 'inactive-status'}`}>
                                    {sessionData.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Создано:</span>
                                <span className="info-value">{new Date(sessionData.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="session-stats-section">
                        <h2>Статистика: </h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-value">{sessionData.messageCount}</div>
                                <div className="stat-label">Сообщений</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{sessionData.userCount}</div>
                                <div className="stat-label">Пользователей</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="session-settings-section">
                        <h2>Настройки: </h2>
                        <form className="settings-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Название Сессии</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={settings.name}
                                    onChange={handleSettingsChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        name="active"
                                        checked={settings.active}
                                        onChange={handleSettingsChange}
                                    />
                                    Active
                                </label>
                            </div>
                            
                            <div className="form-group">
                                <label>Макс. предупреждений</label>
                                <input 
                                    type="number" 
                                    name="maxWarn"
                                    value={settings.maxWarn}
                                    onChange={handleSettingsChange}
                                    min="-1"
                                />
                                <small>-1 означает нет ограничения</small>
                            </div>
                            
                            <div className="form-group">
                                <label>Изображения</label>
                                <select 
                                    name="imgPossible"
                                    value={settings.imgPossible}
                                    onChange={handleSettingsChange}
                                >
                                    <option value={true}>Разрешены</option>
                                    <option value={false}>Запрещены</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Видео</label>
                                <select 
                                    name="videoPossible"
                                    value={settings.videoPossible}
                                    onChange={handleSettingsChange}
                                >
                                    <option value={true}>Разрешены</option>
                                    <option value={false}>Запрещены</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Аудио</label>
                                <select 
                                    name="audioPossible"
                                    value={settings.audioPossible}
                                    onChange={handleSettingsChange}
                                >
                                    <option value={true}>Разрешены</option>
                                    <option value={false}>Запрещены</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Ссылки</label>
                                <select 
                                    name="linkPossible"
                                    value={settings.linkPossible}
                                    onChange={handleSettingsChange}
                                >
                                    <option value={true}>Разрешены</option>
                                    <option value={false}>Запрещены</option>
                                </select>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`save-button ${!isChanged ? 'disabled' : ''}`} 
                                disabled={!isChanged}
                            >
                                Применить
                            </button>
                            {error && <div className="error-message">{error}</div>}
                        </form>
                    </div>
                )}

                {activeTab === 'collaborators' && (
                    <div className="session-collaborators-section">
                        <h2>Управление сотрудниками</h2>
                        <div className="collaborators-list">
                            <h3>Текущие сотрудники</h3>
                            {collaborators.length > 0 ? (
                                <ul>
                                    {collaborators.map(collaborator => (
                                        <li key={collaborator.id}>
                                            <span>{collaborator.name || collaborator.id}</span>
                                            <button 
                                                onClick={() => handleRemoveCollaborator(collaborator.id)}
                                                className="remove-button"
                                            >
                                                Удалить
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Нет сотрудников</p>
                            )}
                        </div>
                        <div className="add-collaborator-form">
                            <h3>Добавить сотрудника</h3>
                            <form onSubmit={handleAddCollaborator}>
                                <input
                                    type="text"
                                    value={newCollaborator}
                                    onChange={(e) => setNewCollaborator(e.target.value)}
                                    placeholder="Введите ID пользователя"
                                />
                                <button type="submit">Добавить</button>
                            </form>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionSettings;