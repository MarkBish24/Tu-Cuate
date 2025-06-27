import "./SettingsTab.css";

export default function SettingsTab() {
  return (
    <>
      <ul className="settings-panel">
        <li className="settings-checkbox">
          <label>Verbs</label>
          <input type="checkbox" />
        </li>
        <li className="settings-checkbox">
          <label>Pronouns</label>
          <input type="checkbox" />
        </li>
        <li className="settings-checkbox">
          <label>Adverbs</label>
          <input type="checkbox" />
        </li>
        <li className="settings-checkbox">
          <label>Conjugation Tense</label>
          <input type="checkbox" />
        </li>
        <li className="settings-range">
          <label>CEFR Level</label>
          <input type="range" />
        </li>
        <li className="settings-range">
          <label>Response Length</label>
          <input type="range" />
        </li>
        {/* <li>
          <label>Vocab/Activity</label>
          <input type="range" />
        </li> */}
      </ul>
    </>
  );
}
