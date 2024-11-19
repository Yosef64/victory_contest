import { useState } from "react";
import "./agentRegister.css";
import { useParams } from "react-router-dom";
import axios from "axios";
const AgetRegisterd = () => {
  const { id } = useParams();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If you want to include binary data, you can add it to formData
    const dataToSubmit = {
      ...formData,
      tele_id: id,
    };
    const url = import.meta.env.VITE_REGISTER_API;
    try {
      await axios.post(url, dataToSubmit, {
        withCredentials: true, // Enable sending cookies with the request
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container  agent">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between  h-screen"
      >
        <div className="flex flex-col">
          <h1 className="gradient-text mb-8">Register</h1>

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="mt-6"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            className="mt-6"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="bankname"
            className="mt-6"
            placeholder="Bank name"
            value={formData.bankname}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="bankaccount"
            className="mt-6"
            placeholder="Bank account"
            value={formData.bankaccount}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            className="mt-6"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <div className="phone-input">
            <select
              name="countryCode"
              className="mt-6"
              value={formData.countryCode}
              onChange={handleChange}
              required
            >
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+91">+91 (India)</option>
              <option value="+251">+251 (Eth)</option>
            </select>
            <input
              type="number"
              name="phoneNumber"
              className="mt-6"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-5">
          <button type="submit" className="styled-button w-full">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgetRegisterd;
