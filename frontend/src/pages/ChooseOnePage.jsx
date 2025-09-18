import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowKeysReact from "arrow-keys-react";
import { useSoundEffect } from "../theLeftoverFiles/SoundEffectContext";
import "../index.css";
import opponent3 from "../assets/avatar3.png";
import { startConversation } from "../apiSupabase";

function Choose(props) {
  const {
    selectedBot,
    setSelectedBot,
    botList,
    completedChallenges = [],
  } = props;
  const navigate = useNavigate();
  const { playSoundEffect } = useSoundEffect();
  const [starting, setStarting] = useState(false);
  const containerRef = useRef(null);

  const count = botList?.length ?? 0;

  // ---- Start session with chosen bot
  async function onStartWithBot(botNumber) {
    if (starting) return; // prevent multiple clicks
    try {
      setStarting(true);
      const session = await startConversation(botNumber);
      navigate(`/play2?sid=${session.id}`); // pass session id via query
    } catch (e) {
      console.error(e);
    } finally {
      setStarting(false);
    }
  }

  // ---- Arrow keys: linear list navigation with wrap-around ----
  ArrowKeysReact.config({
    left: () => {
      if (!count) return;
      setSelectedBot((prev) => {
        const next = (prev - 1 + count) % count;
        playSoundEffect("navigate");
        return next;
      });
    },
    right: () => {
      if (!count) return;
      setSelectedBot((prev) => {
        const next = (prev + 1) % count;
        playSoundEffect("navigate");
        return next;
      });
    },
    up: () => {
      if (!count) return;
      setSelectedBot((prev) => {
        const next = (prev - 1 + count) % count;
        playSoundEffect("navigate");
        return next;
      });
    },
    down: () => {
      if (!count) return;
      setSelectedBot((prev) => {
        const next = (prev + 1) % count;
        playSoundEffect("navigate");
        return next;
      });
    },
  });

  // ---- Focus container & handle Enter/Escape/Alt ----
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.focus();

    const handleKeyPress = (event) => {
      // Enter
      if (event.key === "Enter") {
        playSoundEffect("select");
        const chosen = botList[selectedBot];

        if (chosen) onStartWithBot(chosen.number);

        event.stopPropagation();
      }

      // Escape
      if (event.key === "Escape") {
        event.preventDefault();
        navigate("/");
      }
    };

    el?.addEventListener("keydown", handleKeyPress);
    return () => el?.removeEventListener("keydown", handleKeyPress);
  }, [navigate, playSoundEffect, selectedBot, botList, count]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      style={{ zIndex: 1, outline: "none" }}
      {...ArrowKeysReact.events}
    >
      <div className="background">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "20px",
            paddingBottom: "20px",
            color: "#fff",
            border: "2px solid #000000",
            fontSize: "30px",
            fontFamily: "ARCADE_I",
            textShadow: "4px 4px 0px #A9345C",
          }}
        >
          {"Choose your opponent"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "70px",
              justifyContent: "center",
              flexWrap: "wrap", // optional: wrap to multiple rows if many bots
            }}
          >
            {botList.map((bot) => {
              return (
                <div
                  key={bot.number}
                  className={
                    bot.number === selectedBot
                      ? "character-box selected"
                      : "character-box"
                  }
                >
                  <div className="character-box-title">{bot.name}</div>

                  <div
                    onClick={() => {
                      setSelectedBot(bot.number);
                      onStartWithBot(bot.number);
                      playSoundEffect("select");
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div
                        style={{
                          width: "30%",
                        }}
                      >
                        <img src={opponent3} alt="" />
                      </div>

                      <div className="scrollable-box">
                        <div style={{ overflowY: "auto" }}>
                          {"Challenge:  " + bot.inGameDescription}
                        </div>
                        {completedChallenges.includes(bot.number) ? (
                          <div>JAILBREAK SUCCESSFUL</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {count === 0 && (
              <div style={{ color: "#fff" }}>No bots available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Choose;
