import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit3 } from 'react-icons/fi';


import '../static/list.css';

const List = ({ isOwned, sessions = []  }) => {

  console.log(sessions);

  // const [sessions, setssions] = useState(null);

  // useEffect(() => {
  //       axios.get(`http://localhost:8000/api/u/${username}`)
  //       .then(res => setProfile(res.data))
  //       .catch(err => console.error('Error loading profile:', err));
  // }, [username]);


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
      let newSessionID = data.id;
      
      if (response.ok) {
        navigate('/session/${newSessionID}', { state: { serverData: data } });
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
                <p className="session-description">Название чата: {session.group}</p>
                </div>
                <div className={`session-status ${session.active ? 'active' : 'inactive'}`}>
                {session.active ? 'active' : 'inactive'}
                </div>
            </Link>
            ))}
            {isOwned ? (
              <Link to="#"  className="session-card" onClick={ createNew }>
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