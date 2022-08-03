// https://stackoverflow.com/questions/23123138/how-to-perform-debounce

import { useState } from "react";
import {
    useAsync,
    useAsyncAbortable,
    useAsyncCallback,
    UseAsyncReturn,
} from 'react-async-hook';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { SearchResult } from "../components/SearchSuggestions";

export const useDebouncedSearch = (searchFunction: (input: string) => Promise<SearchResult[]>) => {

    // Handle the input text state
    const [inputText, setInputText] = useState('');

    // Debounce the original search async function
    const debouncedSearchFunction = useConstant(() =>
        AwesomeDebouncePromise(searchFunction, 300)
    );

    // The async callback is run each time the text changes,
    // but as the search function is debounced, it does not
    // fire a new request on each keystroke
    const searchResults = useAsync(
        async () => {
            if (inputText.length === 0) {
                return [];
            } else {
                return debouncedSearchFunction(inputText);
            }
        },
        [debouncedSearchFunction, inputText]
    );

    // Return everything needed for the hook consumer
    return {
        inputText,
        setInputText,
        searchResults,
    };
};
