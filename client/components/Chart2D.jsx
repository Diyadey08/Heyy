import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Line,
  Bar,
  Pie,
  Scatter,
} from "react-chartjs-2";
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Register necessary chart components
ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export default function Chart2D({ data, xKey, yKey }) {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState("line");

  const chartData = {
    labels: data.map((d) => d[xKey]),
    datasets: [
      {
        label: `${yKey} vs ${xKey}`,
        data: data.map((d, i) =>
          chartType === "scatter"
            ? { x: d[xKey], y: d[yKey] }
            : d[yKey]
        ),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "blue",
        borderWidth: 2,
        fill: chartType === "line" ? false : true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: chartType === "pie" ? {} : {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  const handleDownload = async (type) => {
    const element = chartRef.current;

    const canvas = await html2canvas(element, {
      useCORS: true,
      backgroundColor: "#fff",
    });

    const imageData = canvas.toDataURL("image/png");

    if (type === "png") {
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `${xKey}_vs_${yKey}_${chartType}.png`;
      link.click();
    } else if (type === "pdf") {
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imageData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${xKey}_vs_${yKey}_${chartType}.pdf`);
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <Bar data={chartData} options={chartOptions} />;
      case "pie":
        return <Pie data={chartData} options={chartOptions} />;
      case "scatter":
        return <Scatter data={chartData} options={chartOptions} />;
      default:
        return <Line data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div>
      <div>
        <label>Select Chart Type: </label>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
          <option value="scatter">Scatter</option>
        </select>
      </div>

      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: "500px",
          marginTop: "20px",
        }}
      >
        {renderChart()}
      </div>

      <button onClick={() => handleDownload("png")}>Download PNG</button>
      <button onClick={() => handleDownload("pdf")}>Download PDF</button>
    </div>
  );
}
