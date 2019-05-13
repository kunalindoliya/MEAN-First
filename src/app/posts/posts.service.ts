import {PostModel} from './post.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: PostModel[] = [];
  private postsUpdated = new Subject<PostModel[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    // tslint:disable-next-line:no-unused-expression
    this.http.get<{posts: PostModel[]}>('http://localhost:3000/api/posts')
      .subscribe((data => {
        this.posts = data.posts;
        this.postsUpdated.next([...this.posts]);
      }));
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: PostModel = {title, content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
