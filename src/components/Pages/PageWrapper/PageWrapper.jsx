import { useState } from "react";

import StartPage from "../StartPage/StartPage";
import "./PageWrapper.css";

export default function PageWrapper({ title }) {
  return (
    <div>
      <StartPage title={title} />
    </div>
  );
}
