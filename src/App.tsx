import { useEffect, useRef, useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { geocoders } from "leaflet-control-geocoder";
import { FaSearch } from "react-icons/fa";

type Position = {
    lat: number;
    lng: number;
};

export default function App() {
    const [search, setSearch] = useState("");
    const [place, setPlace] = useState<Position | undefined>(undefined);
    const [showSearch, setShowSearch] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const position = { lat: 24.137396608878987, lng: 120.68692065044608 };

    const geoSearch = () =>
        new Promise<Position | undefined>((resolve, reject) => {
            const geocoder = geocoders.nominatim();
            geocoder.geocode(search, (result) => {
                const r = result[0];
                if (r) {
                    resolve(r.center);
                }
                reject(undefined);
            });
        });

    const handleSearch = () => {
        geoSearch()
            .then((data) => setPlace(data))
            .catch(() => alert("No place finded"));
    };

    useEffect(()=>{
        if (showSearch === "show") {
            searchInputRef.current?.focus()
        }
    },[showSearch])

    useEffect(()=>{
        function handleKeyDown(e: KeyboardEvent) {
            if (e.ctrlKey && e.key === "k") {
                e.preventDefault()
                setShowSearch("show")
            }
            if (e.key === "Escape") {
                setShowSearch("hidden")
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    },[])

    return (
        <main
            onClick={() => setShowSearch("hidden")}
            className="overflow-hidden w-screen h-screen bg-slate-950 flex flex-col"
        >
            <div className="w-full h-full">
                <MapContainer
                    center={position}
                    scrollWheelZoom
                    zoom={8}
                    className="z-0 h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FlyToPlace place={place} />
                </MapContainer>
            </div>
            <button
                onClick={(e) => {
                    setShowSearch("show");
                    e.stopPropagation();
                }}
                className="absolute px-3 py-2 left-[50vw] -translate-x-[50%] bottom-2 bg-white rounded-md transition-all hover:bg-slate-100"
            >
                <FaSearch />
            </button>
            <div
                className={
                    showSearch === "show"
                        ? "flex justify-center items-center gap-2 absolute w-screen h-full bg-opacity-50 bg-black"
                        : "hidden"
                }
            >
                <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    className="rounded-md p-2"
                    placeholder="search place..."
                    onChange={(e) => setSearch(e.target.value)}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                            setShowSearch("hidden");
                        }
                    }}
                />
                <button
                    onClick={handleSearch}
                    className="p-2 rounded-md bg-slate-700 px-3 text-white hover:bg-slate-600 transition-all"
                >
                    搜尋
                </button>
            </div>
        </main>
    );
}

function FlyToPlace({ place }: { place?: Position }) {
    const map = useMap();
    useEffect(() => {
        if (place) {
            map.flyTo(place, 15);
        }
    }, [place, map]);
    return null;
}

