import { Transformer } from "./types";
import {
  BaseMessage,
  TextMessage,
  MessageType,
  GiphyMessage
} from "sharedTypes/messageModel";

import { translate } from "features/mathjs";

const isTextMessage = (message: BaseMessage): message is TextMessage =>
  message.type === MessageType.Text;

const createMathjsMessage = (query: string, senderId: string): TextMessage => {
  return {
    text: query,
    senderId,
    type: MessageType.Text
  };
};
declare const MathJax: any;
const transformer: Transformer<BaseMessage> = async message => {
  if (isTextMessage(message) && message.text.startsWith("/mathjs ")) {
    const query = message.text.replace("/mathjs ", "");
    const result = await translate({
      expr: query,
      precision: 5
    });
    if (result) {
      return createMathjsMessage(result, message.senderId);
    }
  }
  return message;
};

export default transformer;
