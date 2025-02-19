import { User } from "../models/user.model.js";

const userAuthenticate = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];

        try {
            const userId = await User.getUserIdByToken(token);
            const user = await User.findById(userId);

            if (!user) {
                return res.status(401).json({ message: "User is not found" });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        return res.status(401).json({ message: "Token not provided" });
    }
};

export default userAuthenticate;
