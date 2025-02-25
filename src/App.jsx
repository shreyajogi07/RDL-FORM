import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
    profilePic: null,
  });

  const [users, setUsers] = useState([]);

  // Handle Input Changes
  const handleChange = (e) => {
    if (e.target.name === "profilePic") {
      setFormData({ ...formData, profilePic: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      await axios.post("http://localhost:5000/addUser", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Fetch Users from Database
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h2>College ID Form</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="file" name="profilePic" accept="image/*" onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>

      <h2>Submitted Details</h2>
      <div className="card-container">
        {users.map((user) => (
          <div className="card" key={user._id}>
            <img src={`http://localhost:5000${user.profilePic}`} alt="Profile" />
            <h3>{user.firstName} {user.lastName}</h3>
            <p>📞 {user.phone}</p>
            <p>🏠 {user.address}</p>
            <p>✉️ {user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
