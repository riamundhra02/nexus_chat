import React, { useEffect, useRef, useContext } from "react";
import { EmojiInput } from "features/emoji/EmojiInput/EmojiInput";
import { GifInput } from "features/gifs/GifInput";
import { IGif } from "@giphy/js-types";
import { EmojiSuggestion } from "features/emoji/EmojiSuggestion/EmojiSuggestion";
import { MessageType } from "../messageModel";
import { DraftTextMessage, isDraftModified } from "../draft";
import { useMediaQuery } from "foundations/hooks/useMediaQuery";
import { ThemeContext } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../sendMessage";
import { getLoggedInUserId } from "features/authentication/authenticationModel";
import { FlexRow, StyledBox } from "foundations/components/layout";
import { Icon, Icons, Textarea } from "foundations/components/presentation";
// import { Twemoji } from "react-emoji-render";
// import sanitizeHtml from 'sanitize-html';
/**
 * Expand the height of the input box as multiple lines of text are entered.
 */
const autoExpand = (el: HTMLDivElement) => {
  setTimeout(function () {
    el.style.cssText = "height:auto; padding:0; max-height: 5rem;";
    el.style.cssText =
      "height:" +
      (el.clientHeight < el.scrollHeight ? el.clientHeight : el.scrollHeight) +
      "px;";
  }, 0);
};

/**
 * Update the text field on a draft text message by returning a new object if
 * the new text is different than the text in the old object.
 * This is the proper way to do updates to avoid unnecessary rerendering.
 */
const newTextDraft = (
  draft: DraftTextMessage,
  newText: string
): DraftTextMessage => {
  if (draft.text === newText) {
    return draft;
  }
  return {
    type: MessageType.Text,
    senderId: draft.senderId,
    text: newText
  };
};

type TextMessageEditorProps = {
  message: DraftTextMessage;
  sendDraft: (message: DraftTextMessage) => void;
  updateDraft: (message: DraftTextMessage) => void;
};

declare const twemoji: any;

/**
 * Edit a draft Text Message
 */
export const TextMessageEditor = ({
  message,
  sendDraft,
  updateDraft
}: TextMessageEditorProps) => {
  const dispatch = useDispatch();
  const userId = useSelector(getLoggedInUserId);
  const theme = useContext(ThemeContext);
  const touch = useMediaQuery(theme.mediaQueries.touch);
  const text = message.text;
  const textareaRef = useRef<HTMLDivElement>(document.createElement("div"));

  const textChanged = (e: React.ChangeEvent<HTMLDivElement>) => {
    // console.log(e.target.innerHTML!);
    e.target.setAttribute("data-value", e.target.innerHTML!);
    updateDraft(newTextDraft(message, e.target.innerHTML!));
    twemoji.parse(document.body, {
      folder: "svg",
      ext: ".svg"
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !(e.shiftKey || touch)) {
      const draft = newTextDraft(message, text);
      if (isDraftModified(draft)) {
        sendDraft(draft);
      }
      e.preventDefault();
      textareaRef.current.innerHTML = "Enter text here";
    }
    // textareaRef.current.setAttribute('data-value', textareaRef.current.innerText);
    autoExpand(e.target as HTMLDivElement);
  };

  const placeCaretAtEnd = (el: HTMLDivElement) => {
    el.focus();
    if (
      typeof window.getSelection != "undefined" &&
      typeof document.createRange != "undefined"
    ) {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const emojiInserted = (messageWithEmoji: string) => {
    updateDraft(newTextDraft(message, messageWithEmoji));
    textareaRef.current.innerHTML = messageWithEmoji;
    placeCaretAtEnd(textareaRef.current);
  };

  // immediately send gifs (without creating a draft message)
  const sendGif = (gif: IGif, query: string) => {
    dispatch(
      sendMessage({
        type: MessageType.Giphy,
        senderId: userId,
        query,
        gif
      })
    );
  };

  useEffect(() => {
    autoExpand(textareaRef.current);
  }, [textareaRef]);

  return (
    <FlexRow padding="2">
      <FlexRow flexGrow={1}>
        <Textarea
          ref={textareaRef}
          // rows={1}
          data-value={text}
          onInput={textChanged}
          onKeyPress={handleKeyPress}
          contentEditable={true}
          placeholder="Type Message"
        />
      </FlexRow>

      {process.env.REACT_APP_GIPHY_API_KEY && (
        <GifInput onSelection={sendGif} />
      )}

      <StyledBox marginLeft="1">
        <EmojiInput value={text} onSelection={emojiInserted} />
        <EmojiSuggestion value={text} onSelection={emojiInserted} />
      </StyledBox>

      {touch && (
        <StyledBox
          bg="active"
          color="onPrimary"
          padding="1"
          margin={-1}
          marginLeft="1"
          borderRadius="light"
          onClick={() => isDraftModified(message) && sendDraft(message)}
        >
          <Icon icon={Icons.Send} title="Send Message" />
        </StyledBox>
      )}
    </FlexRow>
  );
};
