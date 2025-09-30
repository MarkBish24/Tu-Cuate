import { useRef, useState, useEffect } from "react";
import * as d3 from "d3";

export default function PieChart({ data, valueKey, labelKey, width, height }) {
  const ref = useRef();
  const tooltipRef = useRef();
  const [hoveredSliceInfo, setHoveredSliceInfo] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const radius = Math.min(width, height) / 2;
    const maxRadius = 130;
    const finalRadius = Math.min(radius, maxRadius);

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value((d) => d[valueKey])(data);
    const arc = d3.arc().innerRadius(0).outerRadius(finalRadius);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d[labelKey]))
      .range([
        "#FFB347", // soft orange
        "#FF7043", // bright orange-red
        "#FFCC00", // golden yellow
        "#D84315", // deep orange-red
        "#FFC107", // amber
        "#BF360C", // burnt maroon
        "#FF9800", // vivid orange
        "#B71C1C", // dark maroon/red
      ]);

    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "6px 10px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "8px")
      .style("box-shadow", "0px 2px 6px rgba(0,0,0,0.15)")
      .style("pointer-events", "none")
      .style("opacity", 0);

    g.selectAll("path")
      .data(pie)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data[labelKey]))
      .style("stroke-width", "2px")
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        setHoveredSliceInfo({
          category: d.data.category_standard,
          count: d.data.count,
          avg_correctness: d.data.avg_correctness,
          avg_difficulty: d.data.avg_difficulty,
          emphasis_score: d.data.emphasis_score,
        });
        const [x, y] = arc.centroid(d);
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("transform", `translate(${x * 0.3}, ${y * 0.3})`);

        tooltip.style("opacity", 1).html(`
            <strong>${d.data[labelKey]}</strong><br/>
            Count: ${d.data.count}<br/>
            Correctness: ${d.data.avg_correctness.toFixed(2)}<br/>
            Difficulty: ${d.data.avg_difficulty.toFixed(2)}<br/>
            Emphasis: ${d.data.emphasis_score.toFixed(2)}
          `);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseleave", (event, d) => {
        setHoveredSliceInfo(null);

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("transform", "translate(0,0)");

        tooltip.style("opacity", 0);
      });
  }, [data]);
  return (
    <div>
      <div className="flex items-center justify-center h-full">
        <svg ref={ref} width={width} height={height}></svg>
      </div>

      <div ref={tooltipRef}></div>
    </div>
  );
}
