let users = [
  { id: "1", name: "Samrth", email: "sam@gmail.com", age: 20 },
  { id: "2", name: "Pragati", email: "pra@gmail.com", age: 30 },
  { id: "3", name: "prashant", email: "prashantbhat@gmail.com" }
];
let posts = [
  {
    id: "1",
    title: "my post 1",
    body: "my first post",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "my post 2",
    body: "my second post",
    published: true,
    author: "3"
  },
  {
    id: "3",
    title: "my post 3",
    body: "my third post",
    published: false,
    author: "3"
  }
];
let comments = [
  { id: "102", text: "comment1", author: "1", post: "1" },
  { id: "103", text: "comment2", author: "1", post: "2" },
  { id: "104", text: "comment3", author: "3", post: "3" },
  { id: "105", text: "commen41", author: "3", post: "3" }
];
const db = {
  users,
  posts,
  comments
};
export { db as default };
