import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditMortgage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mortgage, setMortgage] = useState({
    credit_score: "",
    loan_amount: "",
    property_value: "",
    annual_income: "",
    debt_amount: "",
    loan_type: "fixed",
    property_type: "single_family",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMortgage = async () => {
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/mortgage/edit/${id}/`);
        setMortgage(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch mortgage details.");
      }
    };

    if (id) fetchMortgage();
  }, [id]);

  const handleChange = (e) => {
    setMortgage({ ...mortgage, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/mortgage/edit/${id}/`, mortgage);
      alert("Mortgage updated successfully!");
      navigate("/");
    } catch (err) {
      alert("Error updating mortgage. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading mortgage details...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Edit RMBS</h2>
      <form className="p-4 border rounded shadow bg-light" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Credit Score (between 300 and 850)</label>
          <input type="number" className="form-control" name="credit_score" value={mortgage.credit_score} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Loan Amount</label>
          <input type="number" className="form-control" name="loan_amount" value={mortgage.loan_amount} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Property Value</label>
          <input type="number" className="form-control" name="property_value" value={mortgage.property_value} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Annual Income</label>
          <input type="number" className="form-control" name="annual_income" value={mortgage.annual_income} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Debt Amount</label>
          <input type="number" className="form-control" name="debt_amount" value={mortgage.debt_amount} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Loan Type</label>
          <select className="form-select" name="loan_type" value={mortgage.loan_type} onChange={handleChange}>
            <option value="fixed">Fixed</option>
            <option value="adjustable">Adjustable</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Property Type</label>
          <select className="form-select" name="property_type" value={mortgage.property_type} onChange={handleChange}>
            <option value="single_family">Single Family</option>
            <option value="condo">Condo</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary me-2">Update Mortgage</button>
        <button type="button" className="btn btn-danger" onClick={() => navigate("/")}>Cancel</button>
      </form>
    </div>
  );
}

export default EditMortgage;
