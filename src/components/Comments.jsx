import { Comment } from "./Comment"

export const Comments = ({ comments, postAuthorId, setComments, postId }) => {
  return (
    <ul className="comments">
        {comments.map(comment => (
            <li key={comment.id}><Comment comment={comment} postAuthorId={postAuthorId} setComments={setComments} postId={postId} /></li>
        ))}
    </ul>
  )
}