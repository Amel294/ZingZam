const MenuDots = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 24 24"
        {...props}
    >
        <circle cx={12} cy={2} r={2} />
        <circle cx={12} cy={12} r={2} />
        <circle cx={12} cy={22} r={2} />
    </svg>
)
export default MenuDots
