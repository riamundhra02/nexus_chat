import { fetch } from "xhr";
import { stringify } from "codec/query_string";

interface TranslateParameters {
  expr: string;
  precision?: number;
}

export const translate = async (
  parameters: TranslateParameters
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://api.mathjs.org/v4/?${stringify(parameters)}`
    );
    if (response.ok) {
      return response.body;
    } else {
      return response.body;
    }
  } catch (e) {
    // fail silently
    return null;
  }
};
