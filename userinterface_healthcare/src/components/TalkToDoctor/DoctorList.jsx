import { useEffect, useState } from "react";
import { DoctorAPI } from "./doctorApi";
import DoctorCard from "./DoctorCard";
import DoctorDetails from "./DoctorDetails";
import "./css/doctorList.css";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    const res = await DoctorAPI.searchDoctors({ search, page });
    setDoctors(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, [search, page]);

  return (
    <div className="doctor-page">
      <input
        className="search-box"
        placeholder="Search doctor or specialization"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading...</p>}

      {!selectedDoctorId && doctors.map((d) => (
        <DoctorCard
          key={d.doctorId}
          doctor={d}
          onSelect={setSelectedDoctorId}
        />
      ))}

      {selectedDoctorId && (
        <DoctorDetails
          doctorId={selectedDoctorId}
          onBack={() => setSelectedDoctorId(null)}
        />
      )}
    </div>
  );
}
