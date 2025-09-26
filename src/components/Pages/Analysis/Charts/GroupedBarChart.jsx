import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function GroupedBarChart({
  data,
  categories,
  width = 800,
  height = 400,
}) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 30, right: 39, bottom: 50, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
  });
}
