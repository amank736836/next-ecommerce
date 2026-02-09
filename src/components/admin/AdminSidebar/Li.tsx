import Link from "next/link";
import { IconType } from "react-icons";

interface LiProps {
    url: string;
    text: string;
    location: any;
    Icon: IconType;
}

const Li = ({ url, text, location, Icon }: LiProps) => (
    <li
        style={{
            backgroundColor: location.pathname.includes(url)
                ? "rgba(0,115,255,0.1)"
                : "white",
        }}
    >
        <Link
            href={url}
            style={{
                color: location.pathname.includes(url) ? "rgb(0,115,255)" : "black",
            }}
        >
            <Icon />
            {text}
        </Link>
    </li>
);

export default Li;
