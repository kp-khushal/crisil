import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MortgageList() {
  const [mortgages, setMortgages] = useState([]);
  const [selectedMortgage, setSelectedMortgage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(""); // "success" or "danger"
  const navigate = useNavigate();

  // Fetch mortgage list from API
  const fetchMortgages = useCallback(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/mortgage/list/");
      setMortgages(response.data);
    } catch (error) {
      showAlert("Error fetching mortgages", "danger");
    }
  }, []);

  useEffect(() => {
    fetchMortgages();
  }, [fetchMortgages]);

  // Delete a mortgage
  const handleDelete = async () => {
    if (!selectedMortgage) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/mortgage/delete/${selectedMortgage.id}/`);
      showAlert("Mortgage deleted successfully!", "success");
      setShowModal(false);
      fetchMortgages(); // Refresh the list
    } catch (error) {
      showAlert("Error deleting mortgage", "danger");
    }
  };

  // Show alert message
  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Residential Mortgage Securities (RMBS) Credit Rating</h2>

      {/* Alert Messages */}
      {alertMessage && (
        <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
          {alertMessage}
        </div>
      )}

      <button className="btn btn-primary mb-3" onClick={() => navigate("/add")}>
        Add New Mortgage
      </button>

      {/* Responsive Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Credit Score</th>
              <th>Loan Amount</th>
              <th>Property Value</th>
              <th>Annual Income</th>
              <th>Debt Amount</th>
              <th>Loan Type</th>
              <th>Property Type</th>
              <th>Credit Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mortgages.length > 0 ? (
              mortgages.map((mortgage) => (
                <tr key={mortgage.id}>
                  <td>{mortgage.credit_score}</td>
                  <td>{mortgage.loan_amount}</td>
                  <td>{mortgage.property_value}</td>
                  <td>{mortgage.annual_income}</td>
                  <td>{mortgage.debt_amount}</td>
                  <td>{mortgage.loan_type}</td>
                  <td>{mortgage.property_type}</td>
                  <td>{mortgage.credit_rating}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => navigate(`/edit/${mortgage.id}`)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => { setSelectedMortgage(mortgage); setShowModal(true); }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="text-center">No mortgages found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure to delete this mortgage?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default MortgageList;
