import "codemirror/mode/yaml/yaml";
import * as React from "react";
import { UnControlled as ReactCodeMirror } from "react-codemirror2";
import style from "./workflowEditor.module.css";

interface Region {
  start: CodeMirror.Position;
  end: CodeMirror.Position;
}

function foo(
  token: string,
  workflow: string
): {
  workflow: string;
  readonlyRegions: Region[];
  editableRegions: Region[];
} {
  const readonlyRegions: Region[] = [];
  const editableRegions: Region[] = [];

  let readonlyStart: CodeMirror.Position | undefined = { line: 0, ch: 0 };
  let editableStart: CodeMirror.Position | undefined;

  const lines = workflow.split("\n");
  for (let i = 0; i < lines.length; ++i) {
    let tokensPerLine = 0;
    let tokenPos = -1;
    while ((tokenPos = lines[i].indexOf(token, tokenPos + 1)) !== -1) {
      ++tokensPerLine;
      // Found a token, determine what to do
      if (!readonlyStart) {
        // End an editable region,
        editableRegions.push({
          start: editableStart,
          end: { line: i, ch: tokenPos },
        });
        editableStart = undefined;

        // begin a readonly one
        readonlyStart = { line: i, ch: tokenPos + 1 };
      } else {
        // End a readonly region,
        readonlyRegions.push({
          start: readonlyStart,
          end: { line: i, ch: tokenPos - 1 },
        });
        readonlyStart = undefined;

        // Begin an editable one
        editableStart = { line: i, ch: tokenPos };
      }
    }
  }

  if (readonlyStart) {
    // Assume the last region is readonly
    readonlyRegions.push({
      start: readonlyStart,
      end: { line: lines.length + 1, ch: 99999 },
    });
  }

  return {
    workflow: workflow.replace(new RegExp(token, "g"), ""),
    editableRegions,
    readonlyRegions,
  };
}

function posInRange(
  pos: CodeMirror.Position,
  rangeFrom: CodeMirror.Position,
  rangeEnd: CodeMirror.Position
): boolean {
  return (
    pos.line >= rangeFrom.line &&
    pos.ch >= rangeFrom.ch &&
    pos.line <= rangeEnd.line &&
    pos.ch <= rangeEnd.ch
  );
}

export const Editor: React.FC<{ workflow: string }> = ({ workflow }) => {
  const editor = React.useRef<CodeMirror.Editor>();

  const {
    workflow: transformedWorkflow,
    editableRegions,
    readonlyRegions,
  } = foo("@", workflow);

  React.useEffect(() => {
    if (editor.current) {
      const editableMarks = editableRegions.map((r) => {
        if (r.start.line != r.end.line) {
          // Multline region, add line styles
          for (let l = r.start.line; l <= r.end.line; ++l) {
            editor.current.addLineClass(l, "", style.foo);
          }
        }

        return editor.current.markText(r.start, r.end, {
          className: style.foo,
          clearWhenEmpty: false,
          inclusiveLeft: true,
          inclusiveRight: true,
        });
      });

      editor.current.on("beforeSelectionChange", ((
        doc,
        obj: {
          update: (any: any[]) => void;
          ranges: {
            head: CodeMirror.Position;
            anchor: CodeMirror.Position;
          }[];
        }
      ) => {
        if (!doc) {
          return;
        }

        // Prevent multi-range selection
        if (obj.ranges && obj.ranges.length > 1) {
          obj.update([]);
          return;
        }

        const { head, anchor } = obj.ranges[0];
        if (head.line === anchor.line && head.ch === anchor.ch) {
          return;
        }

        for (const em of editableMarks) {
          // Check if edit spans any of editable regions
          const range = em.find();
          const anchorInRange = posInRange(anchor, range.from, range.to);
          const headInRange = posInRange(head, range.from, range.to);
          if ((anchorInRange || headInRange) && anchorInRange !== headInRange) {
            // Selection covers this range, restrict selection to it
            obj.update([
              {
                head: range.from,
                anchor: range.to,
              },
            ]);
            return;
          }
        }
      }) as any);

      editor.current.on("beforeChange", (doc, obj) => {
        // Prevent editable regions from being removed
        for (const em of editableMarks) {
          // Check if edit spans any of editable regions
          const r = em.find();
          const x = posInRange(obj.from, r.from, r.to);
          const y = posInRange(obj.to, r.from, r.to);
          if ((x || y) && x != y) {
            obj.cancel();
            return;
          }
        }
      });

      readonlyRegions.forEach((r) => {
        editor.current.markText(r.start, r.end, {
          readOnly: true,
          atomic: true,
          inclusiveLeft: true,
          inclusiveRight: true,
          //   selectLeft: false,
          //   selectRight: false,
          handleMouseEvents: false,
        });
      });
    }
  }, [workflow]);

  return (
    <div className={style.editor}>
      <ReactCodeMirror
        editorDidMount={(e) => (editor.current = e)}
        value={transformedWorkflow}
        options={{
          mode: "yaml",
          theme: "monokai",
          lineNumbers: true,
          scrollbarStyle: null,
        }}
      />
      <ReactCodeMirror
        value={transformedWorkflow}
        options={{
          mode: "yaml",
          theme: "monokai",
          lineNumbers: true,
          firstLineNumber: 18,
          scrollbarStyle: null,
          readOnly: true,
        }}
      />
    </div>
  );
};
