import { useState } from "react";
import "./agentRegister.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
const AgetRegisterd = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    bankaccount: "",
    bankname: "",
    city: "",
    phoneNumber: "",
    countryCode: "+1",
  });
  const [error, setError] = useState(null);

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
      const res = await axios.post(url, dataToSubmit, {
        withCredentials: true,
      });
      if (res.ok) {
        navigator("/succesfull");
      } else {
        setError("Something went wrong! Pleas try again!");
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };
  const handleClose = () => {
    setError(null);
  };

  return (
    <div className="form-container  agent">
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        onClose={handleClose}
        autoHideDuration={6000}
        open={error !== null}
        children={
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        }
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between  h-screen"
      >
        <div className="flex flex-col">
          <h1 className="gradient-text mb-8">Register</h1>

          <input
            type="text"
            name="name"
            className="mt-6"
            placeholder="Full Name"
            value={formData.name}
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