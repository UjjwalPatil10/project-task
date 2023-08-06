import React, { useState, useEffect } from "react";
import axios from "axios";
// import Modal from "react-modal";
import { Modal, Button, Form, Table } from "react-bootstrap";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Add the Bootstrap styles to the modal overlay
import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";

// Modal.setAppElement("#root");

function App() {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [showModal, setShowModal] = useState(true);

  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [formDateTime, setFormDateTime] = useState(new Date());

  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserRegistration = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/register", { username });
      // setShowModal(false); //here the popup will be closed
      // setModalIsOpen(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleUserSelection = async (selectedUsername) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${selectedUsername}/tasks`
      );
      setTasks(response.data);
      setUsername(selectedUsername);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/${username}/tasks`,
        {
          taskName,
          taskDescription,
          formDateTime,
        }
      );
      setTasks(response.data);
      setTaskName("");
      setTaskDescription("");
      setFormDateTime(new Date());
      setShowModal(true);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (formNumber) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/users/${username}/tasks/${formNumber}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  return (
    <div className="App container py-5">
      {/* Add the "container" and "py-5" classes for layout */}
      {/* <Modal show={showModal} onHide={handleCloseModal}>
        <h2>Enter Your Username</h2>
        <form onSubmit={handleUserRegistration}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </Modal> */}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome! Please enter your name:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUserRegistration}>
            <Form.Group>
              <Form.Control
                type="text"
                name="userName"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <h1>Users List</h1>
      <ul className="list-group">
        {/* Use Bootstrap "list-group" class */}
        {users.map((user) => (
          <li key={user._id} className="list-group-item">
            {/* Use Bootstrap "list-group-item" class */}
            <button
              onClick={() => handleUserSelection(user.username)}
              className="btn btn-link"
              style={{ marginLeft: "40px" }}
            >
              {user.username}
            </button>
          </li>
        ))}
      </ul>
      {tasks.length > 0 && (
        <div className="mt-4">
          <h2>Task List for : {username}</h2>
          <ul className="list-group">
            {tasks.map((task, index) => (
              <li
                key={`${task.formNumber}_${index}`}
                className="list-group-item"
              >
                {/* Use Bootstrap "list-group-item" class */}
                <div className="p-3 d-flex justify-content-around">
                  <h5>{task.taskName}</h5>
                  <h5>{task.taskDescription}</h5>
                  <h5>{format(new Date(), "MMMM do yyyy, p")}</h5>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.formNumber)}
                  className="btn btn-danger btn-sm ml-2 position-relative float-end"
                  style={{ marginLeft: "35px4" }}
                >
                  {/* Use Bootstrap "btn", "btn-danger", and "btn-sm" classes */}
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <h2>Add Task For User : {username}</h2>
        <form
          onSubmit={handleAddTask}
          style={{
            display: "flex",
            flexDirection: "row",
            /* align-items: flex-start; */
            /* justify-content: center; */
            /* margin: auto; */
            columnGap: "22px",
          }}
        >
          <div className="form-group g-4">
            <input
              type="text"
              style={{ border: "2px solid bisque" }}
              className="form-control"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              style={{ border: "2px solid bisque" }}
              className="form-control"
              value={taskDescription}
              placeholder="Task Description"
              onChange={(e) => setTaskDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <DatePicker
              selected={formDateTime}
              onChange={(date) => setFormDateTime(date)}
              showTimeSelect
              className="form-control border-primary" // Add Bootstrap class to date picker
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {/* Use Bootstrap "btn" and "btn-primary" classes */}
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
