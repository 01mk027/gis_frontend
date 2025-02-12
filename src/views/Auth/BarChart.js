import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const [graphData, setGraphData] = useState([]);
  const chartRef = useRef();
  const tooltipRef = useRef();
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setGraphData(data);
  }, [data]);

  // Update chart size on window resize
  useEffect(() => {
    const updateChartSize = () => {
      const svg = d3.select(chartRef.current);
      const container = svg.node().parentNode;
      setChartSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateChartSize(); // Set initial chart size
    window.addEventListener('resize', updateChartSize); // Listen for window resize

    return () => {
      window.removeEventListener('resize', updateChartSize);
    };
  }, []);

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    const tooltip = d3.select(tooltipRef.current);

    const width = chartSize.width;
    const height = chartSize.height;

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    // Clear previous content
    svg.selectAll('*').remove();

    // Set viewBox for responsiveness
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create the bars
    svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.name))
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d.value))
      .attr('fill', 'steelblue')
      .on('mouseover', function (event, d) {
        tooltip
          .style('opacity', 1)
          .html(`Name: ${d.name}<br>Value: ${d.value}`);
      })
      .on('mousemove', function (event) {
        const tooltipWidth = tooltip.node().offsetWidth;
        const tooltipHeight = tooltip.node().offsetHeight;
        const containerRect = chartRef.current.getBoundingClientRect();

        // Calculate mouse position relative to the SVG canvas
        const mouseX = event.clientX - containerRect.left;
        const mouseY = event.clientY - containerRect.top;

        let leftPosition = mouseX + 5;
        let topPosition = mouseY - 28;

        // Prevent overflow within the graph canvas on the right and bottom
        if (leftPosition + tooltipWidth > width - margin.right) {
          leftPosition = width - margin.right - tooltipWidth;
        }

        if (topPosition + tooltipHeight > height - margin.bottom) {
          topPosition = height - margin.bottom - tooltipHeight;
        }

        // Prevent overflow on the left and top
        if (leftPosition < margin.left) {
          leftPosition = margin.left;
        }

        if (topPosition < margin.top) {
          topPosition = margin.top;
        }

        tooltip
          .style('left', `${leftPosition}px`)
          .style('top', `${topPosition}px`);
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0);
      });

    // Add X Axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    // Add Y Axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
  }, [data, chartSize]);

  return (
    <div style={{ position: 'relative', display: 'flex', width: '100%', height: '400px', justifyContent: 'center' }}>
      <svg ref={chartRef} style={{ width: '100%', height: '100%', backgroundColor: 'white' }}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '5px',
          borderRadius: '4px',
          pointerEvents: 'none',
          opacity: 0,
          maxWidth: '200px',
          wordWrap: 'break-word',
        }}
      ></div>
    </div>
  );
};

export default BarChart;
