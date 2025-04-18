import { Comment } from "../models/models.js";

// Controller to handle adding a new comment
const AddComment = async (req, res) => {
  try {
    // Extract required fields from request body
    const { videoId, userId, comment } = req.body;

    // Validate that all fields are provided
    if (!videoId || !userId || !comment) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new comment document
    const newComment = new Comment({
      videoId,
      userId,
      comment,
    });

    // Save the new comment to the database
    const savedComment = await newComment.save();

    // Respond with the saved comment
    res.status(201).json(savedComment);
  } catch (error) {
    // Handle errors during comment creation
    console.error("AddComment error =>", error);
    res.status(500).json({ message: "Failed to add comment." });
  }
};

// Controller to retrieve all comments for a specific video
const GetComments = async (req, res) => {
  try {
    // Extract videoId from URL parameters
    const { videoId } = req.params;

    // Find and sort comments by creation time (latest first)
    const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });

    // Send the list of comments
    res.status(200).json(comments);
  } catch (error) {
    // Handle errors during comment retrieval
    console.error("GetComments error =>", error);
    res.status(500).json({ message: "Failed to get comments." });
  }
};

// Controller to delete a comment by its ID
const DeleteComment = async (req, res) => {
  try {
    // Extract comment ID from URL parameters
    const { id } = req.params;

    // Find the comment by ID and delete it
    const deletedComment = await Comment.findByIdAndDelete(id);

    // If no comment found, return not found error
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Send success message after deletion
    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    // Handle errors during comment deletion
    console.error("DeleteComment error =>", error);
    res.status(500).json({ message: "Failed to delete comment." });
  }
};

export { AddComment, GetComments, DeleteComment };
