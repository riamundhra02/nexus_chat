import React, { FunctionComponent } from "react";
// import {Fragment} from 'react';
import Styled, { css } from "styled-components/macro";
import emojiRegex from "emoji-regex";
import sanitizeHtml from "sanitize-html";
import DOMPurify from "dompurify";
import { DOMParser } from "xmldom";
// declare const he: any;

export enum TextMessageSizes {
  BIG = "BIG"
}

interface TextWrapperProps {
  /** Specify a Message size */
  size?: TextMessageSizes | false;
}

interface TextMessageProps extends TextWrapperProps {
  /** Display a text copy */
  text: string;
}

const BigMessage = css`
  font-size: ${p => p.theme.fontSizes.large};
`;

const Wrapper = Styled.div<TextWrapperProps>`
  background: ${p => p.theme.backgrounds.message};
  border-radius: ${p => p.theme.radii.strong};
  border-top-left-radius: ${p => p.theme.radii.square};
  box-shadow: ${p => p.theme.shadows[0]};
  color: ${p => p.theme.colors.messageText};
  line-height: 1.5;
  padding: ${p => p.theme.space[4]};
  text-align: left;
  white-space: pre-wrap !important;
  width: fit-content !important;
  word-break: break-word !important;

  ${props => props.size === TextMessageSizes.BIG && BigMessage}
`;

// Check if there are only 3 or less emoji in the message
const isEmphasized = (msg: string): boolean => {
  const trimmed = msg.trim();
  if (trimmed.length <= 15) {
    const emoji = msg.match(emojiRegex());
    return emoji ? emoji.length <= 3 && emoji.join("") === trimmed : false;
  } else {
    return false;
  }
};

declare const marked: any;
// declare const mermaid: any;

export const TextMessage: FunctionComponent<TextMessageProps> = ({
  text,
  size,
  ...rest
}) => {
  // var result = text.match(/<markdown>(.*?)<\/markdown>/g).map(function(val){
  //   return val.replace(/<\/?b>/g,'');
  // }).forEach(function (element) {
  //   marked()
  // });
  // text = mermaid.render(text);

  // if (text.startsWith("/mermaid ")) {
  //   try {
  //     text = mermaid.render(
  //       "html",
  //       he.decode(text.replace("/mermaid ", "")),
  //       undefined
  //     );
  //     // console.log(text);
  //     return (
  //       <Wrapper
  //         size={size || (isEmphasized(text) ? TextMessageSizes.BIG : undefined)}
  //         {...rest}
  //       >
  //         <span dangerouslySetInnerHTML={{ __html: text }} />
  //       </Wrapper>
  //     );
  //   } catch (error) {
  //     // console.log(error);
  //   }
  // }

  try {
    var dom = new DOMParser().parseFromString(text, "text/xml");
    if (dom.getElementsByTagName("svg").length > 0) {
      return (
        <Wrapper
          size={size || (isEmphasized(text) ? TextMessageSizes.BIG : undefined)}
          {...rest}
        >
          <span
            style={{ maxWidth: "95%", overflowX: "clip" }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(text)
            }}
          />
        </Wrapper>
      );
    }
  } catch (e) {}

  // If parsing fails or there are no SVG elements in the root level of the DOM,
  // Use a strict version of the HTML sanitizer that removes styling info.

  return (
    <Wrapper
      size={size || (isEmphasized(text) ? TextMessageSizes.BIG : undefined)}
      {...rest}
    >
      <span
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(marked(text), {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
              "img",
              "iframe"
            ]),
            allowedAttributes: {
              img: ["class", "src"],
              iframe: ["src"]
            },
            allowedIframeHostnames: ["www.youtube.com"],
            allowedSchemes: ["https"],
            disallowedTagsMode: "discard"
          })
        }}
      />
    </Wrapper>
  );
};
