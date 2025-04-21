import User from '../models/user.model.js';
import { validateSchema } from '../utils/validateSchema.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../lib/generateTokenAndSetCookie.js';
import { sendResetPasswordEmail, sendVerificationEmail, sendWelcomeEmail } from '../emails/emails.js';
import crypto from 'crypto';


export const register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const { error } = validateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const userExist = await User.findOne({ email });
        if(userExist) {
            return res.status(400).json({ error: 'User already exists' });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            name,
            email,
            password: hashedPassword,
            isActive: false,
            verificationCode: code,
            verificationCodeExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
            resetToken: undefined,
            resetTokenExpires: undefined,
        });
        await user.save();
        await sendVerificationEmail(user.email, code);
        res.status(201).json({ message: 'User registered successfully', user: {
            ...user._doc,
            password: undefined,
        }});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error});
    }
};
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    if(!code) return res.status(400).json({ error: 'Verification code is required' });
    try {
        const user = await User.findOne({
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        });
        if(!user) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        };
        user.isActive = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error});
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ error: 'email or password is incorrect' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ error: 'email or password is incorrect' });
        }
        await generateTokenAndSetCookie(user._id, res);
        res.status(200).json({ message: 'User logged in successfully', user: {
            ...user._doc,
            password: undefined,
        }});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error});
    }
};
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if(!email) return res.status(400).json({ error: 'Email is required' });
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const token = crypto.randomBytes(16).toString('hex');
        console.log('token-', token);
        user.resetToken = token;
        user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/auth/reset-password/${token}`);

        res.status(200).json({ message: 'Reset password link sent to your email' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error});
    }
}
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    if(!token) return res.status(400).json({ error: 'Token is required' });
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() }
        });
        if(!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        };
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
        if (!regex.test(newPassword)) {
            return res.status(400).json({ error: 'New password must be 6-15 characters long, contain at least one letter and one number.' });
        }
        if(!newPassword || !confirmPassword) {
            return res.status(400).json({ error: 'New password and confirm password are required' });
        }
        if(newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error});
    }
}
export const logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.status(200).json({ message: 'User logged out successfully' });
};
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user) {
            return res.status(401).json({ error: 'Unauthorized: User Not Found' });
        };
        res.status(200).json({ message: 'User is authenticated', user: {
            ...user._doc,
            password: undefined,
        }});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error});
    }
};
