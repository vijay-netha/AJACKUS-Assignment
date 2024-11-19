import React, { useState, useEffect } from "react";
import "./App.css"

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", email: "", department: "" });
  const [error, setError] = useState("");

  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch users.");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    }
  };

  const onchangeInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const onsubmitAddOrEditUser = async (event) => {
    event.preventDefault();
    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `${API_URL}/${form.id}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to save user.");

      const updatedUser = await response.json();

      if (form.id) {
        setUsers(users.map((user) => (user.id === form.id ? updatedUser : user)));
      } else {
        setUsers([...users, { ...updatedUser, id: users.length + 1 }]); // Add mock ID for display
      }

      setForm({ id: null, name: "", email: "", department: "" });
    } catch (err) {
      setError("Failed to save user. Please try again.");
    }
  };

  
  const onClickEditUser = (user) => {
    setForm(user);
  };

  const onClickDeleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete user.");

      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1>User List</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className="form" onSubmit={onsubmitAddOrEditUser}>
        <input
          type="text"
          name="name"
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={onchangeInputChange}
          required
        />
        <input
          type="email"
          name="email"
          className="input"
          placeholder="Email"
          value={form.email}
          onChange={onchangeInputChange}
          required
        />
        <input
          type="text"
          className="input"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={onchangeInputChange}
        />
        <button className="button" type="submit">{form.id ? "Update" : "Add"} User</button>
      </form>

      <table border="2" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.department || "N/A"}</td>
              <td>
                <button className="button1" onClick={() => onClickEditUser(user)}>Edit</button>
                <button className="button2" onClick={() => onClickDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;