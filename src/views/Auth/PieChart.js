import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const PieChart = ({ data }) => {
  const chartRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const resizeChart = () => {
      const containerWidth = chartRef.current.parentElement.clientWidth;
      const containerHeight = 400; // Adjust the height as per your need
      const width = containerWidth;
      const height = containerHeight;
      const radius = Math.min(width, height) / 2;
      const legendRectSize = 15;
      const legendSpacing = 4;

      // Clear previous SVG content
      d3.select(chartRef.current).selectAll("*").remove();

      const svg = d3.select(chartRef.current)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      const chartGroup = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const tooltip = d3.select(tooltipRef.current)
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("pointer-events", "none");

      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.schemeCategory10);

      const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      const arcs = chartGroup.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

      arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.name))
        .on("mouseover", function (event, d) {
          const total = d3.sum(data.map(d => d.value));
          const percent = Math.round(1000 * d.data.value / total) / 10;
          tooltip
            .style("opacity", 1)
            .html(`${d.data.name}: ${percent}%`);
        })
        .on("mousemove", function (event) {
          const tooltipWidth = tooltip.node().offsetWidth;
          const tooltipHeight = tooltip.node().offsetHeight;
          const containerRect = chartRef.current.getBoundingClientRect();

          const mouseX = event.clientX - containerRect.left;
          const mouseY = event.clientY - containerRect.top;

          let leftPosition = mouseX + 10;
          let topPosition = mouseY - 25;

          if (leftPosition + tooltipWidth > width) {
            leftPosition = width - tooltipWidth - 10;
          }

          if (topPosition + tooltipHeight > height) {
            topPosition = height - tooltipHeight - 10;
          }

          tooltip
            .style("left", `${leftPosition}px`)
            .style("top", `${topPosition}px`);
        })
        .on("mouseout", function () {
          tooltip.style("opacity", 0);
        });

      // Create a custom legend
      const legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(5, ${i * (legendRectSize + legendSpacing) + 20})`);

      // Add rectangles to legend
      legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", color)
        .style("stroke", color);

      // Add text to legend
      legend.append("text")
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing)
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .text(d => d);
    };

    // Initial rendering of the chart
    resizeChart();

    // Resize chart when the window is resized
    window.addEventListener("resize", resizeChart);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", resizeChart);
  }, [data]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <svg ref={chartRef} style={{ width: '100%', height: '100%', backgroundColor:'white' }}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "5px",
          borderRadius: "4px",
          pointerEvents: "none",
          opacity: 0,
        }}
      ></div>
    </div>
  );
};

export default PieChart;
