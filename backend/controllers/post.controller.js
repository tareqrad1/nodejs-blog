import cloudinary from "../config/connectCloudinary.js";
import Post from "../models/post.model.js";

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
export const updatedViews = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if(!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        post.views += 1;
        await post.save();
        res.status(200).json({ message: "Views updated successfully" });
    }catch (error) {
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
        res.status(200).json({ message: "Comment added successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }
}
export const deleteMyComment = async (req, res) => {
    const { id } = req.params;
    const { commentId } = req.body;
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
        res.status(200).json({ message: "Comment added successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error });
    }
}