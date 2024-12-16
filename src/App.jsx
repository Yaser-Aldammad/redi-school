import React, { createContext, useEffect, useState } from "react";
import "./app.css";
import Header from "./Header";
import Profile from "./Profile";
import Sidebar from "./Sidebar";
import Tweet from "./Tweet";

export const AppContext = createContext();

function App() {
  const [tweets, setTweets] = useState([]);// list all tweets
  const [newTweet, setNewTweet] = useState(""); // conent of new tweet
  const [user, setUser] = useState({ name: "User", profilePicture: "user.jpg" }); // info about logged in user
  const [theme, setTheme] = useState("light"); // dark VS light
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const apiEndpoint = "https://jsonplaceholder.typicode.com/posts";

  const generateId = () => Math.random().toString(36).substring(2, 9);


useEffect(() => {
  const fetchTweets = () => {
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        setTweets(
          data.slice(0, 10).map(item => ({
            id: generateId(),
            text: item.title,
            likes: 0,
            retweets: 0,
            comments: [],
            timestamp: new Date().toISOString(),
          }))
        );
      });
  };

  fetchTweets();
}, [apiEndpoint]);



/*   useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        setTweets(
          data.slice(0, 10).map((item) => ({
            id: generateId(),
            text: item.title,
            likes: 0,
            retweets: 0,
            comments: [],
            timestamp: new Date().toISOString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    fetchTweets();
  }, []);
 */



  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTweet = async () => {
    if (newTweet.trim()) {
      try {
        const timestamp = new Date().toISOString();
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTweet, body: newTweet, userId: 1, timestamp }),
        });
        const newTweetData = await response.json();
        setTweets([{ ...newTweetData, id: generateId(), text: newTweet, likes: 0, retweets: 0, comments: [], timestamp }, ...tweets]);
        setNewTweet("");
      } catch (error) {
        console.error("Error creating tweet:", error);
      }
    }
  };

const updateTweet = async (tweetId, updatedText) => {
  try {
    const response = await fetch(`${apiEndpoint}/${tweetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: updatedText }),
    });

    // Simulate the updated tweet for local use
    const updatedTweet = await response.json();

    // Update the local state
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === tweetId ? { ...tweet, text: updatedTweet.title || updatedText } : tweet
      )
    );
  } catch (error) {
    console.error("Error updating tweet:", error);
    // Fallback: Ensure the UI updates even if the API fails
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === tweetId ? { ...tweet, text: updatedText } : tweet
      )
    );
  }
};


  const deleteTweet = async (tweetId) => {
    try {
      await fetch(`${apiEndpoint}/${tweetId}`, { method: "DELETE" });
      setTweets((prevTweets) => prevTweets.filter((tweet) => tweet.id !== tweetId));
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  const addComment = (tweetId, comment) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === tweetId
          ? { ...tweet, comments: [...tweet.comments, { id: generateId(), text: comment, likes: 0, responses: [], timestamp: new Date().toISOString() }] }
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
                comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
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

  const filteredTweets = tweets.filter((tweet) =>
    tweet.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <AppContext.Provider value={{ user, theme, setTheme, setSearchTerm }}> {/* AppContext to share global data such as user, themes ...etc*/}
      <div className={`app ${theme}`}>
        <Header />
        <Sidebar
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
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
                onUpdate={updateTweet}
                onDelete={deleteTweet}
              />
            ))}
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;
