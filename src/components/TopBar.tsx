import * as React from "react";
import {useEffect} from "react";
import {Button, CheckIcon, Group, Select, type SelectProps} from "@mantine/core";

export default function TopBar({selectRoad}: { selectRoad: (road: string) => void }) {
    const [roads, setRoads] = React.useState<string[]>([]);

    useEffect(() => {
        async function fetchRoads() {
            const res = await fetch("/roads/index.json");
            const roadNames = await res.json();

            setRoads(roadNames);
        }

        fetchRoads();
    }, [])

    function submitForm(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        selectRoad(e.currentTarget.road.value);
    }

    const iconProps = {
        color: 'currentColor',
        opacity: 0.6,
        size: 18,
    };

    const icons: Record<string, string> = {
        A: "images/autoestrada.svg",
        N: "images/en.png",
        EN: "images/en.png",
        IC: "images/ic.svg",
        IP: "images/ip.svg",
        EM: "images/em.png",
    };

    function getRoadIcon(ref: string) {
        const prefix = Object.keys(icons).find(k => ref.toUpperCase().startsWith(k))
        return prefix ? icons[prefix] : "https://cdn.iconscout.com/icon/free/png-256/free-highway-icon-svg-download-png-1976865.png"
    };

    const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
        <Group flex="1" gap="xs">
            <img src={getRoadIcon(option.label)} width={16} height={16} alt={"icon"}/>
            {option.label.toUpperCase()}
            {checked && <CheckIcon style={{ marginInlineStart: 'auto' }} {...iconProps} />}
        </Group>
    );

    return (
        <div className="absolute top-6 left-6 z-20 w-80 flex flex-col bg-none overflow-hidden">
            <form onSubmit={submitForm} className={"flex flex-row gap-2 w-full"}>
                <Select
                    placeholder={"Estrada"}
                    data={roads}
                    name={"road"}
                    searchable
                    renderOption={renderSelectOption}
                    classNames={{input: "uppercase"}}
                />
                <Button type={"submit"}>Ir para</Button>
            </form>
        </div>
    )
}