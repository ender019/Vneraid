import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit3 } from 'react-icons/fi';

import '../static/list.css';

const List = ({ isOwned }) => {

  const sessions = [
    { id: '1', name: 'Технопарк', description: 'Handles customer inquiries 24/7', status: 'active' },
    { id: '2', name: 'ВК', description: 'Helps qualify leads and book meetings', status: 'active' },
    { id: '3', name: 'Чат №1', description: 'Answers frequently asked questions', status: 'inactive' },
    { id: '4', name: 'Чат раз два три', description: 'Gathers user feedback automatically', status: 'active' },
  ];

  const navigate = useNavigate();

  const createNew = async () => {
    try {
      const response = await fetch('/api/create-new', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        navigate('/new', { state: { serverData: data } });
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };


  return (
    <div className="list-container">
        
        {isOwned ? (<h2 className="list-title">Ваши Сессии</h2>) : (<h2 className="list-title">Сессии к которым у вас есть доступ</h2>)}
        <div className="sessions-list">
            {sessions.map((session) => (
            <Link to={`/session/${session.id}`} key={session.id} className="session-card">
                <div className="session-info">
                <h3 className="session-name">{session.name}</h3>
                <p className="session-description">{session.description}</p>
                </div>
                <div className={`session-status ${session.status}`}>
                {session.status === 'active' ? 'Active' : 'Inactive'}
                </div>
            </Link>
            ))}
            {isOwned ? (
              <Link to={`/new`}  className="session-card" onClick={ createNew }>
                <div className="session-info">           
                  <h3 className="session-name"><FiEdit3 className="user-icon" /></h3>
                  <p className="session-description">add new</p>
                </div>
              </Link>
              ) : (<></>)}
        </div>

    </div>
  );
};

export default List;