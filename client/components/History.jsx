import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export default function History() {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/user-history", {
        withCredentials: true,
      })
      .then((res) => {
        setCharts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching chart history:", err);
      });
  }, []);

  return (
    <div>
      <h2>Your Charts</h2>
      <ul>
        {charts && charts.map((chart) => (
          <li key={chart._id}>
            {chart.chartType}: {chart.xKey} vs {chart.yKey} (from {chart.uploadId?.fileName})
          </li>
        ))}
      </ul>
    </div>
  );
}
