const FriendsIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={25}
        height={25}
        {...props}
    >
        <linearGradient id="a">
            <stop offset={0} stopColor="#bbdefb" />
            <stop offset={1} stopColor="#64b5f6" />
        </linearGradient>
        <linearGradient
            xlinkHref="#a"
            id="c"
            x1={14}
            x2={21}
            y1={10.5}
            y2={10.5}
            gradientUnits="userSpaceOnUse"
        />
        <linearGradient id="b">
            <stop offset={0} stopColor="#42a5f5" />
            <stop offset={1} stopColor="#1e88e5" />
        </linearGradient>
        <linearGradient
            xlinkHref="#b"
            id="d"
            x1={13}
            x2={22}
            y1={18.5}
            y2={18.5}
            gradientUnits="userSpaceOnUse"
        />
        <linearGradient
            xlinkHref="#a"
            id="e"
            x1={4}
            x2={14}
            y1={7}
            y2={7}
            gradientUnits="userSpaceOnUse"
        />
        <linearGradient
            xlinkHref="#b"
            id="f"
            x1={3}
            x2={15}
            y1={17.532}
            y2={17.532}
            gradientUnits="userSpaceOnUse"
        />
        <path
            fill="url(#c)"
            d="M17.5 7C15.57 7 14 8.57 14 10.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5S19.43 7 17.5 7z"
        />
        <path
            fill="url(#d)"
            d="M19 15h-3c-1.654 0-3 1.346-3 3v3a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3c0-1.654-1.346-3-3-3z"
        />
        <path
            fill="url(#e)"
            d="M9 2C6.243 2 4 4.243 4 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"
        />
        <path
            fill="url(#f)"
            d="M12 13.063H6c-1.654 0-3 1.346-3 3V21a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4.937c0-1.654-1.346-3-3-3z"
        />
    </svg>
)
export default FriendsIcon
