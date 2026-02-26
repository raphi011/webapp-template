import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";

type PostCardProps = {
  title: string;
  content: string;
  authorName: string;
  createdAt: Date;
};

function PostCard({ title, content, authorName, createdAt }: PostCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
          {content}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{authorName}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={createdAt.toISOString()}>
            {createdAt.toLocaleDateString()}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}

export { PostCard };
export type { PostCardProps };
