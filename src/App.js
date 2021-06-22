import React, { useState } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import axios from 'axios';
import SearchBar from './components/SearchBar';

const App = () => {
    const [location, setLocation] = useState(null);
    const [tideData, setTideData] = useState(null);

    const fetchData = async (location) => {
        setLocation(location);
        const today = new Date();
        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(today.getDate() + 3);

        const beginDateString = today.getFullYear().toString() 
                                + ((today.getMonth() + 1).toString().length > 1 ? (today.getMonth() + 1).toString() : '0' + (today.getMonth() + 1).toString()) 
                                + (today.getDate().toString().length > 1 ? today.getDate().toString() : '0' + today.getDate().toString());

        const endDateString = threeDaysLater.getFullYear().toString() 
                              + ((threeDaysLater.getMonth() + 1).toString().length > 1 ? (threeDaysLater.getMonth() + 1).toString() : '0' + (threeDaysLater.getMonth() + 1).toString())
                              + (threeDaysLater.getDate().toString().length > 1 ? threeDaysLater.getDate().toString() : '0' + threeDaysLater.getDate().toString());

        const { data } = await axios.get('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter', {
            params: {
                product: 'predictions',
                begin_date: beginDateString,
                end_date: endDateString,
                datum: 'MLLW',
                station: location.id,
                time_zone: 'lst_ldt',
                units: 'english',
                interval: 'hilo',
                format: 'JSON'
            },
        });
        setTideData(data);
    }

    const renderTideInfo = (data) => {
        if (data === null) {
            return;
        }
        return (
            <Segment>
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
                {renderTideInfo(tideData)}
            </Grid.Column>      
        </Grid>
    );
}

export default App;