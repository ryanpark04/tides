import React, { useState } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import axios from 'axios';
import SearchBar from './components/SearchBar';

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

    const renderTideInfo = (data, today) => {
        if (data.length === 0 && today.length === 0) {
            return;
        }
        return (
            <Segment>
                <Header>Today's Tides</Header>
                <pre style={{ overflowX: 'auto' }}>
                    {JSON.stringify(today, null, 4)}
                </pre>
                <Header>Tide Information</Header>
                <pre style={{ overflowX: 'auto' }}>
                    {JSON.stringify(data, null, 4)}
                </pre>
            </Segment>
        );
    }

    return (
        <Grid>
            <Grid.Column width={6}>
                <SearchBar fetchData={fetchData} />
                {renderTideInfo(tideData, today)}
            </Grid.Column>      
        </Grid>
    );
}

export default App;