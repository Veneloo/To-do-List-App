import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskManager.css"; // Importing the CSS file for styling

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTaskTitle, setEditingTaskTitle] = useState("");
    const [editingTaskDescription, setEditingTaskDescription] = useState("");

    useEffect(() => {
        const handleVisibilityChange = () => {
            // Re-fetch tasks when the user returns to the app
            if (document.visibilityState === "visible") {
                fetchTasks();
            }
        };
    
        // Listen for visibility changes
        document.addEventListener("visibilitychange", handleVisibilityChange);
    
        // Initial fetch when the component mounts
        fetchTasks();
    
        return () => {
            // Cleanup the event listener when the component unmounts
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);
    

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tasks`);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = async () => {
        if (newTaskTitle.trim()) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/tasks`, {
                    title: newTaskTitle,
                    description: newTaskDescription,
                });
                setTasks([...tasks, response.data]); // Dynamically add the new task to the state
                setNewTaskTitle("");
                setNewTaskDescription("");
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
    };

    const toggleCompleted = async (id, completed) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/tasks/${id}/completed`, {
                completed: !completed, // Toggle the completed status
            });
            setTasks(tasks.map((task) => (task._id === id ? response.data : task))); // Update task in the state
        } catch (error) {
            console.error("Error toggling task completion:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/tasks/${id}`);
            setTasks(tasks.filter((task) => task._id !== id)); // Remove the task from the state
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const startEditing = (id, title, description) => {
        setEditingTaskId(id);
        setEditingTaskTitle(title);
        setEditingTaskDescription(description);
    };

    const saveEdit = async (id) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/tasks/${id}`, {
                title: editingTaskTitle,
                description: editingTaskDescription,
            });
            setTasks(tasks.map((task) => (task._id === id ? response.data : task))); // Update the edited task in the state
            setEditingTaskId(null);
            setEditingTaskTitle("");
            setEditingTaskDescription("");
        } catch (error) {
            console.error("Error saving task edit:", error);
        }
    };

    const cancelEdit = () => {
        setEditingTaskId(null);
        setEditingTaskTitle("");
        setEditingTaskDescription("");
    };
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
    axios.get(`${API_BASE_URL}/tasks`)
        .then((response) => {
        console.log(response.data);
        })
        .catch((error) => {
        console.error("Error fetching tasks:", error);
        });
    }, [API_BASE_URL]);


    return (
        <div className="task-manager">
            <h1 className="title">To-Do List</h1>
            <p className="instruction">* Please click one of the links to start the backend</p>

            <div className="link-container">
                <a href={`${API_BASE_URL}/tasks`} target="_blank" rel="noopener noreferrer">
                    View All Posts
                </a>
                <a href={`${API_BASE_URL}/tasks/examples/create`} target="_blank" rel="noopener noreferrer">
                    Create Post
                </a>
                <a href={`${API_BASE_URL}/tasks/examples/edit`} target="_blank" rel="noopener noreferrer">
                    Edit Post
                </a>
                <a href={`${API_BASE_URL}/tasks/examples/delete`} target="_blank" rel="noopener noreferrer">
                    Delete Post
                </a>
            </div>

            <div className="form-container">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="New Post Title"
                    className="form-input"
                />
                <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="New Post Description"
                    className="form-textarea"
                ></textarea>
                <button onClick={addTask} className="add-button">
                    Add Post
                </button>
            </div>

            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task._id} className={`task-item ${task.completed ? "completed" : ""}`}>
                        {editingTaskId === task._id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingTaskTitle}
                                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                                    className="form-input"
                                />
                                <textarea
                                    value={editingTaskDescription}
                                    onChange={(e) => setEditingTaskDescription(e.target.value)}
                                    className="form-textarea"
                                ></textarea>
                                <button onClick={() => saveEdit(task._id)} className="save-button">
                                    Save
                                </button>
                                <button onClick={cancelEdit} className="cancel-button">
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="task-details">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleCompleted(task._id, task.completed)}
                                        className="checkbox"
                                    />
                                    <strong>{task.title}</strong>
                                    <p>{task.description}</p>
                                </div>
                                <div className="task-actions">
                                    <button
                                        onClick={() => startEditing(task._id, task.title, task.description)}
                                        className="edit-button"
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => deleteTask(task._id)} className="delete-button">
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;
