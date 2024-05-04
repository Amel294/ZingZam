const PostModel = require('../models/PostModel');
const ReportModel = require('../models/ReportModel');

exports.reportPost = async (req, res) => {
    try {
        const { postId, reason, description } = req.body;

        if (!postId || !reason || !description) {
            return res.status(400).json({ error: 'Post ID ,reason and description are required' });
        }

        const reportedBy = req?.userData?.id;
        const reportedPost = await PostModel.findOne({ _id: postId }, { userId: 1, _id: 0 });

        if (!reportedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const report = new ReportModel({
            postId,
            reason,
            description,
            reportedBy,
            reportedUser: reportedPost.userId,
        });

        await report.save();

        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getReports = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const totalDocuments = await ReportModel.countDocuments({ status: { $in: ['open', 'in_review'] } });
        const totalPage = Math.ceil(totalDocuments / limit);
        const reports = await ReportModel.find({ status: { $in: ['open', 'in_review'] } })
            .populate({ path: 'reportedBy', select: '_id username name', strictPopulate: false })
            .populate({ path: 'reportedUser', select: '_id username name', strictPopulate: false })
            .skip(startIndex)
            .limit(limit);
        const pagination = {};
        if (endIndex < totalDocuments) {
            pagination.next = {
                page: page + 1,
                limit: limit
            };
        }
        if (startIndex > 0) {
            pagination.previous = {
                page: page - 1,
                limit: limit
            };
        }
        res.status(200).json({
            reports: reports,
            pagination: pagination,
            totalPage: totalPage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.changeStatus = async (req, res) => {
    try {
        const { reportId, reportStatus } = req.body;
        if (!reportId || !reportStatus) {
            return res.status(400).json({ error: 'Report ID and status are required' });
        }
        const report = await ReportModel.findOne({ _id: reportId });
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        report.status = reportStatus;
        await report.save();
        res.status(200).json({ message: 'Status changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.reportDetails = async (req, res) => {
    try {
        const { reportId } = req.params; 
        const reportDetails = await ReportModel.findOne({ _id: reportId }).populate('reportedBy reportedUser'); 
        console.log(reportDetails);
        if (!reportDetails) {
            return res.status(404).json({ error: 'Report not found' });
        }
        const postId = reportDetails.postId;
        const post = await PostModel.aggregate([
            {
                $match: {
                    _id: postId
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'postedBy'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'comments' 
                }
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likes: '$likes'
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    imageUrl: 1,
                    caption: 1,
                    postedBy: 1,
                    likes: 1,
                    postedBy: 1,
                    comments:1
                }
            }
        ]);

        res.status(200).json({ reportDetails, post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
