import {Component, EventEmitter, Output} from '@angular/core';
import {PostModel} from '../post.model';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  title;
  content;
  @Output()
  postCreated = new EventEmitter<PostModel>();

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const post: PostModel = {
      title: form.value.title,
      content: form.value.content
    };
    this.postCreated.emit(post);
  }
}
