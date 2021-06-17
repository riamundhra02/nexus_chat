import Styled from "styled-components/macro";

export const Textarea = Styled.div`
  background: ${p => p.theme.backgrounds.content};
  border: ${p => p.theme.borders.none};
  color: ${p => p.theme.colors.importantText};
  height:fit-content;
  overflow-x:clip !important;
  overflow-y:scroll;
  word-wrap: anywhere; overflow-wrap: anywhere; white-space: break-spaces;
  min-height: 60px;
  max-height: 5rem;
  padding: ${p => p.theme.space[0]};
  resize: none;
  width: 100%;
  max-width: calc(100%);

  &::placeholder {
    color: ${p => p.theme.colors.normalText};
  }

  &:focus {
    outline: none;
  }
`;
