import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { LoginService } from "@/services/workspace.service";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";

export function Login() {
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)

    const submitCreds = async () => {
        const emailPattern = /^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const passwordPattern = /^[A-Z0-9!@#$]+$/i;

        if (!emailPattern.test(email)) {
            setError("Invalid Email Pattern");
            return;
        }
        if (!passwordPattern.test(password)) {
            setError("Only Alphabets,digits and !@#$ are allowed in password");
            return;
        }
        setError("");
        setIsLoading(true);

        try {
            const data = await LoginService(email, password);
            dispatch(login({ email: email, token: data.session.access_token, folderID: data.folderID }));
            setEmail("")
        } catch (error: any) {
            console.log(error);
            setError("Failed to login")
            if (error.message.match("Email not confirmed")) {
                setError("Email not confirmed. Visit your mail")
            }
            if (error.message.match("Invalid login credentials")) {
                setError("Invalid login credentials")
            }
        }

        setPassword("")
        setIsLoading(false);
        navigate("/workspace")
    }

    useEffect(() => {
        if (isLoggedIn === true) {
            navigate("/workspace")
        }
    }, []);

    return (
        <div className="w-1/2 flex flex-col gap-3">
            <span className="text-2xl font-bold text-left">Login</span>
            <div className="w-full flex flex-col justify-center gap-5 rounded-md border-2 p-5">
                <Input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button disabled={isLoading} onClick={submitCreds}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                </Button>
                {error !== "" && <span className="text-xs text-red-700">{error}</span>}
            </div>
            <div className="w-full flex flex-row justify-between">
                <Button variant={"link"} onClick={() => navigate("/createUser")}>Create Acc</Button>
                <Button variant={"link"} onClick={() => navigate("/")}>Home</Button>
            </div>
        </div>

    );
}
