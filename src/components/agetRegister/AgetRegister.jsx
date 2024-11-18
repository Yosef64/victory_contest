import { useState } from "react";
import "./agentRegister.css";
const AgetRegisterd = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bankaccount: "",
    bankname: "",
    city: "",
    phoneNumber: "",
    countryCode: "+1",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If you want to include binary data, you can add it to formData
    const dataToSubmit = {
      ...formData,
    };

    console.log("Form Data Submitted:", dataToSubmit);

    // Additional submission logic can be added here (e.g., sending data to a server)
  };

  return (
    <div className="form-container  agent flex flex-col justify-between h-screen">
      <div>
        <h1 className="gradient-text mb-12">Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="bankname"
            placeholder="Bank name"
            value={formData.bankname}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="bankaccount"
            placeholder="Bank account"
            value={formData.bankaccount}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <div className="phone-input">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              required
            >
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+91">+91 (India)</option>
              <option value="+251">+251 (Ethiopia)</option>
            </select>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </div>
      <div className="flex justify-center w-full">
        <button type="submit" className="styled-button w-full">
          Register
        </button>
      </div>
    </div>
  );
};

export default AgetRegisterd;
