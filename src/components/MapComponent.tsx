"use client";

import {setWorkerUrl} from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import {useEffect, useRef, useState} from "react";
import bbox from "@turf/bbox";
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import type { MapRef } from "react-map-gl/maplibre";

export default function MapComponent({road}: {road: string | null}) {
    setWorkerUrl(workerUrl);
    const mapRef = useRef<MapRef>(null);
    const [roadData, setRoadData] = useState("");

    useEffect(() => {
        if (!road || !mapRef.current) return

        async function loadRoad() {
            try {
                const res = await fetch(`/roads/${road}.geojson`)
                const geojson = await res.json();
                setRoadData(geojson);

                if (mapRef.current) {
                    const bounds = bbox(geojson);

                    mapRef.current.fitBounds(
                        [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
                        { padding: 80, duration: 1000 }
                    )
                }
            } catch(e) {
                console.error(e);
            }
        }

        loadRoad()
    }, [road])

    return (
        <Map
            ref={mapRef}
            initialViewState={{
                longitude: -8.0,
                latitude: 39.5,
                zoom: 6,
                bounds: [[-9.5, 36.8], [-6.2, 42.2]]
            }}
            style={{width: "100%", height:"100vh"}}
            mapStyle="https://tiles.openfreemap.org/styles/bright"
        >
            {road && (
                <Source id="road-source" type="geojson" data={roadData}>
                    <Layer
                        id="road-highlight"
                        type="line"
                        paint={{
                            'line-color': '#4444FF',
                            'line-width': 4
                        }}
                    />
                </Source>
            )}
        </Map>
    )
}