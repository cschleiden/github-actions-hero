import dynamic from "next/dynamic";

/** Component to load the editor only client-side since it doesn't support SSR */
export const DynamicEditor = dynamic(
  () => import("../components/workflowEditor").then((x) => x.Editor),
  {
    loading: () => <p>Loading ...</p>,
    ssr: false,
  }
);
