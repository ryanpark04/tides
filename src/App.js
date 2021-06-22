import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';

const App = () => {
    const [location, setLocation] = useState(null);

    const fetchData = (location) => {
        setLocation(location);
    }

    const renderTideInfo = (location) => {
        if (location === null) {
            return;
        }
        return location.id;
    }

    return (
        <div>
            <SearchBar fetchData={fetchData} />
            {renderTideInfo(location)}
        </div>
    );
}

export default App;