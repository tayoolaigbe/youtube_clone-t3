interface Comment {
  comment: {
    id: string;
    message: string;
    createdAt: Date;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
    handle: string | null;
  };
}

interface CommentSectionProps {
  videoId: string;
  comments: Comment[];
  refetch: () => Promise<unknown>;
}

const CommentSection = ({
  videoId,
  comments,
  refetch,
}: CommentSectionProps) => {
  return <>Hello Comment</>;
};

export default CommentSection;
