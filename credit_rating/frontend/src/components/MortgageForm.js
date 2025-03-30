import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MortgageForm() {
  const [formData, setFormData] = useState({
    credit_score: "",
    loan_amount: "",
    property_value: "",
    annual_income: "",
    debt_amount: "",
    loan_type: "fixed",
    property_type: "single_family",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate input fields
  const validate = () => {
    let newErrors = {};

    if (formData.credit_score < 300 || formData.credit_score > 850) {
      newErrors.credit_score = "Credit score must be between 300 and 850.";
    }

    if (formData.loan_amount <= 0) {
      newErrors.loan_amount = "Loan amount must be positive.";
    }

    if (formData.property_value <= 0) {
      newErrors.property_value = "Property value must be positive.";
    }

    if (formData.annual_income <= 0) {
      newErrors.annual_income = "Annual income must be positive.";
    }

    if (formData.debt_amount < 0) {
      newErrors.debt_amount = "Debt amount cannot be negative.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://127.0.0.1:8000/api/mortgage/add/", formData);
      navigate("/");
    } catch (err) {
      setErrors({ form: "Error submitting mortgage data. Please check inputs." });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add Mortgage</h2>
      <form className="p-4 border rounded shadow bg-light" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Credit Score(between 300 and 850)</label>
          <input
            type="number"
            className={`form-control ${errors.credit_score ? "is-invalid" : ""}`}
            name="credit_score"
            value={formData.credit_score}
            onChange={handleChange}
            required
          />
          {errors.credit_score && <div className="invalid-feedback">{errors.credit_score}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Loan Amount</label>
          <input
            type="number"
            className={`form-control ${errors.loan_amount ? "is-invalid": ""}`}
            name="loan_amount"
            value={formData.loan_amount}
            onChange={handleChange}
            required
          />
          {errors.loan_amount && <div className="invalid-feedback">{errors.loan_amount}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Property Value</label>
          <input
            type="number"
            className={`form-control ${errors.property_value ? "is-invalid" : ""}`}
            name="property_value"
            value={formData.property_value}
            onChange={handleChange}
            required
          />
          {errors.property_value && <div className="invalid-feedback">{errors.property_value}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Annual Income </label>
          <input
            type="number"
            className={`form-control ${errors.annual_income ? "is-invalid" : ""}`}
            name="annual_income"
            value={formData.annual_income}
            onChange={handleChange}
            required
          />
          {errors.annual_income && <div className="invalid-feedback">{errors.annual_income}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Debt Amount</label>
          <input
            type="number"
            className={`form-control ${errors.debt_amount ? "is-invalid" : ""}`}
            name="debt_amount"
            value={formData.debt_amount}
            onChange={handleChange}
            required
          />
          {errors.debt_amount && <div className="invalid-feedback">{errors.debt_amount}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Loan Type</label>
          <select className="form-select" name="loan_type" value={formData.loan_type} onChange={handleChange}>
            <option value="fixed" >Fixed</option>
            <option value="adjustable">Adjustable </option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Property Type</label>
          <select className="form-select" name="property_type" value={formData.property_type} 
          onChange={handleChange}>
            <option value="single_family">Single Family</option>
            <option value="condo">Condo</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary me-2">Add Mortgage</button>
        <button type="button" className="btn btn-danger" onClick={() => navigate("/")}>Cancel</button>
      </form>
    </div>
  );
}

export default MortgageForm;
