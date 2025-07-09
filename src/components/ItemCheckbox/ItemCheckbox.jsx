import { useState } from "react";
import "./ItemCheckbox.css";

export default function ItemCheckbox({ data }) {
  const [checked, setChecked] = useState(data.active);

  const handleChange = async (e) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);

    try {
      const result = await window.electronAPI.checkItem(data.id, newChecked);
      if (!result.success) {
        console.error("Failed to update:", result.error);
        setChecked(!newChecked);
      }
    } catch (err) {
      console.error("IPC error:", err);
      setChecked(!newChecked);
    }
  };

  return (
    <label className="drop-down-info-item" key={data.id}>
      <p className="drop-down-info-p" style={{ margin: 0 }}>
        {data.spanish}
        <span style={{ fontStyle: "italic", marginLeft: 6 }}>
          – {data.english}
        </span>
      </p>
      <input
        className="drop-down-checkbox"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
    </label>
  );
}
