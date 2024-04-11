const FavoritesIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={25}
        height={25}
        {...props}
    >
        <linearGradient
            id="a"
            x1={12}
            x2={12}
            y1={2.42}
            y2={21.58}
            gradientUnits="userSpaceOnUse"
        >
            <stop offset={0} stopColor="#ffe61c" />
            <stop offset={1} stopColor="#ffa929" />
        </linearGradient>
        <path
            fill="url(#a)"
            d="m12 18.954-4.687 2.464c-1.01.531-2.19-.326-1.998-1.451l.895-5.22-3.792-3.698c-.818-.796-.367-2.184.762-2.35l5.242-.76 2.343-4.75c.505-1.025 1.964-1.025 2.47 0l2.343 4.75 5.242.76c1.129.165 1.58 1.552.763 2.35l-3.793 3.698.895 5.22c.192 1.125-.988 1.983-1.998 1.451z"
        />
    </svg>
)
export default FavoritesIcon
