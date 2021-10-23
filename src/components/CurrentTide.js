import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';

const CurrentTide = ({ data }) => {

    const renderedList = data.map((tide) => {
        return (
            <Segment key={tide.t}>
                <Grid textAlign={'center'}>
                    <Grid.Column width={5}>
                        {tide.type === 'L' ? 'Low' : 'High'}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        {tide.t}
                    </Grid.Column>
                    <Grid.Column width={5}>
                        {tide.v + ' ft'}
                    </Grid.Column>
                </Grid>
            </Segment>
        );
    })

    return (
        <Segment.Group>
            <Segment>
                <Header>Today's Tides</Header>
            </Segment>
            {renderedList}
        </Segment.Group>
        
    );
}

export default CurrentTide;