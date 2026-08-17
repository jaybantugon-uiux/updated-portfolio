function Logo({ size = 28 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Jay Louis Bantugon logo"
        >
            <rect width="120" height="120" rx="26" fill="#0d0d0c" />
            <rect x="1" y="1" width="118" height="118" rx="25" fill="none" stroke="#2b2b27" strokeWidth="1" />
            <g transform="translate(10,7)">
                <path d="M46,12 L46,86" fill="none" stroke="#cfd48a" strokeWidth="6" strokeLinecap="round" />
                <path d="M46,12 C68,12 79,20 79,30 C79,40 68,48 46,48" fill="none" stroke="#cfd48a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M46,48 C73,48 85,58 85,68 C85,80 70,87 46,87" fill="none" stroke="#cfd48a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M46,72 C46,84 38,91 25,91 C17,91 12,88 10,82" fill="none" stroke="#cfd48a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    );
}

export default Logo;
