import React, { useState } from "react";
import './style.css';

const Todo = () => {
  const [user, setUser] = useState({
    event: "",
  });

  const [events, setEvents] = useState([]); // create the table 

  const handleChange = (event) => { //when we add smth with the button in the input
    const { name, value } = event.target;
    setUser((user) => ({ ...user, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (user.event.length >= 3) {
      setEvents([...events, { text: user.event, crossed: false }]); // if the event is > 3 -> add new object to the table  and initalize the crossed to false
      setUser({ event: "" }); // put the value to nothing
      console.log("success");
    } else {
      console.log("error");
    }
  };

  const handleClick = (index) => {
    const updatedEvents = [...events]; // create a table copy
    updatedEvents[index] = {
      ...updatedEvents[index], // copy the object of the event
      crossed: !updatedEvents[index].crossed, // inverse the style
    };
    setEvents(updatedEvents); //update the tabke
  };

  //function to refresh the page
  function refresh() {
    window.location.reload(false);
  }
  
  const removeElement = (index) => {
    const newEvents = events.filter((_, i) => i !== index); //_ is a not used parameter
    setEvents(newEvents);
  };

  return (
    <div class="all">
      <div class="titleBox">
      <h1 class="title">todolist</h1>
      </div>
      <div class="boxEvent">
      {events.map((event, index) => ( // read the table with maps and get the index for each element
        <div 
        class="box"
        >
        <>
            <p
            class="todoText"
              key={index} //
              style={{
                textDecoration: event.crossed ? "line-through" : "none",
                cursor: "pointer",
                margin: 'auto',
              }} // if event.crossed is true -> line-through else -> nothing
              onClick={() => handleClick(index)}
            >
              {event.text}
            </p>
            <a onClick={() => removeElement(index)} style={{cursor: 'pointer'}} class="svg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash-fill"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
            </a>
          </>
        </div>
      ))}
      </div>

      <form onSubmit={handleSubmit} class="form">
        <label htmlFor="event"></label>
        <input
          type="text"
          id="event"
          placeholder="Something..."
          name="event"
          value={user.event}
          onChange={handleChange}
          class="input"
          
        />
        <button 
          class="submit"
          type="submit" 
          
        >
          <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px">    
          <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M21,16h-5v5 c0,0.553-0.448,1-1,1s-1-0.447-1-1v-5H9c-0.552,0-1-0.447-1-1s0.448-1,1-1h5V9c0-0.553,0.448-1,1-1s1,0.447,1,1v5h5 c0.552,0,1,0.447,1,1S21.552,16,21,16z"/></svg></button>
      </form>

      <div>
      <button onClick={refresh} class="clearButton">Clear</button>
    </div>
    </div>
  );
};


export default Todo;
