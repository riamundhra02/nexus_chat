import React from "react";
import { GifPicker, onSelectedHandler } from "../GifPicker";
import { Icons } from "foundations/components/presentation";
import { Dropdown } from "foundations/components/layout";

interface GifInputProps {
  onSelection: onSelectedHandler;
}

const GifInput = ({ onSelection }: GifInputProps) => {
  return <span></span>;
};

export { GifInput };
