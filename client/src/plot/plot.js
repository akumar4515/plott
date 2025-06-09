import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bar, Donut, Line, Pie, Scatter } from "./graph/graph";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import "../css/main.css";
import logo from "../assets/logo.png"; // Import the logo

export const Plot = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [plotOption, setPlotOption] = useState("bar");
  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [xData, setXData] = useState([]);
  const [yData, setYData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chartContainerRef = useRef(null);

  const chartTypes = ["bar", "pie", "scatter", "line", "donut"];

  const chartComponents = {
    bar: <Bar xArray={xData} yArray={yData} />,
    pie: <Pie xArray={xData} yArray={yData} />,
    scatter: <Scatter xArray={xData} yArray={yData} />,
    line: <Line xArray={xData} yArray={yData} />,
    donut: <Donut xArray={xData} yArray={yData} />,
  };

  useEffect(() => {
    if (data.length > 0 && xCol && yCol) {
      const newX = data.map((item) => item[xCol] ?? "");
      const newY = data.map((item) => Number(item[yCol]) || 0);
      setXData(newX);
      setYData(newY);
    }
  }, [data, xCol, yCol]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target.result;

      if (file.name.endsWith(".xlsx")) {
        const workbook = XLSX.read(result, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        processData(jsonData);
      } else if (file.name.endsWith(".csv")) {
        Papa.parse(result, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error("Errors during parsing:", results.errors);
            }
            processData(results.data);
          },
        });
      }
    };

    if (file.name.endsWith(".xlsx")) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const processData = (parsedData) => {
    if (parsedData.length === 0) {
      alert("Empty or invalid file");
      setIsLoading(false);
      return;
    }

    const cols = Object.keys(parsedData[0]);
    setData(parsedData);
    setColumns(cols);
    setXCol(cols[0]);
    setYCol(cols[1] || cols[0]);
    setFileUploaded(true);
    setIsLoading(false);
  };

  const handleDownload = () => {
    const canvas = chartContainerRef.current.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `graphix-${plotOption}-chart.png`;
      link.click();
    } else {
      alert("No chart available to download.");
    }
  };

  return (
    <div className="main-container">
      {/* Header */}
      <header className="header animate-slide-in">
        <div className="container header-content">
          <div className="header-logo-title">
            <img src={logo} alt="Graphix Logo" className="header-logo" />
            <h1 className="header-title">Graphix</h1>
          </div>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
          </nav>
        </div>
      </header>

      {/* Plotting Section */}
      <section className="plot-section animate-fade-in">
        <div className="container">
          <h2 className="section-title animate-scale-in">Plot Your Data</h2>
          <div className="upload-container">
            <label htmlFor="file-upload" className="custom-file-upload animate-pulse">
              Upload CSV or Excel File
            </label>
            <input
              id="file-upload"
              className="file-input"
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileUpload}
            />
            {!fileUploaded && !isLoading && (
              <p className="file-message animate-fade-in-delay">No File Selected</p>
            )}
            {isLoading && <div className="spinner animate-spin"></div>}
          </div>

          {fileUploaded && (
            <div className="plot-container animate-slide-up">
              <div className="control-container">
                <div className="form-group animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <label className="form-label">Chart Type</label>
                  <select
                    className="form-select"
                    value={plotOption}
                    onChange={(e) => setPlotOption(e.target.value)}
                  >
                    {chartTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <label className="form-label">X-Axis</label>
                  <select
                    className="form-select"
                    value={xCol}
                    onChange={(e) => setXCol(e.target.value)}
                  >
                    {columns.map((col, index) => (
                      <option key={index} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <label className="form-label">Y-Axis</label>
                  <select
                    className="form-select"
                    value={yCol}
                    onChange={(e) => setYCol(e.target.value)}
                  >
                    {columns.map((col, index) => (
                      <option key={index} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="chart-container animate-scale-in" ref={chartContainerRef}>
                {chartComponents[plotOption]}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer animate-fade-in">
        <div className="container">
          <span className="footer-text">Graphix</span>
          <span className="footer-text">2023</span>
        </div>
      </footer>
    </div>
  );
};