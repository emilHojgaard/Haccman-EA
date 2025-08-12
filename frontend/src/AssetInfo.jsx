function AssetInfo(prop) {

    return (

        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
            <div style={{ display: "flex", justifyContent: "end", border: "2px solid #000000", background: "#ffffff" }}>
                <button onClick={() => {
                    prop.setSpecificOn(false)
                    prop.setGuardarailInfo(false)
                    prop.setLLMInfo(false)
                    prop.setUserpromptInfo(false)
                    prop.setSystemInfo(false)

                }}> x x x</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", border: "2px solid #000000", background: "#ffffff", height: "400px" }}>
                <div style={{ display: "flex", flexDirection: "column", background: "#ffffff", gap: "10px" }}>


                    {prop.mainText === "guardrail" ?
                        <div style={{ padding: "10px", lineHeight: "30px", overflowY: "scroll" }}>Guardrails are safety mechanisms around LLMs. They filter out what gets to
                            the system and what gets out of it. They protect LLMs from going too far from what is expected topic and safety-wise. These are still
                            language models though, and as such, they can be tricked. The usage of guardrails vary quite a bit in LLM applications. A certain
                            car company became social-media famous for not using any guardrail-like mechanism, which resulted in users using their website
                            chatbox as a study aid: the chatbox had Chat GPT 4 for free, and no extra layer of safety from leaving the topic "car sales". In our
                            platform, we add guardrails both before and after the model in some applications, in others, only between the prompt and the model, and
                            we even added a few that have no guardrails.  </div> :
                        prop.mainText === "llm" ?
                            <div style={{ padding: "10px", lineHeight: "30px", overflowY: "scroll" }}>Large Language Models are highly capable mathematical models that do a great job predicting what the next word
                                will be, based on the previous words. They work by receiving a sequence of tokens, like your user prompt, and then they calculate
                                which tokens are the most likely to compose a response. Because they base themselves off of predictions, they are highly stochastic, meaning you can't know
                                exactly what will come out of an LLM response. They have a somewhat considerable capacity in following commands, like messages telling them
                                how to behave or exposing them to data/information. These are called system prompts, and thats what we use in this application to instruct
                                LLM differently, like orienting them to be a city website helper or a child story teller. Despite seemingly intelligent, they (seem to) still don't have
                                human-like cognition, in the sense they are really good at predicting the following word, and thus creating smooth conversation, but they
                                don't really know what they are saying.
                            </div> :

                            <div style={{ padding: "10px", lineHeight: "30px", overflowY: "scroll" }}>User prompts are the messages that you, user, send to Large Language Models. In this game,
                                you are encouraged to use these prompts to make the models say something they are instructed not to say. Because LLMs base their response
                                in the user prompts, you can carefully chose words to make them confused and eventually generate a response they were told not to. This
                                process, the missbehaving of LLMs we call jailbreaks.
                            </div>
                    }


                </div>
            </div>
            <button onClick={() => {
                prop.setSpecificOn(false)
                prop.setGuardarailInfo(false)
                prop.setLLMInfo(false)
                prop.setUserpromptInfo(false)
                prop.setSystemInfo(false)
            }}> OK </button>
        </div>


    )
}

export default AssetInfo