import { Routes, Route } from "react-router-dom"
import { ToyIndex } from "./pages/ToyIndex.jsx"
import { ToyDetails } from "./pages/ToyDetails.jsx"
import { ToyEdit } from "./pages/ToyEdit.jsx"
import { AppHeader } from "./cmps/AppHeader"
import { AppLoader } from "./cmps/AppLoader.jsx"


export function RootCmp() {
    return (
        <div className="app-layout">
            <AppHeader />
            <AppLoader />

            <main className="app-container">
                <Routes>
                    <Route path="/" element={<ToyIndex />} />
                    <Route path="/toy" element={<ToyIndex />} />
                    <Route path="/toy/:toyId" element={<ToyDetails />} />
                    <Route path="/toy/edit" element={<ToyEdit />} />
                    <Route path="/toy/edit/:toyId" element={<ToyEdit />} />
                </Routes>
            </main>
        </div>
    )
}
