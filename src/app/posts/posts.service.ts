import {PostModel} from './post.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: PostModel[] = [];
  private postsUpdated = new Subject<PostModel[]>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts() {
    this.http.get<{ posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((data) => {
        return data.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((posts => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      }));
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/post/' + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: PostModel = {id: null, title, content};
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/post', post)
      .subscribe((response) => {
        post.id = response.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: PostModel = {id, title, content};
    this.http.put('http://localhost:3000/api/post/' + id, post)
      .subscribe((response) => {
        const oldPostIndex = this.posts.findIndex(p => p.id === id);
        this.posts[oldPostIndex] = post;
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    this.http.delete('http://localhost:3000/api/post/' + id)
      .subscribe((result) => {
        this.posts = this.posts.filter(post => post.id !== id);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
