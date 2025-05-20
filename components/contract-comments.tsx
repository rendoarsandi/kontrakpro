typescriptreact
"use client";

import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  contractId: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  replies?: Comment[];
}

interface CommentsSectionProps {
  contractId: string;
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ contractId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [contractId]);

  const fetchComments = async () => {
    // TODO: Implement fetching comments from the backend API
    // const response = await fetch(`/api/contracts/${contractId}/comments`);
    // const data = await response.json();
    // setComments(data);

    // Placeholder data for now
    const placeholderComments: Comment[] = [
      { id: '1', userId: 'user1', userName: 'Alice Smith', contractId: contractId, content: 'Great contract draft!', createdAt: new Date().toISOString(), parentId: null, replies: [] },
      { id: '2', userId: 'user2', userName: 'Bob Johnson', contractId: contractId, content: 'Should we review section 3?', createdAt: new Date(Date.now() - 60000).toISOString(), parentId: null, replies: [] },
      { id: '3', userId: 'user1', userName: 'Alice Smith', contractId: contractId, content: 'Good point Bob.', createdAt: new Date(Date.now() - 30000).toISOString(), parentId: '2' },
    ];

    setComments(buildThreadedComments(placeholderComments));
  };

  const buildThreadedComments = (flatComments: Comment[]): Comment[] => {
    const commentMap: { [key: string]: Comment } = {};
    const rootComments: Comment[] = [];

    flatComments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    flatComments.forEach(comment => {
      if (comment.parentId !== null && commentMap[comment.parentId]) {
        commentMap[comment.parentId].replies?.push(commentMap[comment.id]);
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };


  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      contractId,
      content: newComment,
      parentId: replyTo,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
    };

    // TODO: Implement sending new comment to the backend API
    // const response = await fetch(`/api/contracts/${contractId}/comments`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(commentData),
    // });
    // const addedComment = await response.json();

    // For now, add to placeholder data
    const addedComment: Comment = {
      ...commentData,
      id: `temp-${Date.now()}`, // Temporary ID
      createdAt: new Date().toISOString(),
      replies: []
    };


    if (replyTo) {
        // Find parent and add reply (this needs refinement for deep nesting)
        const updatedComments = comments.map(comment => {
            if (comment.id === replyTo) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), addedComment]
                };
            }
            return comment;
        });
        setComments(updatedComments);
    } else {
        setComments([...comments, addedComment]);
    }


    setNewComment('');
    setReplyTo(null);
    // TODO: Refetch comments or update state more efficiently after successful backend call
  };

  const handleReplyClick = (commentId: string) => {
    setReplyTo(commentId);
    // Optionally scroll to the new comment input
    const inputElement = document.getElementById('new-comment-textarea');
    if (inputElement) {
        inputElement.focus();
    }
  };

  const renderComment = (comment: Comment) => (
    <div key={comment.id} className={`flex space-x-4 ${comment.parentId ? 'ml-8 mt-4' : 'mt-4'}`}>
      <Avatar>
        <AvatarImage src={comment.userAvatar} />
        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{comment.userName}</span>
          <span className="text-sm text-gray-500">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
        </div>
        <p className="text-gray-700 mt-1">{comment.content}</p>
        <Button variant="link" size="sm" onClick={() => handleReplyClick(comment.id)} className="pl-0 mt-1">Reply</Button>
        {(comment.replies && comment.replies.length > 0) && (
          <div className="mt-4 border-l pl-4">
            {comment.replies.map(reply => renderComment(reply))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Textarea
            id="new-comment-textarea"
            placeholder={replyTo ? 'Add a reply...' : 'Add a comment...'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
             {replyTo && (
                 <Button variant="ghost" onClick={() => setReplyTo(null)} className="mr-2">Cancel Reply</Button>
             )}
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>Submit</Button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {comments.map(comment => renderComment(comment))}
        </div>
      </CardContent>
       <CardFooter>
           {/* Optional footer content */}
       </CardFooter>
    </Card>
  );
};

export default CommentsSection;