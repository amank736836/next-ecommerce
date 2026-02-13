import { useState } from "react";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { FaHome, FaSearch, FaSignInAlt, FaSignOutAlt, FaInfoCircle, FaBoxOpen, FaFileAlt, FaBars, FaTimes } from "react-icons/fa";
import { RiDatabaseFill, RiShoppingCart2Fill } from "react-icons/ri";
import { useSelector } from "react-redux";
import Link from "next/link";
import { auth } from "../firebase";
import { RootState } from "../redux/store";
import { useRouter } from "next/navigation";

const Header = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            await signOut(auth);
            toast.success("Signed Out Successfully");
            setIsOpen(false);
            router.push("/login");
        } catch (error) {
            toast.error("Sign Out Failed");
        }
    };

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="header">
            <Link href="/" className="logo">
                <img src="/icon.svg" alt="Log" />
                VirtuoStore
            </Link>
            {/* Desktop Navigation */}
            <div className="desktop-nav">
                <Link href="/" title="Home"><FaHome /> <span>Home</span></Link>
                <Link href="/search" title="Search"><FaSearch /> <span>Search</span></Link>
                <Link href="/about" title="About"><FaInfoCircle /> <span>About</span></Link>
                <Link href="/cart" title="Cart"><RiShoppingCart2Fill /> <span>Cart</span></Link>
                <Link href="/orders" title="Orders"><FaBoxOpen /> <span>Orders</span></Link>
                <Link href="/policies" title="Policies"><FaFileAlt /> <span>Policies</span></Link>
                {user?.role === "admin" && (
                    <Link href="/admin/dashboard" title="Admin Dashboard"><RiDatabaseFill /> <span>Admin</span></Link>
                )}
                {user ? (
                    <button onClick={logoutHandler} title="Sign Out"><FaSignOutAlt /> <span>Sign Out</span></button>
                ) : (
                    <Link href="/login" title="Login"><FaSignInAlt /> <span>Login</span></Link>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Mobile Navigation Drawer */}
            <div className={`mobile-nav ${isOpen ? "open" : ""}`}>
                <Link href="/" onClick={closeMenu}><FaHome /> Home</Link>
                <Link href="/search" onClick={closeMenu}><FaSearch /> Search</Link>
                <Link href="/about" onClick={closeMenu}><FaInfoCircle /> About</Link>
                <Link href="/cart" onClick={closeMenu}><RiShoppingCart2Fill /> Cart</Link>
                <Link href="/orders" onClick={closeMenu}><FaBoxOpen /> Orders</Link>
                <Link href="/policies" onClick={closeMenu}><FaFileAlt /> Policies</Link>
                {user?.role === "admin" && (
                    <Link href="/admin/dashboard" onClick={closeMenu}><RiDatabaseFill /> Admin Dashboard</Link>
                )}
                {user ? (
                    <button onClick={logoutHandler}><FaSignOutAlt /> Sign Out</button>
                ) : (
                    <Link href="/login" onClick={closeMenu}><FaSignInAlt /> Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Header;
