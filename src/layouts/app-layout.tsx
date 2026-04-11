import Header from "@/components/header"
import { Outlet } from "react-router-dom"

const AppLayout = () => {
    return (
        <div>
            <main className="min-h-screen w-full">
                <Header />
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            <footer className="border-t border-t-border text-center">
                <p className="py-6">Made with Love 💖</p>
            </footer>
        </div>
    )
}

export default AppLayout