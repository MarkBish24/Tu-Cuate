import ConvoTab from "../../ConvoTab/ConvoTab.jsx";
import { FaComments } from "react-icons/fa"; // chat bubbles
import { HiUserGroup } from "react-icons/hi"; // group chat feel
import { RiTranslate2 } from "react-icons/ri"; // modern translate

import "./Home.css";

const iconSize = 100;

export const ConvoTabData = [
  {
    title: "Analysis",
    description: "Analyze your mistakes that you made in the Past.",
    icon: <HiUserGroup size={iconSize} />,
    targetUrl: "/analysis",
  },
  {
    title: "Q&A",
    description: "Answer Cuate's questions to reinforce understanding.",
    icon: <FaComments size={iconSize} />,
    targetUrl: "/qa",
  },
  {
    title: "Translation",
    description: "Translate what Cuate says in English or Spanish.",
    icon: <RiTranslate2 size={iconSize} />,
    targetUrl: "/translation",
  },
];

// home page that allows you to select with Converstaion, Q&A, or Translations

export default function Home() {
  return (
    <>
      <div className="conversation-tab-cntr">
        {ConvoTabData.map((tab, i) => (
          <ConvoTab
            key={i}
            title={tab.title}
            description={tab.description}
            icon={tab.icon}
            route={tab.targetUrl}
          />
        ))}
      </div>
    </>
  );
}
