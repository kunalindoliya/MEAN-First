import {PostModel} from './post.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';


@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: PostModel[] = [];
  private postsUpdated = new Subject<{posts: PostModel[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParam = `?pageSize=${postsPerPage}&currentPage=${currentPage}`;
    this.http.get<{ posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParam)
      .pipe(map((data) => {
        return {
          posts: data.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }), maxPosts: data.maxPosts
        };
      }))
      .subscribe((transformedData => {
        this.posts = transformedData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedData.maxPosts});
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
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + id);
  }
}
