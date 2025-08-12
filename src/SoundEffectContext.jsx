import React, { createContext, useContext, useEffect, useState } from 'react';

const SoundEffectContext = createContext();

export const SoundEffectProvider = ({ children }) => {
    const [audioContext, setAudioContext] = useState(null);
    const [soundEffects, setSoundEffects] = useState({});
    const [gainNodes, setGainNodes] = useState({});

    useEffect(() => {
        const initAudio = async () => {
            try {
                const context = new (window.AudioContext || window.webkitAudioContext)();
                setAudioContext(context);

                const loadSound = async (url) => {
                    const response = await fetch(url);
                    const arrayBuffer = await response.arrayBuffer();
                    return new Promise((resolve, reject) => {
                        context.decodeAudioData(arrayBuffer, (buffer) => {
                            resolve(buffer);
                        }, reject);
                    });
                };

                const sounds = await Promise.all([
                    loadSound('src/assets/8-bit-game-7-188104.mp3'),    // Select sound
                    loadSound('src/assets/8-bit-game-2-186976.mp3'),    // Navigate sound
                    loadSound('src/assets/game-ui-sounds-14857.wav'),   // Keystroke sound
                    loadSound('src/assets/success-fanfare-trumpets-6185.mp3')     // Win sound
                ]);

                const gainNodeSettings = {
                    select: 0.3,
                    navigate: 1.0,
                    keystroke: 0.2,
                    win: 2.0
                };

                const newGainNodes = {};
                for (const key in gainNodeSettings) {
                    const gainNode = context.createGain();
                    gainNode.gain.value = gainNodeSettings[key];
                    gainNode.connect(context.destination);
                    newGainNodes[key] = gainNode;
                }

                setGainNodes(newGainNodes);

                setSoundEffects({
                    select: sounds[0],
                    navigate: sounds[1],
                    keystroke: sounds[2],
                    win: sounds[3]
                });

            } catch (error) {
                console.error('Error initializing audio:', error);
            }
        };

        initAudio();
    }, []);

    const playSoundEffect = (type) => {
        if (audioContext && soundEffects[type] && gainNodes[type]) {
            const source = audioContext.createBufferSource();
            source.buffer = soundEffects[type];
            source.connect(gainNodes[type]);
            source.start(0);
        }
    };

    const preloadSoundEffect = async (url) => {
        try {
            const buffer = await loadSound(url);
            return buffer;
        } catch (error) {
            console.error('Error preloading sound effect:', error);
            return null;
        }
    };

    return (
        <SoundEffectContext.Provider value={{ playSoundEffect, preloadSoundEffect }}>
            {children}
        </SoundEffectContext.Provider>
    );
};

export const useSoundEffect = () => useContext(SoundEffectContext);
