import React from "react";
import Plot from 'react-plotly.js';
import '../../css/main.css';

// Modern color palette
const colors = {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    gradient: ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'],
    background: '#ffffff',
    grid: '#e5e7eb',
    text: '#111827',
    textSecondary: '#6b7280'
};

// Common layout configuration
const baseLayout = {
    font: {
        family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        size: 12,
        color: colors.text
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { l: 60, r: 40, t: 80, b: 60 },
    hovermode: 'closest',
    showlegend: true,
    legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: -0.2,
        xanchor: 'center',
        x: 0.5,
        font: { size: 11, color: colors.textSecondary }
    }
};

export const Bar = React.memo(({ xArray, yArray }) => {
    // Validate and filter data
    const validData = xArray && yArray && xArray.length > 0 && yArray.length > 0
        ? xArray.map((x, i) => ({ x, y: Number(yArray[i]) || 0 }))
            .filter(item => item.x !== null && item.x !== undefined && item.x !== '')
        : [];

    const data = [{
        x: validData.map(d => d.x),
        y: validData.map(d => d.y),
        type: "bar",
        marker: {
            color: colors.gradient[0],
            line: {
                color: colors.primary,
                width: 1.5
            },
            opacity: 0.9
        },
        text: validData.map(d => d.y),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Value: %{y}<extra></extra>',
        name: 'Data'
    }];

    const layout = {
        ...baseLayout,
        autosize: true,
        title: {
            text: 'Bar Chart',
            font: { size: 24, color: colors.text, family: baseLayout.font.family },
            x: 0.5,
            xanchor: 'center',
            y: 0.95,
            yanchor: 'top'
        },
        xaxis: {
            title: {
                text: 'Category',
                font: { size: 14, color: colors.text, family: baseLayout.font.family }
            },
            gridcolor: colors.grid,
            gridwidth: 1,
            showgrid: true,
            zeroline: false,
            linecolor: colors.textSecondary,
            linewidth: 1
        },
        yaxis: {
            title: {
                text: 'Value',
                font: { size: 14, color: colors.text, family: baseLayout.font.family }
            },
            gridcolor: colors.grid,
            gridwidth: 1,
            showgrid: true,
            zeroline: true,
            zerolinecolor: colors.textSecondary,
            zerolinewidth: 1,
            linecolor: colors.textSecondary,
            linewidth: 1
        }
    };

    if (validData.length === 0) {
        return (
            <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: colors.textSecondary }}>No data available</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Plot 
                data={data} 
                layout={layout}
                config={{
                    displayModeBar: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                    responsive: true
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
            />
        </div>
    );
});

export const Scatter = React.memo(({ xArray, yArray }) => {
    // Validate and filter data
    const validData = xArray && yArray && xArray.length > 0 && yArray.length > 0
        ? xArray.map((x, i) => ({ x, y: Number(yArray[i]) || 0 }))
            .filter(item => item.x !== null && item.x !== undefined && item.x !== '' && !isNaN(item.y))
        : [];

    const data = [{
        x: validData.map(d => d.x),
        y: validData.map(d => d.y),
        type: "scatter",
        mode: 'markers+lines',
        marker: {
            size: 10,
            color: colors.gradient[1],
            line: {
                color: colors.secondary,
                width: 2
            },
            opacity: 0.8
        },
        line: {
            color: colors.secondary,
            width: 2,
            dash: 'solid'
        },
        hovertemplate: '<b>X:</b> %{x}<br><b>Y:</b> %{y}<extra></extra>',
        name: 'Data Points'
    }];

    const layout = {
        ...baseLayout,
        autosize: true,
        title: {
            text: 'Scatter Chart',
            font: { size: 24, color: colors.text, family: baseLayout.font.family },
            x: 0.5,
            xanchor: 'center',
            y: 0.95,
            yanchor: 'top'
        },
        xaxis: {
            title: {
                text: 'X-Axis',
                font: { size: 14, color: colors.text, family: baseLayout.font.family }
            },
            gridcolor: colors.grid,
            gridwidth: 1,
            showgrid: true,
            zeroline: false,
            linecolor: colors.textSecondary,
            linewidth: 1
        },
        yaxis: {
            title: {
                text: 'Y-Axis',
                font: { size: 14, color: colors.text, family: baseLayout.font.family }
            },
            gridcolor: colors.grid,
            gridwidth: 1,
            showgrid: true,
            zeroline: true,
            zerolinecolor: colors.textSecondary,
            zerolinewidth: 1,
            linecolor: colors.textSecondary,
            linewidth: 1
        }
    };

    if (validData.length === 0) {
        return (
            <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: colors.textSecondary }}>No data available</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Plot 
                data={data} 
                layout={layout}
                config={{
                    displayModeBar: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                    responsive: true
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
            />
        </div>
    );
});

export const Pie = React.memo(({ xArray, yArray }) => {
    // Validate and filter data - for pie charts, yArray should be numeric values
    const validData = xArray && yArray && xArray.length > 0 && yArray.length > 0
        ? xArray.map((label, i) => ({
            label: label || `Item ${i + 1}`,
            value: Number(yArray[i]) || 0
        }))
            .filter(item => item.value > 0 && item.label)
        : [];

    const data = [{
        values: validData.map(d => d.value),
        labels: validData.map(d => d.label),
        type: "pie",
        hole: 0,
        marker: {
            colors: colors.gradient,
            line: {
                color: colors.background,
                width: 2
            }
        },
        textinfo: 'label+percent',
        textposition: 'outside',
        hovertemplate: '<b>%{label}</b><br>Value: %{value}<br>Percentage: %{percent}<extra></extra>',
        name: 'Distribution'
    }];

    const layout = {
        ...baseLayout,
        autosize: true,
        title: {
            text: 'Pie Chart',
            font: { size: 24, color: colors.text, family: baseLayout.font.family },
            x: 0.5,
            xanchor: 'center',
            y: 0.95,
            yanchor: 'top'
        },
        showlegend: true,
        legend: {
            orientation: 'v',
            yanchor: 'middle',
            y: 0.5,
            xanchor: 'left',
            x: 1.05,
            font: { size: 11, color: colors.textSecondary }
        }
    };

    if (validData.length === 0) {
        return (
            <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: colors.textSecondary }}>No data available</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Plot 
                data={data} 
                layout={layout}
                config={{
                    displayModeBar: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                    responsive: true
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
            />
        </div>
    );
});

export const Line = React.memo(({ xArray, yArray }) => {
    // Validate and filter data
    const validData = xArray && yArray && xArray.length > 0 && yArray.length > 0
        ? xArray.map((x, i) => ({ x, y: Number(yArray[i]) || 0 }))
            .filter(item => item.x !== null && item.x !== undefined && item.x !== '' && !isNaN(item.y))
        : [];

    const data = [{
        x: validData.map(d => d.x),
        y: validData.map(d => d.y),
        type: "scatter",
        mode: 'lines+markers',
        marker: {
            size: 8,
            color: colors.gradient[2],
            line: {
                color: colors.accent,
                width: 1.5
            }
        },
        line: {
            color: colors.gradient[2],
            width: 3,
            shape: 'spline',
            smoothing: 1.3
        },
        fill: 'tozeroy',
        fillcolor: `rgba(16, 185, 129, 0.1)`,
        hovertemplate: '<b>%{x}</b><br>Value: %{y}<extra></extra>',
        name: 'Trend'
    }];

    const layout = {
        ...baseLayout,
        autosize: true,
        title: {
            text: 'Line Chart',
            font: { size: 24, color: colors.text, family: baseLayout.font.family },
            x: 0.5,
            xanchor: 'center',
            y: 0.95,
            yanchor: 'top'
        },
        xaxis: {
            title: {
                text: 'X-Axis',
                font: { size: 14, color: colors.text, family: baseLayout.font.family }
            },
            gridcolor: colors.grid,
            gridwidth: 1,
            showgrid: true,
            zeroline: false,
            linecolor: colors.textSecondary,
            linewidth: 1
        },
        yaxis: {
            title: {
                text: 'Y-Axis',
                font: { size: 14, color: colors.text, family: baseLayout.font.family }
            },
            gridcolor: colors.grid,
            gridwidth: 1,
            showgrid: true,
            zeroline: true,
            zerolinecolor: colors.textSecondary,
            zerolinewidth: 1,
            linecolor: colors.textSecondary,
            linewidth: 1
        }
    };

    if (validData.length === 0) {
        return (
            <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: colors.textSecondary }}>No data available</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Plot 
                data={data} 
                layout={layout}
                config={{
                    displayModeBar: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                    responsive: true
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
            />
        </div>
    );
});

export const Donut = React.memo(({ xArray, yArray }) => {
    // Validate and filter data - for donut charts, yArray should be numeric values
    const validData = xArray && yArray && xArray.length > 0 && yArray.length > 0
        ? xArray.map((label, i) => ({
            label: label || `Item ${i + 1}`,
            value: Number(yArray[i]) || 0
        }))
            .filter(item => item.value > 0 && item.label)
        : [];

    const total = validData.reduce((sum, d) => sum + d.value, 0);

    const data = [{
        values: validData.map(d => d.value),
        labels: validData.map(d => d.label),
        type: "pie",
        hole: 0.5,
        marker: {
            colors: colors.gradient,
            line: {
                color: colors.background,
                width: 2.5
            }
        },
        textinfo: 'label+percent',
        textposition: 'outside',
        hovertemplate: '<b>%{label}</b><br>Value: %{value}<br>Percentage: %{percent}<extra></extra>',
        name: 'Distribution'
    }];

    const layout = {
        ...baseLayout,
        autosize: true,
        title: {
            text: 'Donut Chart',
            font: { size: 24, color: colors.text, family: baseLayout.font.family },
            x: 0.5,
            xanchor: 'center',
            y: 0.95,
            yanchor: 'top'
        },
        showlegend: true,
        legend: {
            orientation: 'v',
            yanchor: 'middle',
            y: 0.5,
            xanchor: 'left',
            x: 1.05,
            font: { size: 11, color: colors.textSecondary }
        },
        annotations: [{
            text: `Total<br>${total.toLocaleString()}`,
            x: 0.5,
            y: 0.5,
            font: {
                size: 16,
                color: colors.text,
                family: baseLayout.font.family
            },
            showarrow: false,
            xref: 'paper',
            yref: 'paper'
        }]
    };

    if (validData.length === 0) {
        return (
            <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: colors.textSecondary }}>No data available</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Plot 
                className="plot" 
                data={data} 
                layout={layout}
                config={{
                    displayModeBar: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                    responsive: true
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
            />
        </div>
    );
});
