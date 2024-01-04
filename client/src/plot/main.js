import React,{useState,useEffect} from "react";
import axios from 'axios';

import { Bar, Donut, Line, Pie, Scatter } from "./graph/graph";


export const Main=()=>{
    const [data,setdata]=useState([]);
    const [loading, setLoading] = useState(true);

    const [plotOption,setPlotOption]=useState('bar');
    const [xData,setXData]=useState('_id');
    const [yData,setYData]=useState('end_year');

    const [xArray,setXArray]=useState([]);
    const [yArray,setYArray]=useState([]);

    const option=[
        'bar',
        'pie',
        'scatter',
        'line',
        'donut',
    ];

    const componentMapping={
        'bar':<Bar  xArray={xArray} yArray={yArray} />,
        'pie':<Pie  xArray={xArray} yArray={yArray} />,
        'scatter':<Scatter  xArray={xArray} yArray={yArray} />,
        'line':<Line  xArray={xArray} yArray={yArray} />,
        'donut':<Donut  xArray={xArray} yArray={yArray} />,

    };
    const DataValue=[
'_id',
'end_year',
'intensity',
'sector',
'topic',
'insight',
'url',
'region',
'start_year',
'impact',
'added',
'published',
'country',
'relevance',
'pestle',
'source',
'title',
'likelihood',

    ];

    const handlePlot=(e)=>{
        setPlotOption(e.target.value);
    };
    const handleX=(e)=>{
        setXData(e.target.value);
    };
    const handleY=(e)=>{
        setYData(e.target.value);

    };

 
    useEffect(()=>{
        if(Array.isArray(data)){
            const updatedXArray = data.map((value, index) => {
            return value[xData];
          });
        const updatedYArray = data.map((value, index) => {
            return value[yData];
          });
    
          setXArray(updatedXArray);
          setYArray(updatedYArray);   
        }
    },[data,xData,yData])

   
   

    useEffect(()=>{
        const fetch=async()=>{
            try{
                const response=await axios.get('http://localhost:5000/get');
                setdata(response.data);
                setLoading(false);
            }
            catch(err){
                console.error(err);
            }
        }
        fetch();
    },[])
   


    return(
   
        <>
            {loading ? (
                <p>Getting data...</p>
            ) : (
                <>
                <label>select graph</label>
                <select id="selectOption" value={plotOption} onChange={handlePlot}>
                    {option.map((option,index)=>(
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                <label>X-Axis</label>
                <select id="xAxis" value={xData} onChange={handleX}>
                    {DataValue.map((option,index)=>(
                        <option key={index} value={option}>{option}</option>
                    ))}

                </select>

                <label>Y-Axis</label>
                <select id="yAxis" value={yData} onChange={handleY}>
                    {DataValue.map((option,index)=>(
                        <option key={index} value={option}>{option}</option>
                    ))}

                </select>
                

                {componentMapping[plotOption]}
                </>
            )}
        </>
        
    )

}
