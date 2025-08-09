import React from "react";
import Plot from 'react-plotly.js';
import '../../css/main.css';



export const Bar=React.memo(({xArray,yArray})=>{

    const data=[{
        x:xArray,
        y:yArray,
        type:"bar",
    }];

    const layout={
        title:'bar chart'
    };

    return(
        <>
        <Plot data={data} layout={layout}/>
        </>
    )
});


export const Scatter=React.memo(({xArray,yArray})=>{


    const data=[{
        x:xArray,
        y:yArray,
        type:"scatter",
    },];

    const layout={
        title:'scatter chart',
    };

    return(
        <>
        <Plot data={data} layout={layout}/>
        </>
    )
});

export const Pie=React.memo(({xArray,yArray})=>{


    const data=[{
        values:xArray,
        labels:yArray,
        type:"pie",
    },];

    const layout={
        title:'Pie chart',
    };

    return(
        <>
        <Plot data={data} layout={layout}/>
        </>
    )
});

export const Line=React.memo(({xArray,yArray})=>{


    const data=[{
        x:xArray,
        y:yArray,
        type:"line",
    },];

    const layout={
        title:'Line chart',
    };

    return(
        <>
        <Plot data={data} layout={layout}/>
        </>
    )
});


export const Donut=React.memo(({xArray,yArray})=>{


    const data=[{
        values:xArray,
        labels:yArray,
        type:"pie",
        hole:0.4,
    },];

    const layout={
        title:'Pie chart',
    };

    return(
        <>
        <Plot className="plot" data={data} layout={layout}/>
        </>
    )
});
