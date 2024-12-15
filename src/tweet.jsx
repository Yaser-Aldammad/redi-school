import { format, formatDistanceToNow } from "date-fns";
import React, { useRef, useState } from "react";




const Tweet = ({ tweet, onComment, onLikeComment, onRespond, onRetweet }) => {
  const [likes, setLikes] = useState(tweet.likes);
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
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

  return (
    <div className="tweet">
      <p>{tweet.text}</p>
      <div className="tweet-actions">
        <small className="tweet-timestamp">
          {/* Format timestamp */}
          {format(new Date(tweet.timestamp), "MMM d, yyyy h:mm a")} (
          {formatDistanceToNow(new Date(tweet.timestamp), { addSuffix: true })})
        </small>
        <span className="icon" onClick={handleLike}>❤️ {likes}</span>
        <span className="icon" onClick={toggleCommentBox}>💬</span>
        <span className="icon" onClick={onRetweet}>🔁 {tweet.retweets}</span>
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
          {tweet.comments.map((comment, index) => (
            <Comment
              key={index}
              comment={comment}
              onLike={() => onLikeComment(index)}
              onRespond={(response) => onRespond(index, response)}
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
      const timestamp = new Date().toISOString();
      onRespond({ text: newResponse, timestamp });
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
          {comment.responses.map((response, index) => (
            <div key={index} className="response">
              <p>{response.text}</p>
             <small className="tweet-timestamp">
                {format(new Date(response.timestamp), "MMM d, yyyy h:mm a")} (
                {formatDistanceToNow(new Date(response.timestamp), { addSuffix: true })})
              </small>  </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tweet;
