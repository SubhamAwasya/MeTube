import { User } from "../models/models.js";

// Controller to get a user by their ID
const GetUserByID = async (req, res) => {
  console.log("---------- GetUserByID controller started -------------");

  try {
    const userId = req.params.id; // Extract user ID from request parameters

    // Find user by ID in the database
    const user = await User.findById(userId);
    if (!user) {
      // If user not found, return 404
      return res.status(404).json({ message: "User not found." });
    }

    // Exclude password from the user object before sending the response
    const { password, ...safeUser } = user._doc;
    res.status(200).json(safeUser); // Send sanitized user object
  } catch (error) {
    // Handle and log any server errors
    console.error("user.controller error => ", error);
    res.status(500).json({ message: "Server error while fetching user." });
  }

  console.log("---------- GetUserByID controller ended ---------------");
};

export { GetUserByID };
