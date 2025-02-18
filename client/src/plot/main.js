import React, { useState, useEffect } from "react";
import { Bar, Donut, Line, Pie, Scatter } from "./graph/graph";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import '../css/main.css';

export const Main = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [plotOption, setPlotOption] = useState('bar');
    const [xCol, setXCol] = useState('');
    const [yCol, setYCol] = useState('');
    const [xData, setXData] = useState([]);
    const [yData, setYData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);

    const chartTypes = ['bar', 'pie', 'scatter', 'line', 'donut'];

    const chartComponents = {
        bar: <Bar xArray={xData} yArray={yData} />,
        pie: <Pie xArray={xData} yArray={yData} />,
        scatter: <Scatter xArray={xData} yArray={yData} />,
        line: <Line xArray={xData} yArray={yData} />,
        donut: <Donut xArray={xData} yArray={yData} />,
    };

    useEffect(() => {
        if (data.length > 0 && xCol && yCol) {
            const newX = data.map(item => item[xCol] ?? '');
            const newY = data.map(item => Number(item[yCol]) || 0);
            setXData(newX);
            setYData(newY);
        }
    }, [data, xCol, yCol]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const result = e.target.result;

            if (file.name.endsWith('.xlsx')) {
                // Handle Excel files
                const workbook = XLSX.read(result, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                processData(jsonData);
            } else if (file.name.endsWith('.csv')) {
                // Handle CSV files
                Papa.parse(result, {
                    header: true,
                    dynamicTyping: true,
                    complete: (results) => {
                        console.log("Parsed CSV Data:", results); // Log parsed data
                        if (results.errors.length > 0) {
                            console.error("Errors during parsing:", results.errors);
                        }
                        processData(results.data);
                    }
                });
            }
        };

        if (file.name.endsWith('.xlsx')) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    };

    const processData = (parsedData) => {
        if (parsedData.length === 0) {
            alert('Empty or invalid file');
            return;
        }

        console.log("Processed Data:", parsedData); // Log processed data

        const cols = Object.keys(parsedData[0]);
        setData(parsedData);
        setColumns(cols);
        setXCol(cols[0]);
        setYCol(cols[1] || cols[0]);
        setFileUploaded(true);
    };

    return (
        <div className="main">
            <div className="head">
                 <h3>Web.Graph</h3>
            </div>
            {/* File Upload Input */}
            <div className="upload-container">
    <label htmlFor="file-upload" className="custom-file-upload">
        Choose File
    </label>
    <input
        id="file-upload"
        className="fileIn"
        type="file"
        accept=".csv, .xlsx"
        onChange={handleFileUpload}
    />
    {!fileUploaded &&(
        <p className="fmsg">No File Selected</p>

    )}
</div>

            {fileUploaded && (
                <div className="container-plot">
                    {/* Controls Section */}
                    <div className="container-control">
                        <div className="form-group">
                            <label>Chart Type:</label>
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

                       
                            <div className="form-group">
                                <label>X-Axis:</label>
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

                            <div className="form-group">
                                <label>Y-Axis:</label>
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

                    {/* Chart Display */}
                    <div className="chart-container">
                        {chartComponents[plotOption]}
                    </div>
                </div>
            )}

            <footer className="app-footer">
                <span>web.aix</span>
                <span>2023-2024</span>
            </footer>
        </div>
    );
};