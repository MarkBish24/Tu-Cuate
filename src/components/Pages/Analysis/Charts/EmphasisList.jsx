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

  if (!categories || organizedCategories.length === 0) {
    // Data not loaded yet or empty — render nothing
    return null;
  }
  return categories ? (
    <>
      <div
        display={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        {organizedCategories.map((cat, index) => {
          const { label, color } = getPriority(cat.emphasis_score);
          return (
            <div
              key={index}
              style={{
                backgroundColor: color,
                padding: "5px 10px",
                marginBottom: "5px",
                borderRadius: "5px",
                color: "#fff",
                listStyle: "none", // optional, to remove bullet
              }}
            >
              {cat.category_standard} — {label} (
              {Math.round(cat.emphasis_score * 100)}%)
            </div>
          );
        })}
      </div>
    </>
  ) : (
    <></>
  );
}
