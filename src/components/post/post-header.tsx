import DateFormatter from "../date-formatter";
import { PostTitle } from "./post-title";


type Props = {
    title: string;
    date: string;
};

export function PostHeader({title, date}: Props) {
    return (
        <>
            <PostTitle>{title}</PostTitle>
            <div className="mb-6 text-lg">
                <DateFormatter dateString={date} />
            </div>
        </>
    )
}