import React, { useState } from "react";
import "./app.css";

function App() {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");

  const handleTweet = () => {
    if (newTweet.trim()) {
      setTweets([
        { text: newTweet, likes: 0, comments: [] }, // Initialize likes and comments
        ...tweets,
      ]);
      setNewTweet("");
    }
  };

  const addComment = (index, comment) => {
    const updatedTweets = [...tweets];
    updatedTweets[index].comments.push({ text: comment, likes: 0, responses: [] });
    setTweets(updatedTweets);
  };

  const toggleLike = (index) => {
    const updatedTweets = [...tweets];
    updatedTweets[index].likes += 1;
    setTweets(updatedTweets);
  };

  const likeComment = (tweetIndex, commentIndex) => {
    const updatedTweets = [...tweets];
    updatedTweets[tweetIndex].comments[commentIndex].likes += 1;
    setTweets(updatedTweets);
  };

  const addResponse = (tweetIndex, commentIndex, response) => {
    const updatedTweets = [...tweets];
    updatedTweets[tweetIndex].comments[commentIndex].responses.push(response);
    setTweets(updatedTweets);
  };

  return (
    <section className="tweet-section">
      <div className="tweet-input-container">
        <textarea
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
          placeholder="What's happening?"
        ></textarea>
        <button onClick={handleTweet}>Tweet</button>
      </div>
      <div className="tweets-container">
        {tweets.map((tweet, index) => (
          <Tweet
            key={index}
            tweet={tweet}
            onLike={() => toggleLike(index)}
            onComment={(comment) => addComment(index, comment)}
            onLikeComment={(commentIndex) => likeComment(index, commentIndex)}
            onRespond={(commentIndex, response) => addResponse(index, commentIndex, response)}
          />
        ))}
      </div>
    </section>
  );
}

function Tweet({ tweet, onLike, onComment, onLikeComment, onRespond }) {
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(newComment);
      setNewComment(""); // Clear the comment box
      setShowCommentBox(false); // Close the comment box
    }
  };

  return (
    <div className="tweet">
      <p>{tweet.text}</p>
      <div className="tweet-actions">
        <span className="icon" onClick={onLike}>
          ❤️ {tweet.likes}
        </span>
        <span
          className="icon"
          onClick={() => setShowCommentBox(!showCommentBox)}
        >
          💬
        </span>
      </div>
      {showCommentBox && (
        <div className="comment-box">
          <textarea
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
}

function Comment({ comment, onLike, onRespond }) {
  const [newResponse, setNewResponse] = useState("");
  const [showResponseBox, setShowResponseBox] = useState(false);

  const handleResponse = () => {
    if (newResponse.trim()) {
      onRespond(newResponse);
      setNewResponse(""); // Clear the textarea
      setShowResponseBox(false); // Close the response box
    }
  };

  return (
    <div className="comment">
      <p>{comment.text}</p>
      <div className="comment-actions">
        <span className="icon" onClick={onLike}>
          ❤️ {comment.likes}
        </span>
        <span
          className="icon"
          onClick={() => setShowResponseBox(!showResponseBox)}
        >
          ↩️
        </span>
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
            <p key={index} className="response">{response}</p>
          ))}
        </div>
      )}
    </div>
  );
}


export default App;
