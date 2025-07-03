import { useState } from "react";
import Chart2D from "../components/Chart2D";
import Chart3D from "../components/Chart3D";
import React from "react";

export default function Home() {
  const [sheets, setSheets] = useState({});
  const [selectedSheet, setSelectedSheet] = useState("");
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("excel", file);

     const token = localStorage.getItem("token"); // ✅ Get token
  form.append("token", token); // ✅ Send token in body

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: form,
         credentials: "include", // ✅ Send cookies!
      });
if (!res.ok) {
      const errorText = await res.text(); // get raw text error
      console.error("Upload failed:", res.status, errorText);
      alert(`Upload failed: ${res.status}`);
      return;
    }
        const json = await res.json();
      setSheets(json.sheets);
      setSelectedSheet("");
      setXKey("");
      setYKey("");
    } catch {
      console.error("Upload error", err);
      alert("Upload failed: Check file or server");
    }
  
  };

  const currentData = sheets?.[selectedSheet] || [];
  let keys = [];
if (Array.isArray(currentData) && currentData.length > 0 && currentData[0] !== null) {
  try {
    keys = Object.keys(currentData[0]);
  } catch (err) {
    console.error("Error getting keys from sheet row:", err);
    keys = [];
  }
}

  const previewData = currentData.slice(0, 5);

  return (
    <div className="p-4 space-y-4">
      <input
        type="file"
        onChange={handleUpload}
        accept=".xls,.xlsx"
        className="border p-2"
      />

      {Object.keys(sheets).length > 0 && (
        <>
          <div className="flex flex-wrap gap-4">
            <select
              onChange={(e) => setSelectedSheet(e.target.value)}
              className="border p-2"
              value={selectedSheet}
            >
              <option value="">Select Sheet</option>
              {Object.keys(sheets).map((sheet) => (
                <option key={sheet} value={sheet}>
                  {sheet}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => setXKey(e.target.value)}
              className="border p-2"
              value={xKey}
              disabled={!selectedSheet}
            >
              <option value="">Select X</option>
              {keys.map((key) => (
                <option key={key}>{key}</option>
              ))}
            </select>

            <select
              onChange={(e) => setYKey(e.target.value)}
              className="border p-2"
              value={yKey}
              disabled={!selectedSheet}
            >
              <option value="">Select Y</option>
              {keys.map((key) => (
                <option key={key}>{key}</option>
              ))}
            </select>
          </div>

          {selectedSheet && (
            <>
              <h2 className="mt-6 text-lg font-semibold">📋 Sheet Preview</h2>
              <div className="overflow-auto border rounded-md max-w-full">
                <table className="min-w-[400px] border-collapse w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      {keys.slice(0, 5).map((key) => (
                        <th key={key} className="border px-2 py-1">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="odd:bg-white even:bg-gray-50">
                        {keys.slice(0, 5).map((key) => (
                          <td key={key} className="border px-2 py-1">
                            {row[key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {xKey && yKey && (
            <>
              <h2 className="mt-6 text-lg font-semibold">📊 2D Chart</h2>
              <Chart2D data={currentData} xKey={xKey} yKey={yKey} />

              <h2 className="mt-6 text-lg font-semibold">🌀 3D Chart</h2>
              <Chart3D data={currentData} xKey={xKey} yKey={yKey} />
            </>
          )}
        </>
      )}
    </div>
  );
}
