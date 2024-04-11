
const SavedIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={25}
        height={25}
        fill="none"
        {...props}
    >
        <linearGradient
            id="a"
            x1={12.5}
            x2={12.5}
            y1={2}
            y2={20.397}
            gradientUnits="userSpaceOnUse"
        >
            <stop offset={0} stopColor="#a2a2ff" />
            <stop offset={1} stopColor="#2020ff" />
        </linearGradient>
        <path
            fill="url(#a)"
            d="M5.5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14.895c0 1.255-1.45 1.955-2.433 1.175l-3.635-2.885a1.5 1.5 0 0 0-1.865 0L7.932 20.07c-.983.78-2.432.08-2.432-1.176z"
        />
    </svg>
);

export default SavedIcon;
