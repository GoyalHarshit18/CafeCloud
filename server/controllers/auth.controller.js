import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { sendOtpMail } from '../utils/mailer.js';

const generateToken = (id, role, secret, expiresIn) => {
    return jwt.sign({ id, role }, secret, { expiresIn });
};


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const signupRequest = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password,
            role: role || 'cashier',
            verified: false,
        });

        const otpCode = generateOTP();
        await Otp.create({
            userId: user._id,
            email: user.email,
            otp: otpCode,
            purpose: 'signup',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });

        try {
            await sendOtpMail(user.email, otpCode, 'signup');
        } catch (mailError) {
            console.error('Email sending failed, but continuing with signup. OTP:', otpCode);
        }

        res.status(201).json({
            message: 'User registered. OTP sent to your email (or check server console).',
            otp: process.env.NODE_ENV === 'development' ? otpCode : undefined // Optionally send OTP in response for easier testing
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifySignup = async (req, res) => {
    const { email, otp } = req.body;

    try {
        console.log(`Verifying signup OTP for: ${email}, OTP: ${otp}`);
        const otpRecord = await Otp.findOne({ email, otp, purpose: 'signup' });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findById(otpRecord.userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        user.verified = true;
        await user.save();

        await Otp.deleteMany({ userId: user._id, purpose: 'signup' });

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role, process.env.JWT_SECRET, '30d'),
            message: 'Email verified successfully. Welcome!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginRequest = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const otpCode = generateOTP();
        await Otp.create({
            userId: user._id,
            email: user.email,
            otp: otpCode,
            purpose: 'login',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        try {
            await sendOtpMail(user.email, otpCode, 'login');
        } catch (mailError) {
            console.error('Email sending failed, but continuing with login request. OTP:', otpCode);
        }

        res.status(200).json({
            message: 'OTP sent for login verification. Please check your email (or server console).',
            otp: process.env.NODE_ENV === 'development' ? otpCode : undefined
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyLogin = async (req, res) => {
    const { email, otp } = req.body;

    try {
        console.log(`Verifying login OTP for: ${email}, OTP: ${otp}`);
        const otpRecord = await Otp.findOne({ email, otp, purpose: 'login' });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findById(otpRecord.userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        await Otp.deleteMany({ userId: user._id, purpose: 'login' });

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role, process.env.JWT_SECRET, '30d'),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
