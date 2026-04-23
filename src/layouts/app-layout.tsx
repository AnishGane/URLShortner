import Footer from "@/components/footer"
import Header from "@/components/header"
import { Outlet } from "react-router-dom"

const AppLayout = () => {
    return (
        <>
            <main className="min-h-screen w-full">
                <Header />
                <div className="min-h-screen w-full bg-background relative">
                    {/*  Diagonal Cross Top Left Fade Grid Background */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
        linear-gradient(45deg, transparent 49%, var(--border) 49%, var(--border) 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, var(--border) 49%, var(--border) 51%, transparent 51%)`,
                            backgroundSize: "40px 40px",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
                            maskImage:
                                "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
                        }}
                    />
                    {/* Content Above*/}
                    <div className="max-w-7xl mx-auto relative z-10 pb-10">
                        <Outlet />
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}

export default AppLayout