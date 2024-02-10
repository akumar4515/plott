import React from "react";
import { Main } from "./plot/main.js";

export const App=()=>{
    return(
   <div>
   <div className="container-fluid text-center border border-3 border-end-0 border-top-0 border-start-0 border-secondary">
    <h3>Web.Graph</h3>
   </div>
   <Main/>
   
   </div>
    )
}