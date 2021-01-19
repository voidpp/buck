import * as React from "react";
import {useEffect, useRef} from "react";
import {buckLocalStorage} from "../../../tools";


export default ({src}: { src: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current)
            audioRef.current.volume = buckLocalStorage.volume / 100;
    }, [src])

    return <audio src={src} autoPlay loop ref={audioRef}/>;
}
