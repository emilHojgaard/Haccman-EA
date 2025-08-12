function BoxWithStick(prop) {

    return (
        prop.stick ?
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div id="id-1-" style={{
                    color: "#ffffff", border: "2px solid #ffffff", marginLeft: "15px", width: "400px", display: "flex", justifyContent: "space-between", flexDirection: "row",
                    padding: "15px"
                }}>
                    {prop.name}

                    {(prop.name === "GuardRail #1" | prop.name === "GuardRail #2") ?
                        <button onClick={() => {
                            prop.setSpecificOn(true)
                            prop.setGuardarailInfo(true)

                        }}>?</button> :
                        prop.name === "User message" ?
                            <button onClick={() => {
                                prop.setSpecificOn(true)
                                prop.setUserpromptInfo(true)

                            }}>?</button> :
                            <button onClick={() => {
                                prop.setSpecificOn(true)
                                prop.setLLMInfo(true)

                            }}>?</button>
                    }

                </div>
                <div style={{ height: "20px", width: "5px", background: "#ffffff", display: "flex", justifyContent: "center" }}></div>
            </div> :
            <div id="id-5-" style={{ color: "#ffffff", border: "2px solid #ffffff", padding: "15px", width: "400px" }}> {prop.name}
            </div>
    )
}

export default BoxWithStick