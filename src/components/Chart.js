import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart = (props) => {
    const dateList = props.data.map((value) => {
        return (value.t);
    })

    const valueList = props.data.map((value) => {
        return (parseFloat(value.v));
    });
    var options = {
        chart: {
            type: 'spline',
            zoomType: 'x'
        },
        xAxis: {
            type: 'category',
            categories: dateList
        },
        yAxis: {
            title: {
                text: 'Height in feet'
            }
        },
        title: {
            text: '7-Day Forecast'
        },
        series: [
            {
                name: 'Height in feet',
                data: valueList
            }
        ]
    }

    return (
        <HighchartsReact highcharts={Highcharts} options={options} />
    );
}

export default Chart;
    