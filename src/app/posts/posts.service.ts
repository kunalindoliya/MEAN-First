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
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe((posts => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      }));
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);

    this.http.post<{ message: string, post: PostModel }>('http://localhost:3000/api/posts', postData)
      .subscribe((response) => {
        const post: PostModel = {id: response.post.id, title, content, imagePath: response.post.imagePath};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: PostModel | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image);
    } else {
      postData = {id, title, content, imagePath: image};
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        const post: PostModel = {id, title, content, imagePath: ''};
        const oldPostIndex = this.posts.findIndex(p => p.id === id);
        this.posts[oldPostIndex] = post;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    this.http.delete('http://localhost:3000/api/posts/' + id)
      .subscribe((result) => {
        this.posts = this.posts.filter(post => post.id !== id);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
