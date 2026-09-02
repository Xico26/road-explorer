import TopBar from "./TopBar.tsx";
import MapComponent from "./MapComponent.tsx";
import {useState} from "react";

export default function MainPage() {
    const [selectedRoad, setSelectedRoad] = useState<string | null>(null);

    async function selectRoad(road: string) {
        setSelectedRoad(road);
    }

    return (
        <div className="absolute w-full h-screen">
            <TopBar selectRoad={selectRoad} />
            <MapComponent road={selectedRoad} />
        </div>
    )
}