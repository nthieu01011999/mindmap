d3.json("data/mindmap_data.json").then(function(data) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const svg = d3.select("#mindmap-svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    const g = svg.append("g");
    
    const zoom = d3.zoom()
        .scaleExtent([0.5, 2])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });
    
    svg.call(zoom);

    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(0, 0));

    const link = g.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke-width", 2);

    const node = g.append("g")
        .selectAll("g")
        .data(data.nodes)
        .join("g")
        .call(drag(simulation));

    node.append("circle")
        .attr("r", 25)
        .attr("fill", d => d.level === 1 ? "red" : d.level === 2 ? "orange" : d.level === 3 ? "blue" : d.level === 4 ? "green" : "purple");

    node.append("text")
        .text(d => d.id)
        .attr("x", 30)
        .attr("y", 5)
        .attr("font-size", "14px")
        .attr("fill", "black");

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function drag(simulation) {
        return d3.drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    }
});
