import * as React from "react";

export default () => {
  return (
    <>
      <div className="flex justify-center p-3">
        <h1>GitHub Actions Hero</h1>
      </div>
      <div className="flex">
        <div className="flex flex-col flex-1 bg-blue-300 rounded-md rounded-r-none p-3">
          <div>Editor</div>
          <div className="self-end">
            <button className="p-2">Go</button>
          </div>
        </div>
        <div className="flex-1 bg-gray-300 rounded-md rounded-l-none p-3">
          Chart
        </div>
      </div>
    </>
  );
};
