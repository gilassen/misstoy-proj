import { useEffect, useRef } from "react"


export function useIntersectionObserver(handler) {

    const ref = useRef()

    useEffect(() => {
        const observer = new IntersectionObserver(handler)
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return ref
}