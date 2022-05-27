const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

let values;

let yScale;
let xScale;
let xAxisScale;
let yAxisScale;

const w = 800;
const h = 600;
const padding = 60;

const svg = d3.select("svg.canvas");

let drawCanvas = () => {
    svg
    .attr("width", w)
    .attr("height", h)
}

let generateScales = () => {
    yScale = d3.scaleLinear()
                .domain([0, d3.max(values, v => {
                    return v[1];
                })])
                .range([0, h - (padding * 2)]);
    
    xScale = d3.scaleLinear()
                .domain([0, values.length - 1])
                .range([padding, w - padding]);
    
    let datesArr = values.map(v => {
        return new Date(v[0])
    });

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArr), d3.max(datesArr)])
                    .range([padding, w - padding]);
    
    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, v => {
                        return v[1];
                    })])
                    .range([h - padding, padding]);
}

let drawAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (h - padding) + ')')
    
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}

let drawBars = () => {

    let tooltip = d3.select('.container')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('height', (value) => {
            return yScale(value[1]);
        })
        .attr('width', ((w - (padding * 2)) / values.length))
        .attr('x', (value, ind) => {
            return xScale(ind)
        })
        .attr('y', (value) => {
            return h - padding - yScale(value[1])
        })
        .attr('data-date', (value) => {
            return value[0]
        })
        .attr('data-gdp', (value) => {
            return value[1]
        })
        .on('mouseover', (event, value) => {
            tooltip.transition()
                .duration(300)
                .style('visibility', 'visible')
            
            tooltip.text(value[0] + ' - $' + value[1].toFixed(2) + ' Billion')
            tooltip.attr('data-date', value[0])
            

        })
        .on('mouseout', (value) => {
            tooltip.transition()
            .duration(300)
            .style('visibility', 'hidden')
        })
        
}

d3.json(url)
    .then((data) => {
        values = data.data;
        drawCanvas();
        generateScales();
        drawAxes();
        drawBars();
    })
    .catch(e => console.log(e));












