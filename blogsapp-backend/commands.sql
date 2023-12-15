CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);


insert into blogs (author, url, title) values ('Nathan Sebhastian', 'https://www.freecodecamp.org/news/javascript-arrow-functions-in-depth/', 'How to Use JavaScript Arrow Functions - Explained in Detail');
insert into blogs (author, url, title) values ('David Deal', 'https://hackernoon.com/rick-rubin-and-the-human-touch-can-ai-replace-human-instinct', 'Can AI Replace Human Instinct?');



insert into user_blogs (user_id, blog_id) values (1, 1);
insert into user_blogs (user_id, blog_id) values (1, 2);
insert into user_blogs (user_id, blog_id) values (1, 3);
insert into user_blogs (user_id, blog_id) values (2, 2);
insert into user_blogs (user_id, blog_id) values (2, 4);

