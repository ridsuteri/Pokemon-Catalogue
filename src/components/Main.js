import React, { useState, useEffect, Suspense, lazy } from "react";
import axios from "axios";
const Card = lazy(() => import('./Card'))
const Main = () => {
    const [pokeData, setPokeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/")
    const [nextUrl, setNextUrl] = useState();
    const [prevUrl, setPrevUrl] = useState();

    const pokeFun = async () => {
        setLoading(true)
        const res = await axios.get(url);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        getPokemon(res.data.results)
        setLoading(false)
    }
    const getPokemon = async (res) => {
        res.map(async (item) => {
            const result = await axios.get(item.url)
            setPokeData(state => {
                state = [...state, result.data]
                state.sort((a, b) => a.id > b.id ? 1 : -1)
                return state;
            })
        })
    }
    useEffect(() => {
        pokeFun();
    }, [url])
    return (
        <>
            <div className="container">
                <div className="cards">
                    <Suspense fallback={<h1>Loading Please Wait...</h1>}>
                        <Card pokemon={pokeData} />
                    </Suspense>
                </div>

                <div className="btn-group">
                    {prevUrl && <button onClick={() => {
                        setPokeData([])
                        setUrl(prevUrl)
                    }}>Previous</button>}

                    {nextUrl && <button onClick={() => {
                        setPokeData([])
                        setUrl(nextUrl)
                    }}>Next</button>}

                </div>
            </div>
        </>
    )
}
export default Main;