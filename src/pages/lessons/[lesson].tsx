import { NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Lessons } from "../../lessons";

const DynamicEditor = dynamic(
  () => import("../../components/workflowEditor").then((x) => x.Editor),
  {
    loading: () => <p>Loading ...</p>,
    ssr: false,
  }
);

const LessonPage: NextPage<{ lesson: number }> = ({ lesson }) => {
  const l = Lessons[lesson - 1];

  return (
    <>
      <div className="flex justify-center p-3">
        <h1>GitHub Actions 🦸</h1>
      </div>
      <div className="flex justify-end">
        <Link as={`/lessons/${lesson - 1}`} href="/lessons/[lesson]">
          <button disabled={lesson <= 1}>&lt;</button>
        </Link>
        <button>Dropdown</button>
        <Link as={`/lessons/${lesson + 1}`} href="/lessons/[lesson]">
          <button>&gt;</button>
        </Link>
      </div>
      <div className="flex">
        <div className="flex flex-col flex-1 bg-blue-300 rounded-md rounded-r-none p-3">
          <div>{l.description}</div>
          <div>
            <DynamicEditor
              workflow={l.workflow}
              change={(v) => console.log(v)}
            />
          </div>
          <div className="self-end">
            <button className="p-2">Run workflow</button>
          </div>
        </div>
        <div className="flex-1 bg-gray-300 rounded-md rounded-l-none p-3">
          Chart
          <svg
            width="300"
            height="100"
            viewBox="0 0 603 228"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M330.5 29.5H582.5C593.546 29.5 602.5 38.4543 602.5 49.5V178.5C602.5 189.546 593.546 198.5 582.5 198.5H330.5C330.5 214.516 317.516 227.5 301.5 227.5C285.484 227.5 272.5 214.516 272.5 198.5H20.5C9.45432 198.5 0.5 189.546 0.5 178.5V49.5C0.5 38.4543 9.4543 29.5 20.5 29.5H272.5C272.5 13.4837 285.484 0.5 301.5 0.5C317.516 0.5 330.5 13.4837 330.5 29.5Z"
              fill="#C4C4C4"
            />
            <circle cx="302" cy="198" r="20" fill="#717171" />
            <circle cx="302" cy="29" r="20" fill="#717171" />
          </svg>
        </div>
      </div>
    </>
  );
};

LessonPage.getInitialProps = (context) => {
  const lesson = parseInt(context.query["lesson"] as string, 10);

  return { lesson };
};

export default LessonPage;
