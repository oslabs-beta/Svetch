import { tree, hierarchy, select, linkHorizontal } from 'd3';

export default {

  render: (data, el, width) => {
    const margin = { top: 50, right: 50, bottom: 50, left: 55};
    let depth = 0;
    const linkLayout = linkHorizontal().x(d => d.y).y(d => d.x)
    const svg = select(el)
    .attr("viewBox", [-margin.left, -margin.top, width, 10])
    .style("font", "16px sans-serif")
    .style("user-select", "none");
    
    const root = hierarchy(data);
    
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.depth > 0) d.children = null;
      if (d.depth && d.depth >= depth) depth = d.depth + 1
    });
    
    let dy = width / depth;
    let dx = 50;
    root.x0 = 15;
    root.y0 = 0;

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#fefefe")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    const update = (source) => {
      const duration = 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout.
      const newTree = tree().nodeSize([dx, dy])
      newTree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;

      const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

      // Update the nodes…
      const node = gNode.selectAll("g")
        .data(nodes, d => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

      nodeEnter.append("circle")
        .attr("r", 5)
        .attr("fill", d => d._children ? "#fefefe" : "#afafaf")
        .attr("stroke-width", 10);

      nodeEnter.append("text")
        .attr("dy", d => d._children ? "-0.5em" : "0.3em")
        .attr("x", d => d._children ? 0 : '0.5em')
        .attr("fill", "#fefefe")
        .attr("text-anchor", d => d._children ? "middle" : "start")
        .text(d => d.data.name);

      // Transition nodes to new positions
      const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      // Transition exiting nodes to the parent's new position
      const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // Update links
      const link = gLink.selectAll("path")
        .data(links, d => d.target.id);

      // Enter any new links at the parent's previous position
      const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return linkLayout({source: o, target: o});
        });

      // Transition links to new positions
      link.merge(linkEnter).transition(transition)
        .attr("d", linkLayout);

      // Transition exiting nodes to parent's position
      link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return linkLayout({source: o, target: o});
        });

      // Stash the old positions for transition
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }
    update(root);
  }
};
