import { useRef, useState, useEffect } from "react";
import * as d3 from "d3";

export default function PieChart({ data, valueKey, labelKey, width, height }) {
  const ref = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const radius = Math.min(width, height) / 2;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d[labelKey]))
      .range(d3.schemeSet2);

    const pie = d3.pie().value((d) => d[valueKey])(data);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const tooltip = d3.select(tooltipRef.current);

    g.selectAll("path")
      .data(pie)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data[labelKey]))
      .style("stroke-width", "2px")
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(`<p>${d.data[valueKey]} , ${d.data[labelKey]}</p>`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseleave", () => {
        tooltip.style("opacity", 0);
      });
  }, [data]);
  return (
    <div className="relative">
      <svg ref={ref}></svg>
      <div
        ref={tooltipRef}
        className="absolute opacity-0  bg-white border border-gray-300 rounded-lg px-2 py-1.5 pointer-events-none text-xs shadow-md"
      ></div>
    </div>
  );
}
