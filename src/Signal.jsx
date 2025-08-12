import Prompt from './Prompt';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Initial from './Initial';
import Choose from './Choose';
import { useState } from "react"

function Signal(prop) {

    let signal;
    let rotation = "";
    if (prop.direction === "up") {
        signal = ">";
        rotation = "rotate(-90deg)";
    } else if (prop.direction === "down") {
        signal = ">";
        rotation = "rotate(90deg)";
    } else if (prop.direction === "right") {
        rotation = "";
        signal = ">";
    } else if (prop.direction === "left") {
        rotation = "";
        signal = "<";
    } else {
        signal = "";
    }


    return (
        <div id={prop.id} style={{ height: "20px", width: "20px", color: "#ffffff", transform: { rotation } }}>
            {signal}
        </div>

    )


}

export default Signal
