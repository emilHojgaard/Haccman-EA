import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArrowKeysReact from 'arrow-keys-react';
import { useSoundEffect } from './SoundEffectContext';
import './index.css';
import opponent2 from './assets/avatar2.png'
import opponent3 from './assets/avatar3.png'
import opponent6 from './assets/avatar6.png'
import opponent41 from './assets/avatar41.png'
import opponent42 from './assets/avatar42.png'
import opponent43 from './assets/avatar43.png'

function Choose(props) {
    const currentChallenge = props.chosenChallenge;
    const setCurrentChallenge = props.setChosenChallenge;
    const navigate = useNavigate();
    const { playSoundEffect } = useSoundEffect();

    const list_of_challenges = props.listOfChallenges;



    const containerRef = useRef(null);

    ArrowKeysReact.config({
        left: () => {
            if (currentChallenge % 3 !== 0) {
                setCurrentChallenge((prev) => prev - 1);
                playSoundEffect('navigate');
            }
        },
        right: () => {
            if (currentChallenge % 3 !== 2) {
                setCurrentChallenge((prev) => prev + 1);
                playSoundEffect('navigate');
            }
        },
        up: () => {
            if (currentChallenge >= 3) {
                setCurrentChallenge((prev) => prev - 3);
                playSoundEffect('navigate');
            }
        },
        down: () => {
            if (currentChallenge < 3) {
                setCurrentChallenge((prev) => prev + 3);
                playSoundEffect('navigate');
            }
        }
    });

    useEffect(() => {
        const container = containerRef.current;
        container.focus();

        const handleKeyPress = (event) => {
            if (event.keyCode === 13) {
                playSoundEffect('select');
                navigate("/play2");
                event.stopPropagation();
            }

            if (event.keyCode === 27) {
                event.preventDefault();
                navigate("/")
            }

            if (event.keyCode === 18) {
                event.preventDefault();
                navigate("/")
            }
        };

        container.addEventListener('keydown', handleKeyPress);

        return () => {
            container.removeEventListener('keydown', handleKeyPress);
        };
    }, [navigate, playSoundEffect]);

    return (
        <div ref={containerRef} style={{ zIndex: 1 }} tabIndex={0} {...ArrowKeysReact.events}>
            <div className='background'>
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "20px", paddingBottom: "20px",
                    color: "#ffffff", border: "2px solid #000000", fontSize: "30px", fontFamily: "ARCADE_I", textShadow: '4px 4px 0px #A9345C'
                }}>
                    {"Choose your opponent"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
                    <div style={{ display: "flex", flexDirection: "row", gap: "70px", justifyContent: "center" }}>
                        {list_of_challenges.filter(el => (el.line === 1)).map(el => (
                            <div key={el.number} className={el.number === currentChallenge ? 'character-box selected' : 'character-box'}>
                                <div className='character-box-title'>{el.is}</div>

                                <div
                                    onClick={() => {
                                        navigate("/play2");
                                        setCurrentChallenge(el.number);
                                        playSoundEffect('select');
                                    }}
                                    style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <div style={{ width: "20%" }}>

                                            {el.number === 0 ?
                                                <img src={opponent43}  ></img> :
                                                el.number === 1 ? <img src={opponent41}></img> :
                                                    <img src={opponent42}></img>
                                            }
                                        </div>



                                        <div className='scrollable-box'>
                                            <div>
                                                {"Challenge:  " + el.short_system_description}
                                            </div>
                                            {props.completedChallenges.includes(el.number) ? <div>JAILBREAK SUCCESSFUL</div> : <></>}
                                            <div>{"Difficulty:  " + el.difficulty}</div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "70px", justifyContent: "center" }}>
                        {list_of_challenges.filter(el => (el.line === 2)).map(el => (
                            <div key={el.number} className={el.number === currentChallenge ? 'character-box selected' : 'character-box'}>
                                <div className='character-box-title'>{el.is}</div>

                                <div
                                    onClick={() => {
                                        navigate("/play2");
                                        setCurrentChallenge(el.number);
                                        playSoundEffect();
                                    }}
                                    style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <div style={{ width: "20%" }}>
                                            {el.number === 3 ?
                                                <img src={opponent2}  ></img> :
                                                el.number === 4 ? <img src={opponent3}></img> :
                                                    <img src={opponent6}></img>
                                            }
                                        </div>

                                        <div className='scrollable-box'>
                                            <div>
                                                {"Challenge:  " + el.short_system_description}
                                            </div>
                                            {props.completedChallenges.includes(el.number) ? <div>JAILBREAK SUCCESSFUL</div> : <></>}
                                            <div>{"Difficulty:  " + el.difficulty}</div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Choose;
