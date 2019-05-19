import {PostModel} from './post.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl+'/posts/';

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: PostModel[] = [];
  private postsUpdated = new Subject<{
    posts: PostModel[];
    postCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParam = `?pageSize=${postsPerPage}&currentPage=${currentPage}`;
    this.http
      .get<{ posts: any; maxPosts: number }>(
        BACKEND_URL + queryParam
      )
      .pipe(
        map(data => {
          return {
            posts: data.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: data.maxPosts
          };
        })
      )
      .subscribe(transformedData => {
        this.posts = transformedData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedData.maxPosts
        });
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image);

    this.http
      .post<{ message: string; post: PostModel }>(
        BACKEND_URL,
        postData
      )
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: PostModel | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image);
    } else {
      postData = { id, title, content, imagePath: image, creator: null };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(id: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + id);
  }
}
