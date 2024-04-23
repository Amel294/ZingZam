exports.checkIfFriend = async (userId, profileUserId)=> {
    try {
        const connection = await ConnectionsModel.findOne({ user: userId });
        if (connection && connection.friends.includes(profileUserId)) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking friendship:', error);
        return false;
    }
}