// src/components/onboarding/jsx_files/BankDetailsForm.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HospitalAPI } from "../../../services/api";
import "../css/BankDetailsForm.css";

const BankDetailsForm = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    bank_holder_name: "",
    bank_name: "",
    account_no: "",
    ifsc_code: "",
    branch_name: "",
    passbook_image: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem("bankDetails");
    const savedPassbook = localStorage.getItem("passbookFile");

    if (saved) {
      setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }));
    }

    if (savedPassbook) {
      setFormData((prev) => ({ ...prev, passbook_image: savedPassbook }));
    }
  }, []);

  // ---------------- INPUT CHANGE ----------------
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (["bank_holder_name", "bank_name", "branch_name"].includes(name)) {
      value = value.replace(/[^A-Za-z ]/g, "");
    }

    if (name === "account_no") {
      value = value.replace(/\D/g, "").slice(0, 18);
    }

    if (name === "ifsc_code") {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // ---------------- FILE UPLOAD ----------------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return setErrors({ passbook_image: "Only image files allowed!" });
    }

    if (file.size > 2 * 1024 * 1024) {
      return setErrors({ passbook_image: "Max 2MB allowed!" });
    }

    setFormData({ ...formData, passbook_image: file });
    setErrors({ ...errors, passbook_image: "" });
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const err = {};

    if (!formData.bank_holder_name.trim())
      err.bank_holder_name = "Account holder name is required";

    if (!formData.bank_name.trim())
      err.bank_name = "Bank name is required";

    if (!formData.account_no)
      err.account_no = "Account number is required";
    else if (formData.account_no.length < 10)
      err.account_no = "Minimum 10 digits required";

    if (!formData.ifsc_code)
      err.ifsc_code = "IFSC code required";
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code))
      err.ifsc_code = "Invalid IFSC (Ex: SBIN0001234)";

    if (!formData.branch_name.trim())
      err.branch_name = "Branch name required";

    if (!formData.passbook_image)
      err.passbook_image = "Upload passbook/cheque image";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const id = localStorage.getItem("hospitalId");

    if (!id) {
      alert("Hospital ID missing. Login must save hospitalId.");
      return;
    }

    try {
      // ---- FINAL PAYLOAD  ----
      const bankPayload = {
        bank_holder_name: formData.bank_holder_name,
        bank_name: formData.bank_name,
        account_no: formData.account_no,
        ifsc_code: formData.ifsc_code,
        branch_name: formData.branch_name,
        verificationLevel: "2",

      };

      const response1 = await HospitalAPI.updateBankDetails(id, bankPayload);

      // -- PASSBOOK FILE --
      if (formData.passbook_image instanceof File) {
        await HospitalAPI.uploadPassbook(id, formData.passbook_image);
      }

      // ⭐ USER HAS COMPLETED BANK FORM
      localStorage.setItem("bankCompleted", "true");

      // Optional clean up
      localStorage.setItem("verificationLevel", "2");

      alert("Bank details submitted successfully!");
      navigate("/login");



    } catch (error) {
      if (error.response) {
        alert(
          "Backend Error:\n\n" +
          JSON.stringify(error.response.data, null, 2)
        );
      } else {
        alert("Network error — API not reachable.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Bank Details</h2>

      <form onSubmit={handleSubmit}>

        {/* Row 1 */}
        <div className="flex-row">
          <div className="form-group">
            <label>Account Holder Name *</label>
            <input
              type="text"
              name="bank_holder_name"
              value={formData.bank_holder_name}
              onChange={handleChange}
            />
            {errors.bank_holder_name && <p className="error">{errors.bank_holder_name}</p>}
          </div>

          <div className="form-group">
            <label>Bank Name *</label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
            />
            {errors.bank_name && <p className="error">{errors.bank_name}</p>}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex-row">
          <div className="form-group">
            <label>Account Number *</label>
            <input
              type="text"
              name="account_no"
              value={formData.account_no}
              onChange={handleChange}
            />
            {errors.account_no && <p className="error">{errors.account_no}</p>}
          </div>

          <div className="form-group">
            <label>IFSC Code *</label>
            <input
              type="text"
              name="ifsc_code"
              value={formData.ifsc_code}
              onChange={handleChange}
            />
            {errors.ifsc_code && <p className="error">{errors.ifsc_code}</p>}
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex-row">
          <div className="form-group">
            <label>Branch Name *</label>
            <input
              type="text"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleChange}
            />
            {errors.branch_name && <p className="error">{errors.branch_name}</p>}
          </div>
        </div>

        {/* Passbook */}
        <div className="form-group">
          <label>Upload Passbook / Cheque *</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {errors.passbook_image && <p className="error">{errors.passbook_image}</p>}
        </div>

        {/* Submit */}
        <div className="button-row">
          <button type="submit" className="outline-btn">
            Submit & Continue ➜
          </button>
        </div>

      </form>
    </div>
  );
};

export default BankDetailsForm;
