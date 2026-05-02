"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Bigram {
  source: string;
  target: string;
  value: number;
}

interface NetworkGraphProps {
  data: Bigram[];
}

export function NetworkGraph({ data }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const width = 600;
    const height = 400;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");

    const nodesMap: Record<string, any> = {};
    const links = data.map((d) => {
      if (!nodesMap[d.source]) nodesMap[d.source] = { id: d.source };
      if (!nodesMap[d.target]) nodesMap[d.target] = { id: d.target };
      return { source: d.source, target: d.target, value: d.value };
    });

    const nodes = Object.values(nodesMap);

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value) + 1);

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(
        d3.drag<any, any>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node
      .append("circle")
      .attr("r", 8)
      .attr("fill", "hsl(262 83% 58%)");

    node
      .append("text")
      .text((d) => d.id)
      .attr("x", 12)
      .attr("y", 4)
      .style("font-size", "12px")
      .style("fill", "#333")
      .style("stroke", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className="w-full h-[400px] border rounded-xl bg-white overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
