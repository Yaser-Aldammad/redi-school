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
  const [ searchTerm, setSearchTerm ] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) =>
        setTweets(
          data.slice(0, 10).map((item) => ({
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
          const timestamp = new Date().toISOString(); // Add this line
      setTweets([{ text: newTweet, likes: 0, retweets: 0, comments: [], timestamp }, ...tweets]);
      setNewTweet("");
    }
  };

  const filteredTweets = tweets.filter((tweet) =>
    tweet.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addComment = (index, comment) => {
    const updatedTweets = [ ...tweets ];
    const timestamp = new Date().toISOString();
    updatedTweets[index].comments.push({ text: comment, likes: 0, responses: [], timestamp });
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

  const handleRetweet = (index) => {
    const updatedTweets = [...tweets];
    updatedTweets[index].retweets += 1;
    setTweets(updatedTweets);
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
            {filteredTweets.map((tweet, index) => (
              <Tweet
                key={index}
                tweet={tweet}
                onComment={(comment) => addComment(index, comment)}
                onLikeComment={(commentIndex) => likeComment(index, commentIndex)}
                onRespond={(commentIndex, response) => addResponse(index, commentIndex, response)}
                onRetweet={() => handleRetweet(index)}
              />
            ))}
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;
