import React from 'react'
import stations from '../utils/stations.json';
import {
    Button,
    Divider,
    Grid,
    Header,
    Icon,
    Segment,
} from 'semantic-ui-react'
import SearchBar from './SearchBar';

const Start = (props) => (
    <Segment placeholder>
        <Grid columns={2} stackable textAlign='center'>
            <Divider vertical>Or</Divider>

            <Grid.Row verticalAlign='middle'>
                <Grid.Column>
                    <Header icon>
                        <Icon name='search' />
                        Find Monitoring Station
                    </Header>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ width: "202.39px", }}>
                            <SearchBar fetchData={props.fetchData} />
                        </div>
                    </div>
                </Grid.Column>

                <Grid.Column>
                    <Header icon>
                        <Icon name='random' />
                        Select Random Station
                    </Header>
                    <Button
                        primary
                        onClick={() => props.fetchData(stations.stations[Math.floor(Math.random() * stations.stations.length)])}
                    >
                        Search
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Segment>
)

export default Start