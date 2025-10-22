export default function messageHistory(previousPrompts, messageCount = 20) {
    const messageList = Array.isArray(previousPrompts) ? previousPrompts.slice(-messageCount) : [];
    if (messageList.length === 0) return "";

    const messagesString = [];

    for (const { id, message } of messageList) {
        if (message.length > 1000) {
            const messageArray = message.split((/(?:(?<=[.!?])\s+)/));
            const first = messageArray.slice(0, 3).join('');
            const last = messageArray.slice(-3).join('');
            messagesString.push(`[${id}]: ${first} ... ${last} (truncated)`);
            continue;
        }

        messagesString.push({role: id, content: message});
    }

   

    return messagesString;
};