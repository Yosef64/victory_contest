import { useState } from "react";
import "./agentRegister.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AgentRegisterd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bankaccount: "",
    bankname: "",
    city: "",
    phoneNumber: "",
  });
  const [countryCode, setCountryCode] = useState("+251");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // If you want to include binary data, you can add it to formData
    const dataToSubmit = {
      ...formData,
      phoneNumber: countryCode + formData.phoneNumber,
      teleid: id,
    };
    const url = import.meta.env.VITE_REGISTER_API;
    try {
      // const res = await axios.post(url, dataToSubmit, {
      //   withCredentials: true,
      // });
      // if (res.status === 200) {
      //   setLoading(false);
      // } else {
      //   setError("Something went wrong! Pleas try again!");
      //   setLoading(false);
      // }
      navigate("/successPage");

      console.log(dataToSubmit);
    } catch (error) {
      console.error(error);
      setLoading(false);
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
            style={{ fontFamily: "'Public Sans',sans-serif", fontSize: 18 }}
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
            style={{ fontFamily: "'Public Sans',sans-serif", fontSize: 18 }}
          />
          <input
            type="number"
            name="bankaccount"
            className="mt-6"
            placeholder="Bank account"
            value={formData.bankaccount}
            onChange={handleChange}
            style={{ fontFamily: "'Public Sans',sans-serif", fontSize: 18 }}
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
            style={{ fontFamily: "'Public Sans',sans-serif", fontSize: 18 }}
          />

          <div className="phone-input">
            <select
              name="countryCode"
              className="mt-6"
              value={countryCode}
              onChange={(e) => {
                setCountryCode(e.target.value);
              }}
              required
            >
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+91">+91 (India)</option>
              <option value="+251">+251 (Eth)</option>
            </select>
            <input
              type="text"
              name="phoneNumber"
              className="mt-6"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              pattern="\d{9,9}"
            />
          </div>
        </div>
        <div className="mb-5">
          {loading ? (
            <Button disabled className="w-full pb-6 pt-6">
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onclick={handleSubmit}
              variant="outline"
              className="w-full pb-6 pt-6 styled-button "
            >
              Send
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AgentRegisterd;
