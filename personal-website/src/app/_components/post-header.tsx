import Avatar from "./avatar";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";
import { type Author } from "@/interfaces/author";

type Props = {
  title: string;
  date: string;
  author: Author;
};

export function PostHeader({ title, date, author }: Props) {
  return (
    <header className="space-y-6 text-center">
      <PostTitle>{title}</PostTitle>
      <div className="flex flex-col items-center gap-2">
        {/* <Avatar name={author.name} picture={author.picture} /> */}
        <DateFormatter dateString={date} />
      </div>
    </header>
  );
}
