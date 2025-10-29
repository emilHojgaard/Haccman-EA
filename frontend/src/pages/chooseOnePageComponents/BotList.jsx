import BotCard from "./BotCard";

export default function BotList({
  botList,
  selectedBot,
  onSelectBot,
  completedChallenges,
}) {
  if (!botList || botList.length === 0) {
    return <div className="text-white">No bots available </div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "70px",
        justifyContent: "center",
        flexWrap: "wrap", // optional: wrap to multiple rows if many bots
      }}
    >
      {botList.map((bot) => (
        <BotCard
          key={bot.number}
          bot={bot}
          isSelected={bot.number === selectedBot}
          onSelect={() => onSelectBot(bot.number)}
          completed={completedChallenges.includes(bot.number)}
        />
      ))}
    </div>
  );
}
