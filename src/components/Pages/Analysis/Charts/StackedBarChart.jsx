import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { recordStats } from "framer-motion";

export default function StackedBarChart({
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

    // --- Prepare days and categories ---
    const dayFormat = d3.utcFormat("%Y-%m-%d"); // UTC-safe
    const today = new Date();
    const allDays = d3.utcDays(
      d3.utcDay.offset(today, -timeframe),
      d3.utcDay.offset(today, 0)
    );

    const category_list = getCategories(categories);

    // --- Aggregate counts by day and category ---
    const aggregatedData = d3.rollups(
      data,
      (v) => v.length, // count errors
      (d) => dayFormat(new Date(d.timestamp)), // day
      (d) => d.category_standard // category
    );

    // --- Convert aggregated data into a lookup map ---
    const dataMap = new Map();
    aggregatedData.forEach(([day, cats]) => {
      cats.forEach(([cat, count]) => {
        dataMap.set(day + "|" + cat, count);
      });
    });

    // --- Build stackData for D3 stack layout ---
    const stackData = allDays.map((day) => {
      const dayObj = { date: dayFormat(day) };
      category_list.forEach((cat) => {
        const key = dayFormat(day) + "|" + cat;
        dayObj[cat] = dataMap.get(key) || 0;
      });
      return dayObj;
    });

    // --- Create stack layout ---
    const stack = d3.stack().keys(category_list);
    const series = stack(stackData);

    // --- Scales ---
    const x = d3
      .scaleBand()
      .domain(allDays.map(dayFormat))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(stackData, (d) =>
          category_list.reduce((sum, key) => sum + d[key], 0)
        ),
      ])
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

    // --- Axes ---
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(allDays.map(dayFormat))
          .tickFormat((d) => d.slice(5)) // show MM-DD
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.15em")
      .attr("transform", "rotate(-45)");

    g.append("g").call(d3.axisLeft(y));

    // --- Draw stacked bars ---
    g.selectAll("g.layer")
      .data(series)
      .join("g")
      .attr("class", "layer")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => x(d.data.date))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .style("cursor", "pointer")
      .on("mouseenter", (event, d) => {
        const category = d3.select(event.currentTarget.parentNode).datum().key;
        g.selectAll("g.layer")
          .transition()
          .duration(100)
          .attr("opacity", function (l) {
            return l.key === category ? 1 : 0.1;
          });
      })
      .on("mouseleave", () => {
        g.selectAll("g.layer").transition().duration(100).attr("opacity", 1);
      });
  }, [data, categories, width, height, timeframe]);

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
