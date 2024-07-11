import { Bookmark } from "@/model/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    bookmarks?: Array<Bookmark>
}