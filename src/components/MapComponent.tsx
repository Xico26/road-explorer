"use client";

import {setWorkerUrl} from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map from 'react-map-gl/maplibre';
import {useEffect, useRef} from "react";
import bbox from "@turf/bbox";

export default function MapComponent({road}: {road: string | null}) {
    setWorkerUrl(workerUrl);
    const mapRef = useRef();

    useEffect(() => {
        if (!road || !mapRef.current) return

        async function loadRoad() {
            const res = await fetch(`/roads/${road}.geojson`)
            const geojson = await res.json()

            const map = mapRef.current.getMap()
            const bounds = bbox(geojson);

            if (map.getSource('road')) {
                map.getSource('road').setData(geojson)
            } else {
                map.addSource('road', { type: 'geojson', data: geojson })
                map.addLayer({
                    id: 'road-highlight',
                    type: 'line',
                    source: 'road',
                    paint: { 'line-color': '#4444FF', 'line-width': 4 }
                })
            }

            map.fitBounds(
                [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
                { padding: 80, duration: 1000 })
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
        />
    )
}