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

    const margin = { top: 30, right: 39, bottom: 50, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Organizing Day timeframe data
    const today = new Date();
    const allDays = d3.timeDays(
      d3.timeDay.offset(today, -timeframe + 1),
      d3.timeDay.offset(today, 1)
    );

    const dayFormat = d3.timeFormat("%Y-%m-%d");

    const category_list = getCategories(categories);

    const dataMap = new Map(
      data.map((d) => [
        dayFormat(new Date(d.date)) + "|" + d.category_standard,
        +d.count,
      ])
    );

    const normalizedData = [];
    allDays.forEach((day) => {
      category_list.forEach((cat) => {
        const key = dayFormat(day) + "|" + cat;
        normalizedData.push({
          date: dayFormat(day),
          category_standard: cat,
          value: dataMap.get(key) || 0,
        });
      });
    });

    const x0 = d3
      .scaleBand()
      .domain(allDays.map(dayFormat))
      .range([0, innerWidth])
      .padding(0.2);

    const x1 = d3
      .scaleBand()
      .domain(category_list)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(normalizedData, (d) => +d.value)])
      .nice()
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal().domain(category_list).range([
      "#FFB347", // soft orange
      "#FF7043", // bright orange-red
      "#FFCC00", // golden yellow
      "#D84315", // deep orange-red
      "#FFC107", // amber
      "#BF360C", // burnt maroon
      "#FF9800", // vivid orange
      "#B71C1C", // dark maroon/red
    ]);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x0)
          .tickValues(allDays.map(dayFormat))
          .tickFormat((d) => d.slice(5))
      );

    g.append("g").call(d3.axisLeft(y));

    g.selectAll("g.group")
      .data(allDays.map(dayFormat))
      .join("g")
      .attr("class", "group")
      .attr("transform", (d) => `translate(${x0(d)},0)`)
      .selectAll("rect")
      .data((day) => normalizedData.filter((row) => row.date === day))
      .join("rect")
      .attr("x", (d) => x1(d.category_standard))
      .attr("y", (d) => y(+d.value))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => innerHeight - y(d.value))
      .attr("fill", (d) => color(d.category_standard));
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

  return <svg ref={ref} width={width} height={height}></svg>;
}
