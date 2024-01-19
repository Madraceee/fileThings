import { Button } from "@/components/ui/button"
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)

    useEffect(() => {
        if (isLoggedIn === true) {
            navigate("/workspace")
        }
    }, [])
    return (
        <div className="flex flex-col w-full h-screen justify-center items-center">
            <div className="w-1/2 flex flex-col gap-2">
                <span className="text-2xl md:text-8xl font-bold">fileThings</span>
                <span className="text-xl font-thin">The next best way to manage files</span>
                <div className="w-full flex flex-row gap-1 ">
                    <Button className="w-full" onClick={() => navigate("/login")}>Login</Button>
                    <Button className="w-full" onClick={() => navigate("/createUser")}>Create User</Button>
                </div>
            </div>
        </div>
    )
}

export default Home