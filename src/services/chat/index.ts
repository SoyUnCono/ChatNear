import { messages } from "./messages";
import { queue } from "./queue";
import { participants } from "./participants";
import { friends } from "./friends";
import { storage } from "./storage";

export const chat = {
  ...messages,
  ...queue,
  ...participants,
  ...friends,
  ...storage,
  deleteChat: async (chatId: string) => {
    const { error } = await participants.deleteChat(chatId);
    return { error };
  },
};
