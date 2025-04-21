import { stripe } from '../config/connectStripe.js';
import User from '../models/user.model.js';

export const createCheckoutSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            amount: 9000, // Amount in cents ($90.00)
            currency: 'usd',
            description: 'Account Verification Payment',
            success_url: `${process.env.CLIENT_URL}/verify-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/verify-cancel`,
        });
        res.status(200).json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create Stripe session' });
    }
};
export const checkoutSuccess = async (req, res) => {
    const { sessionId } = req.body;
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if(session.payment_status === 'paid') {
            await User.findByIdAndUpdate(req.user._id, { accountVerification: true });
            res.status(200).json({ message: 'Payment successful and account verified' });
        }else {
            res.status(400).json({ error: 'Payment not successful' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to process checkout success' });
    }
}