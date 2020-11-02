export default function BarChart(container) {
    // initialization
    // 1. Create a SVG with the margin convention
    const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
    };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const group = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // 2. Define scales using scaleTime() and scaleLinear()
    // Only specify ranges. Domains will be set in the 'update' function
    const xScale = d3.scaleBand().range([0, width]).paddingInner(0.1);
    const yScale = d3.scaleLinear().range([height, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const xAxis = d3.axisBottom().scale(xScale);
    let xAxisGroup = group.append('g').attr('class', 'x-axis axis');

    const yAxis = d3.axisLeft().scale(yScale);
    let yAxisGroup = group.append('g').attr('class', 'y-axis axis');

    let yLabel = d3
        .select("g")
        .append("text")
        .text("Funding Rounds")
        .attr("class", "axis-label")
        .attr("x",-20)
        .attr("y", -8)
        .style("font","11px times")
        .style("font-family","sans-serif")

    function update(data, type, years) {
        const dataObj = {};

        if (type === 'regions') {
            data.forEach((el) => {
                const cpRegion = el['company_region'];
                if (!cpRegion) return;
                const year = el['funded_year'];
                if (years === year) {
                    if (dataObj[cpRegion]) {
                        dataObj[cpRegion]++;
                    } else {
                        dataObj[cpRegion] = 1;
                    }
                }
            });
        } else if (type === 'categories') {
            data.forEach((el) => {
                const cpMarket = el['company_market'];
                if (!cpMarket) return;
                const year = el['funded_year'];
                if (years === year) {
                    if (dataObj[cpMarket]) {
                        dataObj[cpMarket]++;
                    } else {
                        dataObj[cpMarket] = 1;
                    }
                }
            });
        } else if (type === 'countries') {
            data.forEach((el) => {
                const cpCountry = el['company_country_code'];
                if (!cpCountry) return;
                const year = el['funded_year'];
                if (years === year) {
                    if (dataObj[cpCountry]) {
                        dataObj[cpCountry]++;
                    } else {
                        dataObj[cpCountry] = 1;
                    }
                }
            });
        }
        let keys = Object.keys(dataObj);
        keys.sort((a, b) => dataObj[b] - dataObj[a]);

        let values = keys.map((e) => {
            return [e, dataObj[e]];
        });

        // top 10
        let sliced_keys = keys.slice(0, 10);
        let sliced_values = values.slice(0, 10);

        // scales
        xScale.domain(sliced_keys);
        yScale.domain([0, values[0][1]]);
        colorScale.domain(keys);

        xAxisGroup
            .attr('transform', 'translate(0,' + height + ')')
            .transition()
            .duration(500)
            .attr('text-weight', 'bold')
            .call(xAxis);
        yAxisGroup
            .transition()
            .duration(500)
            .call(yAxis);

        let bars = group
            .selectAll('rect')
            .data(sliced_values, d => {
                console.log('hello', d);
                return d[0];
            });

        bars
            .enter()
            .append('rect')
            .attr('y', height)
            .attr("class", "bar")
            .merge(bars)
            .on("mouseenter", (event, d) => {
                const pos = d3.pointer(event, window)
                d3.select('.tooltip')
                    .style('display', 'inline-block')
                    .style('top', pos[1] -450 + 'px')
                    .style('left', pos[0] + 7 + 'px')
                    .html(("year: " + years + "<br>" + type + ": " + d[0] + "<br>Rounds: " + d[1]).toUpperCase());
            })
            .on("mouseleave", (event, d) => {
                d3.select('.tooltip')
                    .style('display', 'none');
            })
            .transition()
            .duration(1000)
            .attr('x', d => xScale(d[0]))
            .attr('y', d => yScale(d[1]))
            .attr('width', d => xScale.bandwidth())
            .attr('height', d => (height - yScale(d[1])))
            .attr('fill', "steelblue");

        bars
            .exit()
            .remove();
    }
    return {
        update,
    };
}