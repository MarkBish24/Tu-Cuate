import { useState } from "react";
import ConvoTab from "./components/ConvoTab/ConvoTab.jsx";
import Microphone from "./components/microphone/microphone.jsx";
import "./App.css";

import { FaComments } from "react-icons/fa"; // chat bubbles
import { MdPeople } from "react-icons/md"; // group of people
import { RiUserVoiceLine } from "react-icons/ri"; // talking person
import { HiUserGroup } from "react-icons/hi"; // group chat feel

import { FaQuestionCircle } from "react-icons/fa"; // question help
import { MdQuestionAnswer } from "react-icons/md"; // chat bubble Q&A
import { RiQuestionAnswerLine } from "react-icons/ri"; // minimal Q&A
import { BiMessageDetail } from "react-icons/bi"; // message bubble

import { FaLanguage } from "react-icons/fa"; // language icon
import { MdTranslate } from "react-icons/md"; // clear translation
import { RiTranslate2 } from "react-icons/ri"; // modern translate

const iconSize = 80;

function App() {
  return (
    <>
      {/* <Microphone /> */}
      <div className="conversation-tab-cntr">
        <ConvoTab title="Conversation" icon={<HiUserGroup size={iconSize} />} />
        <ConvoTab title="Q&A" icon={<FaComments size={iconSize} />} />
        <ConvoTab title="Translation" icon={<RiTranslate2 size={iconSize} />} />
      </div>
    </>
  );
}

export default App;
