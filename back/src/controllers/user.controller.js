import { Business } from "../models/bussiness.model.js";
import { User } from "../models/user.model.js";

const addBusiness = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const { businessName, category, streetAddress, city, state, zipCode, phoneNumber, website, rating } = req.body;

        if (!businessName || !phoneNumber) {
            return res.status(400).json({ message: "Business name and phone number are mandatory" });
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ message: "Invalid Indian phone number" });
        }

      

        const websiteRegex = (v) => !v || /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(String(v));
        if (!websiteRegex(website)) {  
            return res.status(400).json({ message: "Invalid URL" });
        }

        const newBusiness = await Business.create({
            user: user._id,
            businessName,
            category,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            website,
            rating
        });

        user.businesses.push(newBusiness._id);
        await user.save();

        return res.status(201).json({ message: "Business created successfully", business: newBusiness });
    } catch (error) {
        console.error("Error creating business:", error);
        return res.status(500).json({ message: "Error while creating business" });
    }
};


const editBusiness = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const { id: businessId } = req.params; // FIXED: Use 'id' instead of 'businessId'
        if (!businessId) {
            return res.status(400).json({ message: "Business ID is required" });
        }

        const { businessName, category, streetAddress, city, state, zipCode, phoneNumber, website, rating } = req.body;

        const updateData = {};
        if (businessName) updateData.businessName = businessName;
        if (category) updateData.category = category;
        if (streetAddress) updateData.streetAddress = streetAddress;
        if (city) updateData.city = city;
        if (state) updateData.state = state;
        if (zipCode) updateData.zipCode = zipCode;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (website) updateData.website = website;
        if (rating !== undefined) updateData.rating = rating;

        const updatedBusiness = await Business.findByIdAndUpdate(
            businessId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedBusiness)
            return res.status(404).json({ message: "Business not found" });

        return res.status(200).json({ message: "Business updated successfully", business: updatedBusiness });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating the business",
            error: error.message || "Unknown error"
        });
    }
};

const deleteBusiness = async (req, res) => {
    try {
        const { businessId } = req.body;

        if (!businessId) {
            return res.status(400).json({ message: "Business ID is required" });
        }

        const business = await Business.findByIdAndDelete(businessId);
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }

        return res.status(200).json({ message: "Business deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting business", error });
    }
};

const viewAllBusiness = async (req, res) => {
    try {
        const business = await Business.find();
        if (business.length === 0) {
            return res.status(404).json({ message: "No business found" });
        }
        return res.status(200).json(business);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getUserBusiness = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('businesses');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.businesses || user.businesses.length === 0) {
            return res.status(404).json({ message: "No businesses found for this user" });
        }

        return res.status(200).json({ businesses: user.businesses });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const searchBusiness = async (req, res) => {
    try {
        const { keyword } = req.query;

        const business = await Business.find({
            $or: [
                { businessName: { $regex: keyword, $options: "i" } },
                { city: { $regex: keyword, $options: "i" } }
            ],
        });

        if (business.length === 0)
            return res.status(404).json({ message: "No business found" });

        return res.status(200).send(business);
    } catch (error) {
        return res.status(500).json({ message: "error in finding business" });
    }
};

const userProfile = async (req, res) => {
    try {
        const jwt = req.headers.authorization?.split(" ")[1];

        if (!jwt) {
            return res.status(404).send({ error: "token not found" })
        }

        // const user = await getUserProfile(jwt)
        const userId = await User.getUserIdByToken(jwt);
        const user = await User.findById(userId)
            .populate("businesses");

        if (!user)
            throw new Error("user is not found with given token")

        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}



export { addBusiness, editBusiness, userProfile, deleteBusiness, viewAllBusiness, getUserBusiness, searchBusiness };
