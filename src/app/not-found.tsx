import Link from 'next/link';
import { BiError } from 'react-icons/bi';

export default function NotFound() {
    return (
        <div className="container not-found">
            <BiError size="5rem" />
            <h1>Page Not Found</h1>
            <Link href="/">Go to Home</Link>
        </div>
    );
}
