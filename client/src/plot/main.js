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
                <div className="d-flex flex-column justify-content-center align-items-center" style={{width:"100vw", height:"100vh"}}>
                     <div className="spinner-border spinner-border-lg text-succesfull" style={{width:"200px", height:"200px"}}></div>
                     <span className="text-center">please wait while we load data</span>
                </div>
               
            ) : (
                <div className="container-fluid">
                    <div className="justify-content-center">
                    <div className="container-fluid d-flex mt-2 border border-2 justify-content-around align-items-center bg-secondary w-75 p-2">
                        <div className="item1">
                    <label>select graph :</label>
                <select className="btn rounded-pill btn-sm border border-primary btn-dark mx-2" id="selectOption" value={plotOption} onChange={handlePlot}>
                    {option.map((option,index)=>(
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                </div>
                <div className="item2">
                <label>X-Axis :</label>
                <select className="btn rounded-pill btn-sm borfer border-primary btn-dark mx-2" id="xAxis" value={xData} onChange={handleX}>
                    {DataValue.map((option,index)=>(
                        <option key={index} value={option}>{option}</option>
                    ))}

                </select>
                </div>
                <div className="item3">

                <label>Y-Axis :</label>
                <select className="btn rounded-pill btn-sm border border-primary btn-dark mx-2" id="yAxis" value={yData} onChange={handleY}>
                    {DataValue.map((option,index)=>(
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                </div>
                </div>
                </div>

                <div className="container-fluid d-flex justify-content-center">
                <div className="d-flex justify-content-center border border-3 border-top-0 border-bottom-0 border-primary bg-secondary mt-3" style={{width:"80%"}}>
                {componentMapping[plotOption]}
                </div>
                </div>                
                </div>
      
        

               
               
            )}

            <hr></hr>


            <footer className="conatiner-fluid mt-3 d-flex flex-column align-items-center">
                <span>web.aix</span>
              <span>2023-2024</span>

            </footer>
            
           
        </>
        
    )

}
