import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route, Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const root = ReactDOM.createRoot(document.getElementById("app"));

function FrontPage() {
    return <div>
        <h1> Lecture 2 - Livecoded Movies</h1>
        <ul>
            <li><Link to="/movies"> List Movies </Link></li>
            <li><Link to="/movies/new"> New Movie </Link></li>
        </ul>
    </div>
}

function ListMovies({movieApi}) {

    const [movies, setMovies] = useState();

    useEffect( async () => {
        console.log("use effect is called! yey!");
        setMovies(undefined);
        setMovies(await movieApi.listMovies());
        }, []);

    if (!movies) {
        return <div> Loading... </div>
    }

    return (
        <div>
            <h1> Listing all Movies </h1>
            {
                movies.map( m =>
                    <>
                        <h2> {m.title} - {m.year} </h2>
                        <div key={m.title}>
                            {m.synopsis}
                        </div>
                    </>
                )
            }
        </div>
    )
}

function AddMovie({movieApi}) {
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [synopsis, setSynopsis] = useState("");

    const navigate = useNavigate();


    async function handleSubmit(e) {
        e.preventDefault();
        await movieApi.onAddMovie({title, year, synopsis});
        navigate("/");
    }


    return (
        <form onSubmit={handleSubmit}>
            <h1> New Movie Details </h1>
            <div>
                <label> Title: <input value={title} onChange={e => setTitle(e.target.value)}/></label>
            </div>
            <div>
                <label> Year: <input value={year} onChange={e => setYear(e.target.value)}/></label>
            </div>
            <div>
                <label> Synopsis: <input value={synopsis} onChange={e => setSynopsis(e.target.value)}/></label>
            </div>
            <button>Submit</button>
        </form>
    );
}

function Application() {

    const movieApi = {
        onAddMovie: async (m) => {
            await fetch("/api/movies", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(m)
            })
        },
        listMovies: async () => {
            const res = await fetch("/api/movies");
            return res.json();
        }
    }

    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<FrontPage/>}></Route>
            <Route path="/movies" element={<ListMovies movieApi={movieApi}/>}></Route>
            <Route path="/movies/new" element={<AddMovie movieApi={movieApi}/>}></Route>
        </Routes>
    </BrowserRouter>
}

root.render(
    <Application/>

);
