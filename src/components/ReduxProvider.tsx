"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Toaster } from "react-hot-toast";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../firebase";
import { getUser } from "../redux/api/userAPI";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import Header from "./Header";

export default function ReduxProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <AuthWrapper>
                <Header />
                {children}
                <Toaster position="bottom-center" />
            </AuthWrapper>
        </Provider>
    );
}

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const data = await getUser(user.uid);
                    dispatch(userExist(data.user));
                } catch (error) {
                    dispatch(userNotExist());
                }
            } else {
                dispatch(userNotExist());
            }
        });
    }, [dispatch]);

    return <>{children}</>;
};
