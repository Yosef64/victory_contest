import { useState } from "react";
import "./Register.css";

const Register = () => {
  const [imagePreview, setImagePreview] = useState(null); // For displaying the image preview
  const [imageBinary, setImageBinary] = useState(null); // For storing the binary data
  const [countryCode, setCountryCode] = useState("+251");
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Read file as Data URL to display a preview
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the image preview

        // Convert the image to binary data (ArrayBuffer)
        const binaryReader = new FileReader();
        binaryReader.readAsArrayBuffer(file);
        binaryReader.onloadend = () => {
          const arrayBuffer = binaryReader.result;
          const binaryData = new Uint8Array(arrayBuffer);
          setImageBinary(binaryData); // Store binary data in state

          console.log("Binary Data:", binaryData); // For debugging
        };
      };
    }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    sex: "",
    age: "",
    grade: "",
    school: "",
    city: "",
    region: "",
    phoneNumber: "",
    // Store image file, initially null
    contests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If you want to include binary data, you can add it to formData
    const dataToSubmit = {
      ...formData,
      phoneNumber: countryCode + formData.phoneNumber,
      imageBinary: imageBinary, // Attach binary data to the form submission
    };

    console.log("Form Data Submitted:", dataToSubmit);
    console.log("Image Binary Data:", imageBinary); // This will log the image binary data

    // Additional submission logic can be added here (e.g., sending data to a server)
  };

  return (
    <div className="form-container">
      <h1 className="gradient-text">Register</h1>

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

        <div className="custom-select">
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
            aria-label="Select gender"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={formData.grade}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="school"
          placeholder="School"
          value={formData.school}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City/Town"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="region"
          placeholder="Region"
          value={formData.region}
          onChange={handleChange}
          required
        />

        <div className="phone-input">
          <select
            name="countryCode"
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
            }}
            required
          >
            <option value="+1">+1 (USA)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+91">+91 (India)</option>
            <option value="+251">+251 (Ethiopia)</option>
          </select>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            pattern="\d{9,9}"
          />
        </div>

        <div className="photo-upload-form">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="photo-preview"
            />
          ) : (
            <label className="photo-label">Your Photo</label>
          )}

          <div className="photo-upload-container">
            <label className="upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <div className="upload-instructions">
                <p>
                  <strong>Click to upload</strong>
                </p>
                <p>SVG, PNG, JPG or GIF (max 800x400px)</p>
              </div>
            </label>
          </div>
        </div>

        <button type="submit" className="styled-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
