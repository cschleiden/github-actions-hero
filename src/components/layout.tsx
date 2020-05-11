import * as React from "react";
import { Badge } from "./badge";

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Badge />

      {children}
    </>
  );
};
