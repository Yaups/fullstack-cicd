import { upvoteBlog, deleteBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/messageReducer'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { postBlogComment } from '../reducers/blogsReducer'

export const BlogContainer = ({
  blog,
  user,
  handleUpvote,
  listStyle,
  commentText,
  setCommentText,
  handleComment,
  handleDeletion,
}) => {
  const deleteButton = () => (
    <div style={{ marginTop: 10 }}>
      <button
        className="button is-danger is-outlined"
        onClick={() => handleDeletion()}
      >
        <span>Delete blog</span>
        <span className="icon is-small">
          <i className="fas fa-times"></i>
        </span>
      </button>
    </div>
  )

  return (
    <div className="container is-max-desktop">
      <h1 className="title">
        {blog.title} - {blog.author}
      </h1>
      <br />
      <div>
        <b>Link to blog: </b>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
        <br />
        <br />
        <b>Likes: </b>
        {blog.likes} {''}
        <div>
          <button
            className="button is-small is-rounded"
            onClick={() => handleUpvote()}
          >
            Like
          </button>
        </div>
        <br />
        Posted by {blog.user.name}.
        <br />
        {blog.user.username === user.username && deleteButton()}
        <hr />
        <h3 className="title is-4">Comments on this blog:</h3>
        <ul style={listStyle}>
          {blog.comments.map((comment) => (
            <li key={comment._id}>{comment.text}</li>
          ))}
        </ul>
        <br />
        <form>
          <div className="field">
            <div className="control">
              <input
                placeholder="Your comment here"
                value={commentText}
                onChange={({ target }) => setCommentText(target.value)}
                className="input"
              />
            </div>
          </div>
          <button className="button" type="submit" onClick={handleComment}>
            Post comment
          </button>
        </form>
      </div>
    </div>
  )
}

const Blog = ({ blog }) => {
  const [commentText, setCommentText] = useState('')
  const user = useSelector(({ user }) => user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleUpvote = () => {
    dispatch(upvoteBlog(blog.id, blog))
    dispatch(setNotification(`Blog liked: ${blog.title}`, 5, false))
  }

  const handleDeletion = () => {
    if (window.confirm('Would you really like to delete this post?')) {
      dispatch(deleteBlog(blog.id))
      dispatch(
        setNotification(`Blog ${blog.title} deleted successfully.`, 5, false),
      )
      navigate('/blogs')
    }
  }

  const handleComment = async (event) => {
    event.preventDefault()
    dispatch(postBlogComment(blog, commentText))
    setCommentText('')
  }

  const listStyle = { listStyleType: 'none' }

  if (!blog) return null

  return (
    <BlogContainer
      blog={blog}
      user={user}
      handleUpvote={handleUpvote}
      listStyle={listStyle}
      commentText={commentText}
      setCommentText={setCommentText}
      handleComment={handleComment}
      handleDeletion={handleDeletion}
    />
  )
}

export default Blog
