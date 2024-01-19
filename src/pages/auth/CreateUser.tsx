import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { CreateAcc } from "@/services/workspace.service";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


export function CreateUser() {
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmpassword, setConfirmPassword] = useState<string>("");

    const { toast } = useToast();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)

    const submitCreds = async () => {
        const emailPattern = /^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const passwordPattern = /^[A-Z0-9!@#$]+$/i;

        if (!emailPattern.test(email)) {
            setError("Invalid Email Pattern");
            return;
        }
        if (!passwordPattern.test(password) || !passwordPattern.test(confirmpassword)) {
            setError("Only Alphabets,digits and !@#$ are allowed in password");
            return;
        }

        if (password !== confirmpassword) {
            setError("Password mismatch");
            return;
        }

        if (password.length < 6) {
            setError("Password should be greater than 6 charecters");
            return;
        }

        setError("")
        setIsLoading(true)

        try {
            const data = await CreateAcc(email, password);
            console.log(data)
            toast({
                description: "Check email for verification"
            })
            setEmail("")
            setError("Check email for verification")
        } catch (error) {
            console.log(error);
            setError("Failed to create Account");
        }

        setPassword("")
        setConfirmPassword("")
        setIsLoading(false)
    }

    useEffect(() => {
        if (isLoggedIn === true) {
            navigate("/workspace")
        }
    }, []);

    return (
        <div className="w-1/2 flex flex-col gap-3">
            <span className="text-2xl font-bold text-left">Create User</span>
            <div className="w-full flex flex-col justify-center gap-5 rounded-md border-2 p-5">
                <Input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input type="password" placeholder="Confirm Password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <Button disabled={isLoading} onClick={submitCreds}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                </Button>
                {error !== "" && <span className="text-xs text-red-700">{error}</span>}
            </div>
            <div className="w-full flex flex-row justify-between">
                <Button variant={"link"} className="justify-start" onClick={() => navigate("/login")}>Login</Button>
                <Button variant={"link"} onClick={() => navigate("/")}>Home</Button>
            </div>
        </div>

    );
}
