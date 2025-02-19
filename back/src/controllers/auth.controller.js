import { User } from "../models/user.model.js";


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateToken()

        user.accessToken = accessToken;
        await user.save({ validateBeforeASave: false });

        return accessToken

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

const register = async (req, res) => {
    try {
        const { name, password, email } = req.body;

        if (!name || !password || !email)
            return res.status(400).json({ message: "All fields are required" });

        const existUser = await User.findOne({ email });
        if (existUser)
            return res.status(400).json({ message: "User already exists" });

        let role = 'user';
        if (email === 'admin303@gmail.com') {
            role = 'admin';
        }

        const user = await User.create({
            name,
            password,
            email,
            role
        });

        if (!user)
            return res.status(500).json({ message: "Something went wrong" });

        const createdUser = await User.findById(user._id).select("-password");

        const accessToken = await generateAccessTokenAndRefreshToken(user._id);

        return res.status(200).json({ user: createdUser, accessToken });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "All credentials required" });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User does not exist" });

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid)
            return res.status(400).json({ message: "Invalid password" });

        const accessToken = await generateAccessTokenAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password");

        return res.status(200).json({ user: loggedInUser, accessToken });

    } catch (error) {
        res.status(500).json({ message: "Error while logging in" });
    }
};



export { register, login }