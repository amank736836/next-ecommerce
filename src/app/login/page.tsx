"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loaders/Loader";
import { auth } from "@/firebase";
import { useLoginMutation } from "@/redux/api/userAPI";
import { responseToast } from "@/utils/features";

const Login = () => {
    const router = useRouter();

    const [gender, setGender] = useState("");
    const [date, setDate] = useState("");

    const [login] = useLoginMutation();

    const [loading, setLoading] = useState<boolean>(false);

    const loginHandler = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);

            const res = await login({
                name: user.displayName!,
                email: user.email!,
                photo: user.photoURL!,
                gender,
                role: "user",
                dob: date,
                _id: user.uid,
            });

            if ("error" in res) {
                const error = res.error as any;
                const message = error.data?.message;
                if (message === "Please enter all fields") {
                    toast.error("New Account? Please select Gender and Date of Birth.");
                    return;
                } else {
                    toast.error(message || "Sign in failed");
                    return;
                }
            }

            toast.success(res.data?.message || "Welcome back");
            router.push("/");

        } catch (error) {
            console.error(error);
            toast.error("Sign in failed");
        }
    };

    return loading ? (
        <Loader />
    ) : (
        <div className="login" suppressHydrationWarning>
            <main>
                <h1 className="heading">Login</h1>
                <div>
                    <label>Gender</label>
                    <select
                        suppressHydrationWarning
                        title="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="dob">Date of birth</label>
                    <input
                        type="date"
                        id="dob"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div>
                    <p>Already Signed In Once</p>
                    <button suppressHydrationWarning onClick={loginHandler}>
                        <FcGoogle />
                        <span>Sign in with Google</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;
