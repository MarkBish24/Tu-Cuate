import React from "react";

export default function EmphasisList({ categories }) {
  const organizedCategories = categories.sort(
    (a, b) => b.emphasis_score - a.emphasis_score
  );

  function getPriority(weight) {
    if (weight >= 0.75) return { label: "High Priority", color: "#e74c3c" }; // red
    if (weight >= 0.5) return { label: "Moderate Priority", color: "#f1c40f" }; // yellow
    if (weight >= 0.25) return { label: "Low Priority", color: "#3498db" }; // blue
    return { label: "Minimal Priority", color: "#95a5a6" }; // gray
  }
  return (
    <>
      <h1>Emphasis List</h1>
      <ul>
        {organizedCategories.map((cat, index) => {
          const { label, color } = getPriority(cat.emphasis_score);
          return (
            <li
              key={index}
              style={{
                backgroundColor: color,
                padding: "5px 10px",
                marginBottom: "5px",
                borderRadius: "5px",
                color: "#fff",
              }}
            >
              {cat.category_standard} — {label} (
              {Math.round(cat.emphasis_score * 100)}
              %)
            </li>
          );
        })}
      </ul>
    </>
  );
}
