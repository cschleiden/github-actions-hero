import Router from "next/router";
import { useEffect } from "react";
import "../../styles/main.css";
import { initGA, logPageView } from "../analytics";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initGA();
    logPageView();
    Router.events.on("routeChangeComplete", logPageView);
  }, []);

  return <Component {...pageProps} />;
}
