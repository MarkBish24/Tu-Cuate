import { useRef, useState, useEffect } from "react";
import * as d3 from "d3";

export default function PieChart({ data, valueKey, labelKey, width, height }) {
  const ref = useRef();
  const [hoveredSliceInfo, setHoveredSliceInfo] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const radius = Math.min(width, height) / 2;
    const maxRadius = 100;
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
      })
      .on("mouseleave", (event, d) => {
        setHoveredSliceInfo(null);

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("transform", "translate(0,0)");
      });
  }, [data]);
  return (
    <div>
      <div className="flex items-center justify-center h-full">
        <svg ref={ref} width={width} height={height}></svg>
      </div>
      {hoveredSliceInfo && (
        <div className="mt-2 text-center">
          <p className="inline-block">
            <strong>{hoveredSliceInfo.category}</strong>
          </p>
          <p className="inline-block">Count: {hoveredSliceInfo.count}</p>
          <p className="inline-block">
            Correctness: {hoveredSliceInfo.avg_correctness.toFixed(2)}
          </p>
          <p className="inline-block">
            Difficulty: {hoveredSliceInfo.avg_difficulty.toFixed(2)}
          </p>
          <p className="inline-block">
            Emphasis: {hoveredSliceInfo.emphasis_score.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
