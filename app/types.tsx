export interface UserContextTypes {
    user: User | null;
    register: (name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkUser: () => Promise<void>;
}
export interface VideoContextType {
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    isMuted: boolean;
    setIsMuted: (isMuted: boolean) => void;
}
export interface ShareModalProps {
    isOpen: boolean;
    closeModal: () => void;
    postUrl: string;
    postText: string;
}
export interface User {
    id: string,
    name: string,
    bio: string,
    image: string,
}
export interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    group_id: string | null;
    message: string;
    created_at: string;
    profile?: {
        user_id: string;
        name: string;
        image: string;
    }
}
export interface Profile {
    id: string;
    user_id: string;
    name: string;
    image: string;
    bio: string;
    followersCount: number;
    followingCount: number;
}

export interface RandomUsers {
    id: string;
    name: string;
    image: string;
}

export interface CropperDimensions {
    height?: number | null;
    width?: number | null;
    left?: number | null;
    top?: number | null;
}

export interface Like {
    id: string;
    user_id: string;
    post_id: string;
}

export interface Post {
    id: string;
    user_id: string;
    video_url: string;
    text: string;
    created_at: string;
}

export interface PostWithProfile {
    id: string;
    user_id: string;
    video_url: string;
    text: string;
    created_at: string;
    profile: {
        user_id: string;
        name: string;
        image: string;
    }
}

export interface CommentWithProfile {
    id: string;
    user_id: string;
    post_id: string;
    text: string;
    created_at: string;
    profile: {
        user_id: string;
        name: string;
        image: string;
    }
}

export interface Comment {
    id: string;
    user_id: string;
    post_id: string;
    text: string;
    created_at: string;
}

export interface ShowErrorObject {
    type: string;
    message: string;
}

export interface UploadError {
    type: string;
    message: string;
}

//////////////////////////////////////////////
//////////////////////////////////////////////

// COMPONENT TYPES
export interface CommentsHeaderCompTypes {
    params: { userId: string; postId: string; };
    post: PostWithProfile
}

export interface CommentsCompTypes {
    params: { userId: string; postId: string; };
}

export interface PostPageTypes {
    params: { userId: string; postId: string; };
}

export interface ProfilePageTypes {
    params: { id: string; };
}

export interface SingleCommentCompTypes {
    params: { userId: string; postId: string; };
    comment: CommentWithProfile
}

export interface PostUserCompTypes {
    post: Post
}

export interface PostMainCompTypes {
    post: PostWithProfile
}

export interface PostMainLikesCompTypes {
    post: PostWithProfile
}

export interface TextInputCompTypes {
    string: string;
    inputType: string;
    placeholder: string;
    onUpdate: (newValue: string) => void;
    error: string;
}


//////////////////////////////////////////////
//////////////////////////////////////////////

// LAYOUT INCLUDE TYPES
export interface MenuItemTypes {
    iconString: string,
    colorString: string,
    sizeString: string
}

export interface MenuItemFollowCompTypes {
    user: RandomUsers
}