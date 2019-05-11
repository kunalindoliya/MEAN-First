import {Component, Input} from '@angular/core';
import {PostModel} from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  /*posts = [
    {title: 'First Post', content: 'This is the first component '},
    {title: 'Second Post', content: 'This is the second component '},
    {title: 'Third Post', content: 'This is the third component '}
  ];*/
  @Input()
  posts: PostModel[] = [];
}
