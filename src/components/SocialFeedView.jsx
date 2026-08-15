import React from 'react';
import { Heart, MessageCircle, Share2, Video, Camera, Type } from 'lucide-react';
import { socialFeed } from '../data/pets';
import './SocialFeedView.css';

const SocialFeedView = () => {
  const renderIcon = (platform) => {
    switch(platform) {
      case 'tiktok': return <Video size={16} />;
      case 'instagram': return <Camera size={16} />;
      case 'facebook': return <Type size={16} />;
      default: return null;
    }
  };

  return (
    <div className="view-container social-feed-view">
      <h2 className="view-title">Community Feed</h2>
      
      <div className="feed-container">
        {socialFeed.map(post => (
          <div key={post.id} className="social-post glass-panel">
            <div className="post-header">
              <div className={`platform-badge ${post.platform}`}>
                {renderIcon(post.platform)}
                <span style={{textTransform: 'capitalize'}}>{post.platform}</span>
              </div>
              <span className="author">{post.author}</span>
            </div>

            {post.type === 'video' && post.mediaUrl && (
              <div className="post-media video-container">
                <video 
                  src={post.mediaUrl} 
                  controls 
                  loop 
                  muted 
                  playsInline
                  className="post-video"
                />
              </div>
            )}

            {post.type === 'image' && post.mediaUrl && (
              <div className="post-media">
                <img src={post.mediaUrl} alt="Post content" className="post-image" />
              </div>
            )}

            <div className="post-content">
              <p>{post.content}</p>
            </div>

            <div className="post-actions">
              <button className="action-stat">
                <Heart size={18} /> {post.likes}
              </button>
              <button className="action-stat">
                <MessageCircle size={18} /> {post.comments}
              </button>
              <button className="action-stat share">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialFeedView;
