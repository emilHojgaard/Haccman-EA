import BotImage from "./BotImage";
import BotChallenge from "./BotChallenge";
import opponent3 from "../../assets/avatar3.png";

export default function BotCard({ bot, isSelected, onSelect, completed }) {
  return (
    <div
      className={`character-box flex flex-col items-center gap-4 p-4 border-2 rounded-lg ${
        isSelected ? "border-red-500" : "border-gray-500"
      }`}
      onClick={onSelect}
    >
      <div className="character-box-title">{bot.name}</div>
      <div className="character-content flex flex-row items-start gap-4 cursor-pointer">
        <BotImage src={opponent3} />
        <BotChallenge
          description={bot.inGameDescription}
          completed={completed}
        />
      </div>
    </div>
  );
}
