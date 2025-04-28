import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from '../config/connectCloudinary.js';
import Post from '../models/post.model.js';

export const updateMyProfile = async (req, res) => {
    const { name, email, currentPassword, newPassword, bio, links } = req.body;
    let { profilePhoto, backgroundPhoto } = req.body;
    
    try {
        let user = await User.findById(req.user._id).lean();
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        };
        if((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: 'Both current and new passwords are required' });
        }
        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }
            const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
            if (!regex.test(newPassword)) {
                return res.status(400).json({ error: 'New password must be 6-15 characters long, contain at least one letter and one number.' });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }
        if(profilePhoto) {
            if(user.profilePhoto) {
                const publicId = user.profilePhoto.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadResponse = await cloudinary.uploader.upload(profilePhoto);
            profilePhoto = uploadResponse.secure_url;
        }
        if(backgroundPhoto) {
            if(user.backgroundPhoto) {
                const publicId = user.profilePhoto.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadResponse = await cloudinary.uploader.upload(backgroundPhoto);
            backgroundPhoto = uploadResponse.secure_url;
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.profilePhoto = profilePhoto || user.profilePhoto;
        user.backgroundPhoto = backgroundPhoto || user.backgroundPhoto;
        user.bio = bio || user.bio;
        user.links = links || user.links;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();
        user.password = undefined;
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error});
    }
}
export const getAllUsers = async (req, res) => {
    try {
        const user = await User.find({
            _id: { $ne: req.user._id },
        });
        if(user.length === 0) return res.status(404).json({ error: 'No users found' });
        res.status(200).json({ users: user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error});
    }
};
export const deleteMyAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({ error: 'User not found' });
        if(user.profilePhoto) {
            const publicId = user.profilePhoto.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
        await Post.deleteMany({ userId: req.user._id });
        await User.findByIdAndDelete(req.user._id);
        res.clearCookie('accessToken', { path: '/' });        
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error});
    }
};
export const getProfileUsers = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if(!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error });
    }
}