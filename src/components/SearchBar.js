import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';
import stations from '../utils/stations.json';
import states from '../utils/states.json';

const locations = stations.stations;

const initialState = {
    loading: false,
    results: [],
    value: '',
    location: null
}

function reducer(state, action) {
    switch (action.type) {
        case 'CLEAN_QUERY':
            return initialState;
        case 'START_SEARCH':
            return { ...state, location: null, loading: true, value: action.query };
        case 'FINISH_SEARCH':
            return { ...state, loading: false, results: action.results };
        case 'UPDATE_SELECTION':
            return { ...state, location: action.data, results: [], value: '' };
        default:
            throw new Error();
    }
}

const SearchBar = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { loading, results, value, location } = state;

    const propsRef = useRef(props);
    const timeoutRef = useRef();

    const handleSearchChange = useCallback((e, data) => {
        clearTimeout(timeoutRef.current);
        dispatch({ type: 'START_SEARCH', query: data.value });

        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                dispatch({ type: 'CLEAN_QUERY' });
                return;
            }

            const re = new RegExp(_.escapeRegExp(data.value), 'i');
            const isMatch = (result) => re.test(result.name);

            const filtered = _.filter(locations, isMatch);
            const endIndex = Math.min(filtered.length, 5);

            function renameKey(obj, oldKey, newKey) {
                obj[newKey] = obj[oldKey];
                delete obj[oldKey];
            }

            var sliced = filtered.slice(0, endIndex);
            sliced.forEach((obj) => {
                obj.title = obj.name;
                obj.description = states[obj.state];
                renameKey(obj, 'tideType', 'tidetype');
            });

            dispatch({
                type: 'FINISH_SEARCH',
                results: sliced
            });

        }, 300)
    }, []);

    const onTermSubmit = (event) => {
        event.preventDefault();
        if (results.length === 0) {
            return;
        }
        dispatch({ type: 'UPDATE_SELECTION', selection: results[0].title, data: results[0] });
    }

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    useEffect(() => {
        if (location === null) {
            return;
        }
        propsRef.current.fetchData(location)
    }, [location, propsRef]);


    return (
        <form onSubmit={onTermSubmit}>
            <Search
                loading={loading}
                onResultSelect={(e, data) =>
                    dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title, data: data.result })
                }
                onSearchChange={handleSearchChange}
                results={results}
                value={value}
                placeholder={"Search Locations..."}
                onSubmit={onTermSubmit}
                showNoResults={value.length > 0 && results.length === 0 && location === null}
            />
        </form>
    );
}

export default SearchBar;