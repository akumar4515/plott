import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bar, Donut, Line, Pie, Scatter } from "./graph/graph";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import html2canvas from "html2canvas";
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
  const [topN, setTopN] = useState("");
  const [bottomN, setBottomN] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const chartContainerRef = useRef(null);
  const chartWrapperRef = useRef(null);

  const chartTypes = ["all","bar", "pie", "scatter", "line", "donut"];

  const chartComponents = {
      all: (
    <div className="all-charts-grid">
      <div className="chart-item">
        <Bar xArray={xData} yArray={yData} />
      </div>
      <div className="chart-item">
        <Pie xArray={xData} yArray={yData} />
      </div>
      <div className="chart-item">
        <Scatter xArray={xData} yArray={yData} />
      </div>
      <div className="chart-item">
        <Line xArray={xData} yArray={yData} />
      </div>
      <div className="chart-item">
        <Donut xArray={xData} yArray={yData} />
      </div>
    </div>
  ),
    bar: <Bar xArray={xData} yArray={yData} />,
    pie: <Pie xArray={xData} yArray={yData} />,
    scatter: <Scatter xArray={xData} yArray={yData} />,
    line: <Line xArray={xData} yArray={yData} />,
    donut: <Donut xArray={xData} yArray={yData} />,
  };

  useEffect(() => {
    if (data.length > 0 && xCol && yCol) {
      // Create array of objects with x and y values for easier manipulation
      let dataPairs = data.map((item, index) => ({
        x: item[xCol] ?? "",
        y: Number(item[yCol]) || 0,
        originalIndex: index
      }));

      // Apply search filter first (filter by X-axis values)
      if (searchTerm && searchTerm.trim() !== "") {
        const searchLower = searchTerm.toLowerCase().trim();
        dataPairs = dataPairs.filter(pair => 
          String(pair.x).toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      if (sortOrder) {
        switch(sortOrder) {
          case "ascending":
            dataPairs.sort((a, b) => a.y - b.y);
            break;
          case "descending":
            dataPairs.sort((a, b) => b.y - a.y);
            break;
          case "a-z":
            dataPairs.sort((a, b) => String(a.x).localeCompare(String(b.x)));
            break;
          case "z-a":
            dataPairs.sort((a, b) => String(b.x).localeCompare(String(a.x)));
            break;
          default:
            break;
        }
      }

      // Extract arrays after sorting
      let newX = dataPairs.map(pair => pair.x);
      let newY = dataPairs.map(pair => pair.y);

      // Filter by top N if a number is provided
      if (topN && !isNaN(topN) && Number(topN) > 0) {
        const limit = Math.min(Number(topN), newX.length);
        newX = newX.slice(0, limit);
        newY = newY.slice(0, limit);
      }
      // Filter by bottom N if a number is provided (and topN is not set)
      else if (bottomN && !isNaN(bottomN) && Number(bottomN) > 0) {
        const limit = Math.min(Number(bottomN), newX.length);
        newX = newX.slice(-limit);
        newY = newY.slice(-limit);
      }
      
      setXData(newX);
      setYData(newY);
    }
  }, [data, xCol, yCol, topN, bottomN, sortOrder, searchTerm]);

  
  const processData = useCallback((parsedData) => {
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
  },[]);


  const handleFileUpload = useCallback((event) => {
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
  },[processData]);

  const loadTestData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/employee.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("Errors during parsing:", results.errors);
          }
          processData(results.data);
        },
      });
    } catch (error) {
      console.error("Error loading test data:", error);
      alert("Failed to load test data. Please try uploading a file manually.");
      setIsLoading(false);
    }
  }, [processData]);

  const captureChart = useCallback(async () => {
    if (!chartWrapperRef.current) return;
    
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(chartWrapperRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: chartWrapperRef.current.scrollWidth,
        windowHeight: chartWrapperRef.current.scrollHeight,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `chart-${plotOption}-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Error capturing chart:", error);
      alert("Failed to capture chart. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  }, [plotOption]);

  return (
    <div className="main-container">
      {/* Header */}
      <header className="header animate-slide-in">
        <div className="container header-content">
          <div className="header-logo-title">
            <Link to="/" className="header-logo-title">
            <img src={logo} alt="Graphix Logo" className="header-logo" />
            <h1 className="header-title">Graphix</h1>
            </Link>
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
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              <label htmlFor="file-upload" className="custom-file-upload animate-pulse">
                Upload CSV or Excel File
              </label>
              <button 
                onClick={loadTestData} 
                className="test-data-button"
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = '#059669';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = '#10b981';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isLoading ? 'Loading...' : 'Load Employee Test Data'}
              </button>
            </div>
            <input
              id="file-upload"
              className="file-input"
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileUpload}
            />
            {!fileUploaded && !isLoading && (
              <p className="file-message animate-fade-in-delay">No File Selected - Upload a file or click "Load Employee Test Data"</p>
            )}
            {isLoading && <div className="spinner animate-spin"></div>}
          </div>
        </div>

        {fileUploaded && (
          <div className="plot-wrapper-full animate-slide-up">
            {/* Controls Bar at Top */}
            <div className="controls-bar">
              <div className="controls-bar-content">
                <div className="controls-group">
                  <h3 className="controls-bar-title">Chart Controls</h3>
                  <button 
                    onClick={captureChart}
                    className="capture-button"
                    disabled={isCapturing}
                    title="Download chart as image"
                  >
                    {isCapturing ? (
                      <>
                        <span className="spinner-small"></span> Capturing...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Capture
                      </>
                    )}
                  </button>
                </div>

                <div className="controls-group">
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

                <div className="controls-group">
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

                <div className="controls-group">
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

                <div className="controls-group">
                  <label className="form-label">Sort Order</label>
                  <select
                    className="form-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="">No Sort</option>
                    <option value="ascending">Ascending (Y-axis)</option>
                    <option value="descending">Descending (Y-axis)</option>
                    <option value="a-z">A-Z (X-axis)</option>
                    <option value="z-a">Z-A (X-axis)</option>
                  </select>
                </div>

                <div className="controls-group">
                  <label className="form-label">Search {xCol ? `(${xCol})` : '(X-Axis)'}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={`Search...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="controls-group">
                  <label className="form-label">Top N</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="N"
                    value={topN}
                    onChange={(e) => {
                      setTopN(e.target.value);
                      if (e.target.value) setBottomN("");
                    }}
                    min="1"
                  />
                </div>

                <div className="controls-group">
                  <label className="form-label">Bottom N</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="N"
                    value={bottomN}
                    onChange={(e) => {
                      setBottomN(e.target.value);
                      if (e.target.value) setTopN("");
                    }}
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Chart Area Below */}
            <div className="chart-area" ref={chartWrapperRef}>
              <div className="chart-container animate-scale-in" ref={chartContainerRef}>
                {chartComponents[plotOption]}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer animate-fade-in">
        <div className="container">
          <span className="footer-text">Graphix</span>
          <span className="footer-text">2024</span>
        </div>
      </footer>
    </div>
  );
};