export class Tag {
  label: string;
  constructor(label = '') {
    this.label = label;
  }
}

export class User {
  name: string;
  email: string;
  constructor(data: any = {}) {
    this.name = data.name;
    this.email = data.email;
  }
}

export class Task {
  id: number;
  title:  string;
  description: string;
  tags: Tag[] = [];
  favorite: boolean;
  state: string;
  assignee: User;

  constructor(data: any = {}) {
    this.id = data.id || null;
    this.title = data.title;
    this.description = data.description;
    this.tags = (data.tags || []).map((tag) => new Tag(tag.label));
    this.favorite = data.favorite;
    this.state = data.state;
    this.assignee = new User(data.assignee);
  }
}
