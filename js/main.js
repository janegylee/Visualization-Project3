import BarChart from './barchart2.js';

d3.csv('data/rounds.csv', d3.autoType).then((data) => {


  let type = 'regions';
  let year = 2005;

  d3.select('#group-by')
    .on('change', e => {
      type = e.target.value;
      console.log('type', type);
      barchart.update(data, type, year);
    });
  
  d3.select('#group-by2')
    .on('change', e => {
      year = e.target.value;
      console.log('year', year);
      year = parseInt(year);
      barchart.update(data, type, year);
    });
  
  d3.select('#year')
    .on('click', e => {
      year = e.target.value;
      console.log('year', year);
      year = parseInt(year);
      barchart.update(data, type, year);
    });

  const barchart = BarChart('.chart-container1');
  barchart.update(data, type, year);

});