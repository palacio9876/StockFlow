import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router";
function HomePage() {
    return <h1>StockFlow</h1>;
}

function NotFoundPage() {
    return <h1>404 - Page Not Found</h1>;
}

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}