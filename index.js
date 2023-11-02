import React, { useState, useEffect } from "react";
import './style.css';
import { Helmet } from "react-helmet";


const Todo = () => {
  const [user, setUser] = useState({
    event: "",
  });

  const [shareUrl, setShareUrl] = useState('');
  const [isShared, setIsShared] = useState(false);

  const [events, setEvents] = useState([]);

  const updateLocalStorage = (updatedEvents) => {
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  //this useEffect is when we mount the component
  useEffect(() => {
    
    const id = window.location.pathname.split("/")[1]; //extract the id from the url
    if (id) {
      fetch(`https://backend.geeknomad.fr/fetch.php?random_id=${id}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch(error => console.error("Fetch error:", error));
    } else {
      const storedEvents = localStorage.getItem("events");
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    }
  }, []);
  
  //this useEffect is to update the database
  useEffect(() => {
    
    const id = window.location.pathname.split("/")[1]; //extract the id from thr url
  
    if (events.length > 0 && id) { //verify if have an event and an id
      fetch('https://backend.geeknomad.fr/insert.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: events, id: id }) //send the id if available
      })
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => {
        console.error("Erreur lors de la mise à jour de la base de données:", error);
      });
    }
  }, [events]); // each time the events change it modifies
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (user.event.length >= 3) {
      const updatedEvents = [...events, { text: user.event, crossed: false }];
      setEvents(updatedEvents);
      setUser({ event: "" });
      updateLocalStorage(updatedEvents);
    }
  };

  const handleClick = (index) => {
    const updatedEvents = [...events];
    updatedEvents[index].crossed = !updatedEvents[index].crossed;
    setEvents(updatedEvents);
    updateLocalStorage(updatedEvents);
  };

  const clearArray = () => {
    setEvents([]);
    localStorage.removeItem("events");
  };

  const removeElement = (index) => {
    const newEvents = events.filter((_, i) => i !== index);
    setEvents(newEvents);
    updateLocalStorage(newEvents);
  };

  const shareTodoList = () => {
    const id = window.location.pathname.split("/")[1]; // extract the ID from the URL

    fetch('https://backend.geeknomad.fr/insert.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: events, id: id }) // send the id if available
    })
    .then(response => response.json())
    .then(data => {
      if (!id) {
        const newId = data.random_id;
        window.history.pushState({}, '', `/${newId}`); // update the URL with the unique ID
      }
      setShareUrl(window.location.href);
      setIsShared(true);
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('URL copied to clipboard');
    });
  };

  return (
    <div className="all">
      <Helmet>
        <meta name="description" lang="fr" content="Organisez votre vie avec notre application Todolist design. Créez, partagez et gérez vos tâches facilement." />
        <meta name="description" lang="en" content="Organize your life with our aesthetic To Do List app. Create, share, and manage your tasks easily." />
      </Helmet>

      <div className="titleBox">
        <h1 className="title">todolist</h1>
      </div>
      <div className="boxEvent">
      {Array.isArray(events) ? events.map((event, index) => (
          <div className="box" key={index}>
            <p
              className="todoText"
              style={{
                textDecoration: event.crossed ? "line-through" : "none",
                cursor: "pointer",
                margin: 'auto',
              }}
              onClick={() => handleClick(index)}
            >
              {event.text}
            </p>
            <a onClick={() => removeElement(index)} style={{cursor: 'pointer'}} className="svg">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="rgba(175,126,235, 0.6)"
                className="bi bi-trash-fill"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
            </a>
          </div>
        )) : <p>No events to display</p>}
      </div>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="event"></label>
        <input
          type="text"
          id="event"
          placeholder="something..."
          name="event"
          value={user.event}
          onChange={handleChange}
          className="input"
        />
        <button className="submit" type="submit">
          {/* SVG code here */}
        </button>
      </form>
      <div>
        <button onClick={clearArray} className="clearButton">clear</button>
      </div>
      <div className="shareContainer">
        {/*To prevent the safari protection to avoid the copy with a button i have created an input witht the text to copy*/}
        {isShared ? (
          <button className="shareButton" onClick={copyToClipboard}>📋</button>
        ) : (
          <button className="shareButton" onClick={shareTodoList}>generate a link</button>
        )}
        <input 
          type="text" 
          readOnly 
          className="shareInput"
          value={shareUrl} 
          onClick={copyToClipboard}
          placeholder={isShared ? '' : 'link...'}
        />
        
      </div>
    </div>
  );
};

export default Todo;