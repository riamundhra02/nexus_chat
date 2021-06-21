import { fetch, HTTPOptions } from "xhr";

interface TranslateParameters {
  diagram_source: string;
  diagram_type: string;
}

declare const he: any;

export const translate = async (
  parameters: TranslateParameters
): Promise<string | null> => {
  try {
    var decodeHtmlEntity = function (str: string) {
      return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
      });
    };

    // const he_resp = await fetch("https://cdnjs.cloudflare.com/ajax/libs/he/1.2.0/he.min.js")

    // if (he_resp.ok) { // if HTTP-status is 200-299
    //   // get the response body (the method explained below)
    //   console.log(he_resp.body);
    //   eval(he_resp.body);
    // } else {
    //   return '\`\`\`[Kroki: ERROR] XHR request for HTML encoder failed\`\`\`'
    // }

    const requestOptions = <HTTPOptions>{
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: decodeHtmlEntity(parameters.diagram_source)
    };
    const response = await fetch(
      `https://kroki.io/${parameters.diagram_type}/svg`,
      requestOptions
    );
    if (response.ok) {
      return response.body;
    } else {
      return (
        "```" +
        `[PlotGen: ERROR (diagram_source: '${parameters.diagram_source}', diagram_type: '${parameters.diagram_type}')] ` +
        response.body +
        "```"
      );
    }
  } catch (e) {
    // fail silently
    return null;
  }
};
