import "codemirror/mode/yaml/yaml";
import * as React from "react";
import { UnControlled as ReactCodeMirror } from "react-codemirror2";
import style from "./workflowEditor.module.css";

//
// Tried some different options here, see 23970c432107ad13ad4f079ea524936353c87dd4 but for now
// going to use different editors for the different regions.
//

interface Range {
  start: number;
  end: number;
  editable: boolean;
  text: string;
}

function getRanges(token: string, workflow: string): Range[] {
  const ranges: Range[] = [];

  const lines = workflow.split("\n");

  // Start off readonly
  let start = 0;
  let editable = false;
  for (let i = 0; i < lines.length; ++i) {
    const lineEditable = lines[i].indexOf(token) !== -1;

    if (editable != lineEditable) {
      // End region
      ranges.push({
        start,
        end: i,
        editable,
        text: lines
          .slice(start, i)
          .join("\n")
          .replace(new RegExp(token, "g"), ""),
      });

      start = i;
      editable = lineEditable;
    }
  }

  // End the last region
  ranges.push({
    start,
    end: lines.length,
    editable,
    text: lines
      .slice(start, lines.length)
      .join("\n")
      .replace(new RegExp(token, "g"), ""),
  });

  return ranges;
}

export const Editor: React.FC<{
  workflow: string;
  change: (value: string) => void;
  everythingEditable?: boolean;
}> = ({ workflow, change, everythingEditable }) => {
  const editors = React.useRef<CodeMirror.Editor[]>([]);

  const ranges = everythingEditable
    ? [
        {
          start: 0,
          end: 0,
          editable: true,
          text: workflow,
        },
      ]
    : getRanges("%", workflow);

  return (
    <div className={style.editorWrapper}>
      {ranges.map((r, i) => (
        <ReactCodeMirror
          key={i}
          className={(r.editable ? style.editable : style.readonly) || ""}
          editorDidMount={(e) => (editors.current[i] = e)}
          value={r.text}
          options={{
            mode: "yaml",
            theme: "monokai",
            lineNumbers: true,
            scrollbarStyle: null,
            coverGutterNextToScrollbar: true,
            viewportMargin: Infinity,
            readOnly: !r.editable,
            autofocus: r.editable,
            firstLineNumber: r.start + 1,
            indentWithTabs: false,
            smartIndent: true,
            tabSize: 2,
            extraKeys: {
              Tab: (cm) => cm.execCommand("indentMore"),
              "Shift-Tab": (cm) => cm.execCommand("indentLess"),
            },
          }}
          onChange={(editor, data, value) => {
            const v = ranges.map((r) => r.text);
            v[i] = value;

            // Updates line numbers
            let start = 1;
            ranges.forEach((r, i) => {
              if (editors.current[i]) {
                editors.current[i].setOption("firstLineNumber", start);
                start += editors.current[i].getValue().split("\n").length;
              }
            });

            change(v.join("\n").replace(/\t/g, " "));
          }}
        />
      ))}
    </div>
  );
};
