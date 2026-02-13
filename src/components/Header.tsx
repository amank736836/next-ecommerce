import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { FaHome, FaSearch, FaSignInAlt, FaSignOutAlt, FaInfoCircle, FaBoxOpen, FaFileAlt } from "react-icons/fa";
import { RiDatabaseFill, RiShoppingCart2Fill } from "react-icons/ri";
import { useSelector } from "react-redux";
import Link from "next/link";
import { auth } from "../firebase";
import { RootState } from "../redux/store";
import { useRouter } from "next/navigation";

const Header = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
    const router = useRouter();

    const logoutHandler = async () => {
        try {
            await signOut(auth);
            toast.success("Signed Out Successfully");
            router.push("/login");
        } catch (error) {
            toast.error("Sign Out Failed");
        }
    };

    return (
        <nav className="header">
            <Link href="/" title="Home">
                <FaHome />
            </Link>
            <Link href="/search" title="Search">
                <FaSearch />
            </Link>
            <Link href="/about" title="About">
                <FaInfoCircle />
            </Link>
            <Link href="/cart" title="Cart">
                <RiShoppingCart2Fill />
            </Link>
            <Link href="/orders" title="Orders">
                <FaBoxOpen />
            </Link>
            <Link href="/policies" title="Policies">
                <FaFileAlt />
            </Link>
            {user?.role === "admin" && (
                <Link href="/admin/dashboard" title="Admin Dashboard">
                    <RiDatabaseFill />
                </Link>
            )}
            {user ? (
                <button onClick={logoutHandler}>
                    <FaSignOutAlt />
                </button>
            ) : (
                <Link href="/login" title="Login">
                    <FaSignInAlt />
                </Link>
            )}
        </nav>
    );
};

export default Header;
