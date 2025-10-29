export default function BotImage({ src }) {
  return (
    <div className="w-36 h-36 flex-shrink-0">
      <img
        src={src}
        alt=""
        className="w-full h-full object-contain rounded-md"
      />
    </div>
  );
}
