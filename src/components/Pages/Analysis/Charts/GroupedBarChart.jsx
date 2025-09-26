import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function GroupedBarChart({
  data,
  categories,
  width = 800,
  height = 400,
  timeframe,
}) {
  const ref = useRef();
  const [highlightedCategory, setHighlightedCategory] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    console.log(data);

    const margin = { top: 30, right: 39, bottom: 50, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  });

  function getCategories(categories) {
    let category_list = [];

    categories.forEach((category) => {
      if (!category_list.includes(category.category_standard)) {
        category_list.push(category.category_standard);
      }
    });

    return category_list;
  }

  const category_list = getCategories(categories);
  console.log(category_list);
  // X scale for days
  const x0 = d3.scaleBand().domain();
}
