const MainGame = (props) => (
  <svg
   xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={34}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <linearGradient
      id="a"
      x1={12}
      x2={12}
      y1={1.25}
      y2={22.75}
      gradientUnits="userSpaceOnUse"
    >
      <stop offset={0} stopColor="#a3a3ff" />
      <stop offset={1} stopColor="#1f1fff" />
    </linearGradient>
    <g fill="url(#a)" fillRule="evenodd" clipRule="evenodd">
      <path d="M13.25 14a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 .75.75v8a.75.75 0 0 1-.75.75h-8a.75.75 0 0 1-.75-.75zm1.5.75v6.5h6.5v-6.5zM6.5 1.25a.75.75 0 0 1 .654.382l4.5 8A.75.75 0 0 1 11 10.75H2a.75.75 0 0 1-.654-1.118l4.5-8A.75.75 0 0 1 6.5 1.25zm-3.218 8h6.436L6.5 3.53zM13.25 6a4.75 4.75 0 1 1 9.5 0 4.75 4.75 0 0 1-9.5 0zM18 2.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5zM1.47 13.47a.75.75 0 0 1 1.06 0l8 8a.75.75 0 1 1-1.06 1.06l-8-8a.75.75 0 0 1 0-1.06z" />
      <path d="M10.53 13.47a.75.75 0 0 1 0 1.06l-8 8a.75.75 0 0 1-1.06-1.06l8-8a.75.75 0 0 1 1.06 0z" />
    </g>
  </svg>
)
export default MainGame
