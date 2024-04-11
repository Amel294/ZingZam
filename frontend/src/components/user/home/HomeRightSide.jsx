import RequestReceived from "./homeRight/RequestReceived"
import SuggestedFriends from "./homeRight/SuggestedFriends"
import RequestSend from "./homeRight/requestSend/RequestSend"

function HomeRightSide() {

  return (
    <div className="hidden lg:block">
      <div className="flex justify-center py-2">
        <div className='flex flex-col items-center w-full gap-4 pt-4 justify-center'>
          <div className="max-[90vh]  rounded-lg min-w-[200px] fixed top-20 flex flex-col gap-4">
            <SuggestedFriends />
            <RequestReceived />
            <RequestSend/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeRightSide
