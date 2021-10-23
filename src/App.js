import React, { useState } from 'react';
import {
    Grid,
    Segment,
    Container,
    Header,
    Loader,
    Dimmer
} from 'semantic-ui-react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import CurrentTide from './components/CurrentTide';
import Map from './components/Map';
import Chart from './components/Chart';
import Start from './components/Start';

const App = () => {
    const [state, setState] = useState({
        loading: false,
        location: null,
        tideData: [],
        today: []
    });

    const fetchData = async (location) => {
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

        const d7 = new Date(d);
        d7.setDate(d.getDate() + 7);

        const beginDateString = getDateArray(d).join('');
        const endDateString = getDateArray(d7).join('');

        setState({ loading: true })

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

        setState({ tideData: predictions, today: currentTide, location: location, loading: false });
    }

    const renderComponents = (state) => {
        if (state.loading) {
            return (
                <Dimmer active inverted>
                    <Loader />
                </Dimmer>
            );

        } else if (state.tideData.length === 0) {
            return (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <div style={{ width: "800px" }} >
                        <Start fetchData={fetchData} />
                    </div>
                </div>
            );

        }
        
        return (
            <Container>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <SearchBar fetchData={fetchData} />
                        </Grid.Column>
                    </Grid.Row>
                    <Header as='h1'>{state.location.name + (state.location.state.length === 0 ? '' : (', ' + state.location.state))}</Header>
                    <Grid.Row>
                        <Grid.Column width={11}>
                            <Map location={state.location} />
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <CurrentTide data={state.today} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Segment>
                                <Chart data={state.tideData} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }

    return (
        <div>
            {renderComponents(state)}
        </div>
    );
}

export default App;