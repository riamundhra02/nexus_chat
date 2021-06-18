import React from "react";
import { AttachmentDisplay } from "../AttachmentDisplay";
import { TextMessage as TextMessageModel } from "../messageModel";
import { TextMessage } from "foundations/components/chat";
import { StyledBox } from "foundations/components/layout";
import LazyLoad from "react-lazyload";
import Loader from "react-loader-spinner";

type TextMessageProps = {
  message: TextMessageModel;
  parentKey: string;
};

/**
 * Display a TextMessage such as it would appear in a list of messages
 */
export const TextMessageDisplay = ({
  message,
  parentKey
}: TextMessageProps) => {
  return (
    <LazyLoad
      height={100}
      overflow={true}
      debounce={true}
      offset={100}
      placeholder={
        <Loader type="TailSpin" color="#00BFFF" height={80} width={80} />
      }
    >
      <TextMessage text={message.text} />
      {message.attachments?.map((attachment, index) => (
        <StyledBox marginTop="1">
          <AttachmentDisplay
            key={`${parentKey}-attachment-${index}`}
            attachment={attachment}
          />
        </StyledBox>
      ))}
    </LazyLoad>
  );
};
