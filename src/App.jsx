import React, { createContext, useEffect, useState } from "react";
import "./app.css";
import Header from "./Header";
import Profile from "./Profile";
import Sidebar from "./Sidebar";
import Tweet from "./Tweet";

export const AppContext = createContext();

function App() {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [user, setUser] = useState({ name: "User", profilePicture: "user.jpg" });
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) =>
        setTweets(
          data.slice(0, 10).map((item) => ({
            id: generateId(),
            text: item.title,
            likes: 0,
            retweets: 0,
            comments: [],
            timestamp: new Date().toISOString(),
          }))
        )
      );
  }, []);

  const handleTweet = () => {
    if (newTweet.trim()) {
      const timestamp = new Date().toISOString();
      setTweets([{ id: generateId(), text: newTweet, likes: 0, retweets: 0, comments: [], timestamp }, ...tweets]);
      setNewTweet("");
    }
  };

  const filteredTweets = tweets.filter((tweet) =>
    tweet.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addComment = (tweetId, comment) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === tweetId
          ? {
              ...tweet,
              comments: [...tweet.comments, { id: generateId(), text: comment, likes: 0, responses: [], timestamp: new Date().toISOString() }],
            }
          : tweet
      )
    );
  };

  const likeComment = (tweetId, commentId) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === tweetId
          ? {
              ...tweet,
              comments: tweet.comments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, likes: comment.likes + 1 }
                  : comment
              ),
            }
          : tweet
      )
    );
  };

  const addResponse = (tweetId, commentId, response) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === tweetId
          ? {
              ...tweet,
              comments: tweet.comments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, responses: [...comment.responses, { id: generateId(), text: response, timestamp: new Date().toISOString() }] }
                  : comment
              ),
            }
          : tweet
      )
    );
  };

  const handleRetweet = (tweetId) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === tweetId ? { ...tweet, retweets: tweet.retweets + 1 } : tweet
      )
    );
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <AppContext.Provider value={{ user, theme, setTheme, setSearchTerm }}>
      <div className={`app ${theme}`}>
        <Header />
        <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        <main className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
          <Profile />
          <div className="tweet-input-container">
            <textarea
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
              placeholder="What's happening?"
            ></textarea>
            <button onClick={handleTweet}>Tweet</button>
          </div>
          <div className="tweets-container">
            {filteredTweets.map((tweet) => (
              <Tweet
                key={tweet.id}
                tweet={tweet}
                onComment={(comment) => addComment(tweet.id, comment)}
                onLikeComment={(commentId) => likeComment(tweet.id, commentId)}
                onRespond={(commentId, response) => addResponse(tweet.id, commentId, response)}
                onRetweet={() => handleRetweet(tweet.id)}
              />
            ))}
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;
