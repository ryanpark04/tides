import React, { useState } from 'react';
import { Grid, Header, Segment, Container } from 'semantic-ui-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import CurrentTide from './components/CurrentTide';

const options = {
    chart: {
        type: 'spline',
        zoomType: 'x'
    },
    title: {
        text: 'Test'
    },
    series: [
        {
            data: [-1.006, 4.057, 2.142, 6.784, -1.577, 4.210, 2.363, 6.967 , -1.892, 4.313, 2.520, 6.964, -1.951, 4.385, 2.637, 6.763]
        }
    ]
}

const App = () => {
    const [location, setLocation] = useState(null);
    const [tideData, setTideData] = useState([]);
    const [today, setToday] = useState([]);

    const fetchData = async (location) => {
        setLocation(location);

        const getDateArray = (date) => {
            const yyyy = date.getFullYear().toString();
            const mm = (date.getMonth() + 1).toString();
            const dd = date.getDate().toString();

            return [
                yyyy,
                (mm.length > 1 ? mm : '0' + mm),
                (dd.length > 1 ? dd : '0' + dd)
            ];
        }

        const d = new Date();

        const d30 = new Date(d);
        d30.setDate(d.getDate() + 30);

        const beginDateString = getDateArray(d).join('');
        const endDateString = getDateArray(d30).join('');

        const { data: { predictions } } = await axios.get('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter', {
            params: {
                begin_date: beginDateString,
                end_date: endDateString,
                product: 'predictions',
                datum: 'MLLW',
                station: location.id,
                units: 'english',
                time_zone: 'lst_ldt',
                interval: 'hilo',
                format: 'JSON',
                application: 'web_services'
            },
        });
        const currentTide = predictions.filter((tide) => {
            return tide.t.includes(getDateArray(d).join('-'));
        });

        setTideData(predictions);
        setToday(currentTide);
    }

    const renderCurrentTide = (data, today) => {
        if (data.length === 0 && today.length === 0) {
            return;
        }
        return (
            <CurrentTide data={today} />
        );
    }

    const renderChart = (data, today) => {
        if (data.length === 0 && today.length === 0) {
            return;
        }
        return (
            <Segment>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </Segment>
        );
    }

    return (
        <Container>
            <Grid>
                <Grid.Row/>
                <Grid.Row>
                    <Grid.Column>
                        <SearchBar fetchData={fetchData} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={11}>        
                        {renderChart(tideData, today)}
                    </Grid.Column>
                    <Grid.Column width={5}>        
                        {renderCurrentTide(tideData, today)}
                    </Grid.Column> 
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>        
                        {renderChart(tideData, today)}
                    </Grid.Column>
                </Grid.Row>   
            </Grid>
        </Container>
        
    );
}

export default App;