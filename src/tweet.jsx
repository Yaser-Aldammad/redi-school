import { format, formatDistanceToNow } from "date-fns";
import React, { useRef, useState } from "react";

const Tweet = ({ tweet, onComment, onLikeComment, onRespond, onRetweet, onUpdate, onDelete }) => {
  const [likes, setLikes] = useState(tweet.likes);
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedText, setUpdatedText] = useState(tweet.text);
  const commentBoxRef = useRef(null);

  const handleLike = () => setLikes(likes + 1);

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
    if (!showCommentBox) commentBoxRef.current?.focus();
  };

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(newComment);
      setNewComment("");
      setShowCommentBox(false);
    }
  };

const handleUpdate = () => {
  if (updatedText.trim()) {
    onUpdate(tweet.id, updatedText);
    setIsEditing(false); // Exit edit mode on success
  } else {
    alert("Tweet content cannot be empty!"); // Handle empty input
  }
};

  return (
    <div className="tweet">
      {isEditing ? (
        <div>
          <textarea
            value={updatedText}
            onChange={(e) => setUpdatedText(e.target.value)}
          ></textarea>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <p>{tweet.text}</p>
      )}
      <div className="tweet-actions">
        <small className="tweet-timestamp">
          {format(new Date(tweet.timestamp), "MMM d, yyyy h:mm a")} (
          {formatDistanceToNow(new Date(tweet.timestamp), { addSuffix: true })})
        </small>
        <span className="icon" onClick={handleLike}>❤️ {likes}</span>
        <span className="icon" onClick={toggleCommentBox}>💬</span>
        <span className="icon" onClick={onRetweet}>🔁 {tweet.retweets}</span>
        <span className="icon" onClick={() => setIsEditing(true)}>✏️ Edit</span>
        <span className="icon" onClick={() => onDelete(tweet.id)}>🗑️ Delete</span>
      </div>
      {showCommentBox && (
        <div className="comment-box">
          <textarea
            ref={commentBoxRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          ></textarea>
          <button onClick={handleComment}>Add Comment</button>
        </div>
      )}
      {tweet.comments.length > 0 && (
        <div className="comments">
          {tweet.comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onLike={() => onLikeComment(comment.id)}
              onRespond={(response) => onRespond(comment.id, response)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Comment = ({ comment, onLike, onRespond }) => {
  const [newResponse, setNewResponse] = useState("");
  const [showResponseBox, setShowResponseBox] = useState(false);

  const handleResponse = () => {
    if (newResponse.trim()) {
      onRespond(newResponse);
      setNewResponse("");
      setShowResponseBox(false);
    }
  };

  return (
    <div className="comment">
      <p>{comment.text}</p>
      <small className="tweet-timestamp">
        {format(new Date(comment.timestamp), "MMM d, yyyy h:mm a")} (
        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })})
      </small>
      <div className="comment-actions">
        <span className="icon" onClick={onLike}>❤️ {comment.likes}</span>
        <span className="icon" onClick={() => setShowResponseBox(!showResponseBox)}>↩️</span>
      </div>
      {showResponseBox && (
        <div className="response-box">
          <textarea
            value={newResponse}
            onChange={(e) => setNewResponse(e.target.value)}
            placeholder="Write a response..."
          ></textarea>
          <button onClick={handleResponse}>Add Response</button>
        </div>
      )}
      {comment.responses.length > 0 && (
        <div className="responses">
          {comment.responses.map((response) => (
            <div key={response.id} className="response">
              <p>{response.text}</p>
              <small className="tweet-timestamp">
                {format(new Date(response.timestamp), "MMM d, yyyy h:mm a")} (
                {formatDistanceToNow(new Date(response.timestamp), { addSuffix: true })})
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tweet;
