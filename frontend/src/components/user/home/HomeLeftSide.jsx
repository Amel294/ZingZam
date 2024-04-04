import LeftNav from "../sideNavs/LeftNav"

function HomeLeftSide() {
  return (
    <div className="hidden lg:block">
      <div className="flex justify-center py-2 ">
        <LeftNav />
      </div>
    </div>
  )
}

export default HomeLeftSide
