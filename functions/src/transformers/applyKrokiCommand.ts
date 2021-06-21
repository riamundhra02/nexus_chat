import { Transformer } from "./types";
import {
  BaseMessage,
  TextMessage,
  MessageType,
  GiphyMessage
} from "sharedTypes/messageModel";

import { translate } from "features/kroki";

// import zlib from 'zlib';

const isTextMessage = (message: BaseMessage): message is TextMessage =>
  message.type === MessageType.Text;

// function textEncode(str) {
//   var utf8 = unescape(encodeURIComponent(str));
//   var result = new Uint8Array(utf8.length);
//   for (var i = 0; i < utf8.length; i++) {
//     result[i] = utf8.charCodeAt(i);
//   }
//   return result;
// }

function payload_threshold_exceeded(text: string, senderID: string) {
  return encodeURIComponent(senderID + text).length + 100 + 1024 >= 32768;
}

const createKrokiMessage = (message: string, senderId: string): TextMessage => {
  return {
    text: message,
    senderId,
    type: MessageType.Text
  };
};

const transformer: Transformer<BaseMessage> = async message => {
  if (isTextMessage(message) && message.text.startsWith("/plot ")) {
    const query = message.text.replace("/plot ", "");
    const diagram_source = query.substring(query.indexOf("\n") + 1).trimRight();
    const diagram_type = query.split("\n")[0].trim();
    const result = await translate({
      diagram_source: diagram_source,
      diagram_type: diagram_type
    });
    if (result) {
      if (payload_threshold_exceeded(result, message.senderId)) {
        // zlib.deflate(textEncode(diagram_source), (err, buffer) => {
        //   if (!err) {
        //     return createKrokiMessage(`The requested graph is too large to be embedded. You may access it <a href="https://kroki.io/${diagram_type}/svg/${buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_')}" target="_blank">here</a> instead.`, message.senderId);
        //   }
        //   else {
        //     return createKrokiMessage(`\`\`\`[PlotGen] ERROR: ${err.message}\`\`\``, message.senderId);
        //   }
        // });
        return createKrokiMessage(
          "```[PlotGen] ERROR: The requested graph is too large to be embedded.```",
          message.senderId
        );
      }
      return createKrokiMessage(result, message.senderId);
    }
  }
  return message;
};

export default transformer;
