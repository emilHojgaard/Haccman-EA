export default function BotChallenge({ description, completed }) {
  return (
    <div className="w-36 text-center overflow-y-auto">
      <div className="text-sm">{`Challenge: ${description}`}</div>
      {completed && (
        <div className="text-green-400 font-bold mt-1">
          JAILBREAK SUCCESSFUL
        </div>
      )}
    </div>
  );
}
