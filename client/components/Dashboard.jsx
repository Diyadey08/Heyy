import { useEffect, useState } from "react";

export default function Dashboard() {
  const [uploads, setUploads] = useState([]);
  const [History, setHistory] = useState([]);
useEffect(() => {
  const fetchHistory = async () => {
    const res = await fetch("http://localhost:3000/user/history", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const json = await res.json();
    setHistory(json);
  };

  fetchHistory();
}, []);


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📂 Upload History</h2>

      <p>Total uploads: {uploads.length}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {uploads.map((upload) => (
          <div key={upload._id} className="p-4 border rounded shadow">
            <h3 className="font-semibold">{upload.fileName}</h3>
            <p className="text-sm text-gray-600">
              Uploaded: {new Date(upload.uploadedAt).toLocaleString()}
            </p>
            <p className="text-sm">Size: {upload.sizeKB} KB</p>
          </div>
        ))}
      </div>
    </div>
  );
}
