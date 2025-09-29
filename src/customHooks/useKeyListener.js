import { useEffect } from "react";


export function useKeyListener(key, handler) {

    useEffect(() => {

        function handleKeyDown(ev) {
            let isKeyClicked = ev.key === key
            if (Array.isArray(key)) {
                isKeyClicked = key.some(k => k === ev.key)
            }
            if (isKeyClicked) {
                handler(ev)
            }

        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)

    }, [key])
}