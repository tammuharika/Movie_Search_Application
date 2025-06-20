import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import MovieDetails from './MovieDetails';
import Result from './Result';
import Search from './Search';

function HomePage() {
    const [state, setState] = useState({
        search: "",
        results: [],
        selected: {}
    });

    // ✅ Fetch movies from MongoDB backend instead of OMDb API
    useEffect(() => {
        axios.get("http://localhost:5000/movies")
            .then((res) => {
                setState(prevState => ({
                    ...prevState,
                    results: res.data
                }));
            })
            .catch(err => console.log("Error fetching movies:", err));
    }, []);

    // ✅ Handle input change in the search box
    const handleInput = (event) => {
        let search = event.target.value;
        setState((prevState) => ({
            ...prevState,
            search: search
        }));
    };

    // ✅ Search movies (keeps previous OMDb API integration)
    const SearchResult = (event) => {
        if (event.key === 'Enter') {
            axios.get(`https://www.omdbapi.com/?apikey=b5382e81&s=${state.search}`)
                .then(res => {
                    setState(prevState => ({
                        ...prevState,
                        results: res.data.Search || []
                    }));
                })
                .catch(err => console.log("Error searching movies:", err));
        }
    };

    // ✅ Fetch movie details (from OMDb API, keeps previous behavior)
    const openDetails = (id) => {
        axios.get(`https://www.omdbapi.com/?i=${id}&apikey=b5382e81`)
            .then(({ data }) => {
                setState(prevState => ({
                    ...prevState,
                    selected: data
                }));
            })
            .catch(err => console.log("Error fetching details:", err));
    };

    // ✅ Close movie details popup
    const close = () => {
        setState(prevState => ({
            ...prevState,
            selected: {}
        }));
    };

    // ✅ Add a new movie to MongoDB
    const addMovie = () => {
        const newMovie = {
            title: state.search,
            year: 2024,  // Default value, modify as needed
            genre: "Unknown",  // Modify if needed
            poster: "https://via.placeholder.com/150"  // Default poster
        };

        axios.post("http://localhost:5000/movies", newMovie)
            .then(res => {
                alert(res.data.message);
                setState(prevState => ({
                    ...prevState,
                    results: [...prevState.results, res.data.movie]
                }));
            })
            .catch(err => console.log("Error adding movie:", err));
    };

    return (
        <div className="w-100 main-wrapper d-flex flex-column align-items-center min-vh-100">
            {typeof state.selected.Title !== "undefined" ? (
                <MovieDetails selected={state.selected} close={close} />
            ) : (
                <header className="w-100 text-center text-white mt-5">
                    <h2>Movie Search</h2>
                    <Search handleInput={handleInput} SearchResult={SearchResult} />
                    <button className="btn btn-success my-3" onClick={addMovie}>
                        ➕ Add to Database
                    </button>
                    <div className="container">
                        <div className="row">
                            {state.results && state.results.map((result, i) => (
                                <div className="col-12 col-sm-6 col-md-3 col-lg-3 my-2" key={i}>
                                    <Result result={result} openDetails={openDetails} />
                                </div>
                            ))}
                        </div>
                    </div>
                </header>
            )}
        </div>
    );
}

export default HomePage;
