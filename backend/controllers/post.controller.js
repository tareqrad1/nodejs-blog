import cloudinary from "../config/connectCloudinary.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
    const { title, paragraph, tags } = req.body;
    let { image } = req.body;
    try {
        if(!title || !paragraph || !image) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            image = uploadResponse.secure_url;
        };
        const post = new Post({
            userId: req.user._id,
            title,
            paragraph,
            image,
            tags: tags ? tags.split(",") : [],
        });
        await post.save();
        const notification = new Notification({
            to: req.user._id,
            message: `You have created a new post`,
        });
        await notification.save();
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }
}
export const getAllPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    try {
        const posts = await Post.find({}).populate({
            path: 'userId',
            select: 'name email profilePhoto'
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
        const totalPosts = Math.ceil(await Post.countDocuments() / limit);
        if (posts.length === 0) {
            return res.status(404).json({ error: "No posts found" });
        }
        res.status(200).json({ 
            currentPage: page,
            totalPosts,
            posts
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }
}
export const getOnePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id).populate({
            path: 'userId',
            select: 'name email profilePhoto'
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const views = post.views + 1;
        await Post.findByIdAndUpdate(id, { views}, { new: true });
        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }

}
export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if(post.image) {
            const publicId = post.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
        if(post.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }
        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }
}
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, paragraph, tags } = req.body;
    let { image } = req.body;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if(post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }
        if(image) {
            if(post.image) {
                const publicId = post.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadResponse = await cloudinary.uploader.upload(image);
            image = uploadResponse.secure_url;
        }
        post.title = title || post.title;
        post.paragraph = paragraph || post.paragraph;
        post.image = image || post.image;
        post.tags = tags ? tags.split(",") : post.tags;
        await post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }
}
export const commentOnPost = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    try {
        const post = await Post.findById(id);
        if(!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if(!comment) {
            return res.status(400).json({ error: "Comment is required" });
        }
        post.comments.push({
            userId: req.user._id,
            comment,
            createdAt: Date.now(),
        });
        await post.save();
        const notification = new Notification({
            to: post.userId,
            from: req.user._id,
            message: `${req.user.name} commented on your post`,
        });
        await notification.save();
        res.status(200).json({ message: "Comment added successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }
}
export const deleteMyComment = async (req, res) => {
    const { id } = req.params; //id of the post
    const { commentId } = req.body; //id of the comment to be deleted
    try {
        const post = await Post.findById(id);
        if(!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId.toString());
        if(commentIndex === -1) {
            return res.status(404).json({ error: "Comment not found" });
        }
        if(post.comments[commentIndex].userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }
        post.comments.splice(commentIndex, 1);
        await post.save();
        res.status(200).json({ message: "Comment deleted successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }
}
export const repliesOnComment = async (req, res) => {
    const { id } = req.params;
    const { commentId, comment } = req.body;
    try {
        const post = await Post.findById(id);
        if(!post) {
            return res.status(404).json({ error: "Post not found" });
        }    
        if(!comment) {
            return res.status(400).json({ error: "Comment is required" });
        }
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId.toString());
        if(commentIndex === -1) {
            return res.status(404).json({ error: "Comment not found" });
        }
        post.comments[commentIndex].replies.push({
            userId: req.user._id,
            comment,
            createdAt: Date.now(),
        });
        await post.save();
        const notification = new Notification({
            to: post.comments[commentIndex].userId,
            from: req.user._id,
            message: `${req.user.name} replied to your comment`,
        });
        await notification.save();
        res.status(200).json({ message: "Comment added successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }
};
export const deleteMyReplayComment = async (req, res) => {
    const { id } = req.params; //id of the post
    const { commentId, replayId } = req.body; //id of the comment to be deleted
    try {
        const post = await Post.findById(id);
        if(!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId.toString());
        if(commentIndex === -1) {
            return res.status(404).json({ error: "Comment not found" });
        }
        const replayIndex = post.comments[commentIndex].replies.findIndex(replay => replay._id.toString() === replayId.toString());
        if(replayIndex === -1) {
            return res.status(404).json({ error: "Replay not found" });
        }
        if(post.comments[commentIndex].replies[replayIndex].userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }
        post.comments[commentIndex].replies.splice(replayIndex, 1);
        await post.save();
        res.status(200).json({ message: "Replay deleted successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }
}
export const likeUnlikePosts = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if(!post) {
            return res.status(404).json({ error: "Post not found" });
        };
        const userLiked = post.likes.includes(req.user._id);
        if(userLiked) {
            await Post.findByIdAndUpdate(id, {
                $pull: {
                    likes: req.user._id,
                }
            });
            await User.findByIdAndUpdate(req.user._id, {
                $pull: {
                    likedPost: id
                }
            });
            const updatedPost = await Post.findById(id);
            res.status(200).json({ message: "Post unliked successfully", post: updatedPost });
        }else {
            post.likes.push(req.user._id);
            await User.findByIdAndUpdate(id), {
                $push: {
                    likedPost: id
                }
            }
            await post.save();
            const notification = new Notification({
                to: post.userId,
                from: req.user._id,
                message: `${req.user.name} liked your post`,
            });
            await notification.save();
            const updatedPost = await Post.findById(id);
            res.status(200).json({ message: "Post liked successfully", post: updatedPost });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }
}