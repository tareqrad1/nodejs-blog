import User from '../models/user.model.js';
import { validateSchema } from '../utils/validateSchema.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../lib/generateTokenAndSetCookie.js';

export const register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const { error } = validateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ error: 'User already exists' });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: {
            ...newUser._doc,
            password: undefined,
        }});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error});
    }
};
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
