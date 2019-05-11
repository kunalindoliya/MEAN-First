import {PostModel} from './post.model';
import {Injectable} from '@angular/core';

@Injectable()
export class PostsService {
  posts: PostModel[] = [];

  getPosts() {
    return [...this.posts];
  }

  addPost(title: string, content: string) {
    const post: PostModel = {title, content};
    this.posts.push(post);
  }
}
